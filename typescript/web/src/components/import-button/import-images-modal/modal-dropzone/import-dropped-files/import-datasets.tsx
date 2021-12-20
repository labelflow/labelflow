import { ApolloClient, gql } from "@apollo/client";
import { ExportFormat } from "@labelflow/graphql-types";
import { v4 as uuidv4 } from "uuid";
import mime from "mime-types";

import Bluebird from "bluebird";
import { uploadFile } from "../../../../../utils/upload-file";
import { DroppedFile, SetUploadStatuses } from "../../types";

/**
 * Maximum number of datasets that can be imported at once.
 *
 * Increasing this number should reduce potentials bottlenecks,
 * and thus, make the upload faster.
 * For example, if the user uploads faster than the datasets are processed on
 * the server, then the upload would be delayed until import is fully finished.
 *
 * However, increasing this number will also increase the number
 * of connections to the database.
 */
const CONCURRENCY = 2;

const importDatasetMutation = gql`
  mutation importDataset(
    $where: DatasetWhereUniqueInput!
    $data: DatasetImportInput!
  ) {
    importDataset(where: $where, data: $data) {
      error
    }
  }
`;
const importDataset = async ({
  apolloClient,
  datasetId,
  workspaceId,
  file,
}: {
  apolloClient: ApolloClient<any>;
  datasetId: string;
  workspaceId: string;
  file: Blob;
}) => {
  const key = `${workspaceId}/${datasetId}/import-datasets/${uuidv4()}-${new Date().toISOString()}.${mime.extension(
    file.type
  )}`;
  const url = await uploadFile({ file, key, apolloClient });

  const dataImportDataset = await apolloClient.mutate({
    mutation: importDatasetMutation,
    variables: {
      where: { id: datasetId },
      data: {
        url,
        format: ExportFormat.Coco,
        options: {
          coco: {
            annotationsOnly: file.type === "application/json",
          },
        },
      },
    },
    refetchQueries: [
      "getDatasetData",
      "getImageLabels",
      "getLabel",
      "countLabelsOfDataset",
      "getDatasetLabelClasses",
    ],
  });
  if (dataImportDataset?.data?.importDataset?.error) {
    throw new Error(dataImportDataset?.data?.importDataset?.error);
  }
};

export const importDatasets = async ({
  datasets,
  datasetId,
  workspaceId,
  apolloClient,
  setFileUploadStatuses,
}: {
  datasets: DroppedFile[];
  datasetId: string;
  workspaceId: string;
  apolloClient: ApolloClient<any>;
  setFileUploadStatuses: SetUploadStatuses;
}) => {
  return await Bluebird.Promise.map(
    datasets,
    async ({ file }) => {
      await importDataset({
        file,
        datasetId,
        workspaceId,
        apolloClient,
      });

      setFileUploadStatuses((statuses) => ({
        ...statuses,
        [file.name ?? file.path]: true,
      }));
    },
    { concurrency: CONCURRENCY }
  );
};

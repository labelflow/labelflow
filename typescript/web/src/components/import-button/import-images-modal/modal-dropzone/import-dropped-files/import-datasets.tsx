import { ApolloClient, gql } from "@apollo/client";
import { ExportFormat } from "@labelflow/graphql-types";
import { v4 as uuidv4 } from "uuid";
import mime from "mime-types";

import Bluebird from "bluebird";
import { uploadFile } from "../../../../../utils/upload-file";
import { DroppedFile, SetUploadStatuses } from "../../types";

import { CONCURRENCY } from "../../constants";

const IMPORT_DATASET_MUTATION = gql`
  mutation ImportDatasetMutation(
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
  apolloClient: ApolloClient<object>;
  datasetId: string;
  workspaceId: string;
  file: Blob;
}) => {
  const id = uuidv4();
  const now = new Date().toISOString();
  const extension = mime.extension(file.type);
  const key = `${workspaceId}/${datasetId}/import-datasets/${id}-${now}.${extension}`;
  const url = await uploadFile({ file, key, apolloClient });

  const dataImportDataset = await apolloClient.mutate({
    mutation: IMPORT_DATASET_MUTATION,
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
      "DatasetImagesPageDatasetQuery",
      "GetImageLabelsQuery",
      "GetLabelQuery",
      "CountLabelsOfDatasetQuery",
      "GetDatasetLabelClassesQuery",
      "GetDatasetLabelClassesWithTotalCountQuery",
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
  apolloClient: ApolloClient<object>;
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

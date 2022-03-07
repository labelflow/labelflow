import { ApolloClient, gql } from "@apollo/client";
import { v4 as uuidv4 } from "uuid";
import mime from "mime-types";

import Bluebird from "bluebird";
import { uploadFile } from "../../../../../utils/upload-file";
import { DroppedFile, SetUploadInfos } from "../../types";

import { CONCURRENCY } from "../../constants";
import { ExportFormat } from "../../../../../graphql-types/globalTypes";

const IMPORT_DATASET_MUTATION = gql`
  mutation ImportDatasetMutation(
    $where: DatasetWhereUniqueInput!
    $data: DatasetImportInput!
  ) {
    importDataset(where: $where, data: $data) {
      error
      warnings
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
}): Promise<{ warnings: string[] }> => {
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
        format: ExportFormat.COCO,
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
  return {
    warnings: dataImportDataset?.data?.importDataset?.warnings ?? [],
  };
};

export const importDatasets = async ({
  datasets,
  datasetId,
  workspaceId,
  apolloClient,
  setFileUploadInfos,
}: {
  datasets: DroppedFile[];
  datasetId: string;
  workspaceId: string;
  apolloClient: ApolloClient<object>;
  setFileUploadInfos: SetUploadInfos;
}) => {
  return await Bluebird.Promise.map(
    datasets,
    async ({ file }) => {
      const { warnings } = await importDataset({
        file,
        datasetId,
        workspaceId,
        apolloClient,
      });

      setFileUploadInfos((infos) => ({
        ...infos,
        [file.name ?? file.path]: {
          status: true,
          warnings,
        },
      }));
    },
    { concurrency: CONCURRENCY }
  );
};

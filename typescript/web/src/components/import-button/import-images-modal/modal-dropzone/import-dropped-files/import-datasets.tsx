import { ApolloClient, gql } from "@apollo/client";
import { v4 as uuidv4 } from "uuid";
import mime from "mime-types";

import Bluebird from "bluebird";
import { isNil } from "lodash/fp";
import { uploadFile } from "../../../../../utils/upload-file";
import { DroppedFile, SetUploadInfo } from "../../types";

import { CONCURRENCY } from "../../constants";
import { ExportFormat } from "../../../../../graphql-types/globalTypes";
import {
  ImportDatasetMutation,
  ImportDatasetMutationVariables,
} from "../../../../../graphql-types";

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

type ImportDatasetOptions = {
  apolloClient: ApolloClient<object>;
  datasetId: string;
  workspaceId: string;
  file: Blob;
};

type ImportDatasetResult = { warnings?: string[] };

const importDataset = async ({
  apolloClient,
  datasetId,
  workspaceId,
  file,
}: ImportDatasetOptions): Promise<ImportDatasetResult> => {
  const id = uuidv4();
  const now = new Date().toISOString();
  const extension = mime.extension(file.type);
  const key = `${workspaceId}/${datasetId}/import-datasets/${id}-${now}.${extension}`;
  const url = await uploadFile({ file, key, apolloClient });
  const { data } = await apolloClient.mutate<
    ImportDatasetMutation,
    ImportDatasetMutationVariables
  >({
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
  const { error, warnings } = data?.importDataset ?? {};
  if (!isNil(error)) {
    throw new Error(error);
  }
  return { warnings: warnings ?? undefined };
};

export type ImportDatasetsOptions = {
  datasets: DroppedFile[];
  datasetId: string;
  workspaceId: string;
  apolloClient: ApolloClient<object>;
  setUploadInfo: SetUploadInfo;
};

export const importDatasets = async ({
  datasets,
  datasetId,
  workspaceId,
  apolloClient,
  setUploadInfo,
}: ImportDatasetsOptions) => {
  return await Bluebird.Promise.map(
    datasets,
    async ({ file }) => {
      const { warnings } = await importDataset({
        file,
        datasetId,
        workspaceId,
        apolloClient,
      });

      setUploadInfo((info) => ({
        ...info,
        [file.name ?? file.path]: {
          status: "uploaded",
          warnings,
        },
      }));
    },
    { concurrency: CONCURRENCY }
  );
};

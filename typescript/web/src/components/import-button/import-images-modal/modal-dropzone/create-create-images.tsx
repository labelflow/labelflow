/* eslint-disable no-underscore-dangle */
import { isEmpty } from "lodash/fp";
import { ApolloClient, gql } from "@apollo/client";
import { v4 as uuidv4 } from "uuid";
import Bluebird from "bluebird";
import {
  ExportFormat,
  UploadTarget,
  UploadTargetHttp,
} from "@labelflow/graphql-types";
import mime from "mime-types";
import chunk from "lodash/fp/chunk";
import partition from "lodash/fp/partition";

import { DroppedFile } from "../types";
import { browser } from "../../../../utils/detect-scope";

const BATCH_SIZE = 30;

const createManyImagesMutation = gql`
  mutation ($images: [ImageCreateManySingleImage!]!, $datasetId: ID!) {
    createManyImages(data: { images: $images, datasetId: $datasetId }) {
      id
      url
      thumbnail20Url
    }
  }
`;

const createImageFromUrlMutation = gql`
  mutation createImageMutation(
    $url: String!
    $createdAt: DateTime
    $name: String!
    $datasetId: ID!
  ) {
    createImage(
      data: {
        url: $url
        createdAt: $createdAt
        name: $name
        datasetId: $datasetId
      }
    ) {
      id
    }
  }
`;

const getImageUploadTargetMutation = gql`
  mutation getUploadTarget($key: String!) {
    getUploadTarget(data: { key: $key }) {
      ... on UploadTargetDirect {
        direct
      }
      ... on UploadTargetHttp {
        uploadUrl
        downloadUrl
      }
    }
  }
`;

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

export const encodeFileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      resolve(evt?.target?.result as string);
    };
    reader.onerror = reject;
    reader.onabort = reject;
    reader.readAsDataURL(file);
  });
};

export const getImageStoreKey = (
  workspaceId: string,
  datasetId: string,
  fileId: string,
  mimetype: string
) => `${workspaceId}/${datasetId}/${fileId}.${mime.extension(mimetype)}`;

/**
 * This special case is needed for Safari
 * See https://github.com/labelflow/labelflow/issues/228
 * See https://stackoverflow.com/questions/63144979/fetch-event-listener-not-triggering-in-service-worker-for-file-upload-via-mult
 */
async function handleUploadFromSafari(
  acceptedFile: DroppedFile,
  apolloClient: ApolloClient<any>,
  datasetId: string
) {
  const url = await encodeFileToDataUrl(acceptedFile.file);

  await apolloClient.mutate({
    mutation: createImageFromUrlMutation,
    variables: {
      url,
      name: acceptedFile.file.name,
      datasetId,
    },
  });

  return {
    url,
    name: acceptedFile.file.name,
    datasetId,
  };
}

async function importDataset(
  apolloClient: ApolloClient<any>,
  datasetId: string,
  uploadTarget: any,
  acceptedFile: DroppedFile
) {
  const dataImportDataset = await apolloClient.mutate({
    mutation: importDatasetMutation,
    variables: {
      where: { id: datasetId },
      data: {
        url: uploadTarget.downloadUrl,
        format: ExportFormat.Coco,
        options: {
          coco: {
            annotationsOnly: acceptedFile.file.type === "application/json",
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
}

const handleHttpUpload = async ({
  acceptedFile,
  apolloClient,
  datasetId,
  uploadTarget,
  createdAt,
}: {
  acceptedFile: DroppedFile;
  apolloClient: ApolloClient<any>;
  datasetId: string;
  createdAt: string;
  uploadTarget: UploadTargetHttp;
}) => {
  // File upload to the url provided by the server
  if (browser?.name === "safari") {
    return {
      ...(await handleUploadFromSafari(acceptedFile, apolloClient, datasetId)),
      createdAt,
    };
  }

  // AWS upload
  await fetch(uploadTarget.uploadUrl, {
    method: "PUT",
    body: acceptedFile.file,
  });

  return {
    url: uploadTarget.downloadUrl,
    createdAt,
    name: acceptedFile.file.name,
  };

  // It's a dataset / annotations that we want to import
};

export function createCreateImages(
  files: DroppedFile[],
  apolloClient: ApolloClient<any>,
  workspaceId: string,
  datasetId: string,
  setFileUploadStatuses: (
    statusOrStatusUpdater:
      | Record<string, string | boolean>
      | ((
          oldStatuses: Record<string, string | boolean>
        ) => Record<string, string | boolean>)
  ) => void,
  onUploadEnd: () => void
) {
  return async () => {
    const now = new Date();

    const acceptedFiles = files.filter((file) => isEmpty(file.errors));

    const [images, others] = partition(
      (acceptedFile) => acceptedFile.file.type.startsWith("image"),
      acceptedFiles
    );

    // others.map(()=>  await importDataset(apolloClient, datasetId, uploadTarget, acceptedFile);)

    const batches = chunk(BATCH_SIZE, images);

    const getImageStoreKeyFromFile = (droppedFile: DroppedFile) =>
      getImageStoreKey(workspaceId, datasetId, uuidv4(), droppedFile.file.type);

    await Bluebird.Promise.map(
      batches,
      async (batch, batchIndex) => {
        const imagesToCreate = await Promise.all(
          batch.map(async (acceptedFile, fileIndex) => {
            const key = getImageStoreKeyFromFile(acceptedFile);

            const createdAtDate = new Date();
            createdAtDate.setTime(
              now.getTime() + batchIndex * BATCH_SIZE + fileIndex
            );
            const createdAt = createdAtDate.toISOString();

            const uploadTarget = (
              await apolloClient.mutate<{ getUploadTarget: UploadTarget }>({
                mutation: getImageUploadTargetMutation,
                variables: { key },
              })
            )?.data?.getUploadTarget;

            if (!uploadTarget) {
              throw new Error("Couldn't get the upload target from the server");
            }

            if (uploadTarget.__typename !== "UploadTargetHttp") {
              throw new Error("Direct uploads are not supported anymore");
            }

            return await handleHttpUpload({
              acceptedFile,
              apolloClient,
              datasetId,
              uploadTarget,
              createdAt,
            });
          })
        );

        await apolloClient.mutate({
          mutation: createManyImagesMutation,
          variables: { images: imagesToCreate, datasetId },
        });

        setFileUploadStatuses((oldStatuses) => ({
          ...oldStatuses,
          ...Object.fromEntries(
            imagesToCreate.map((image) => [image.name, true])
          ),
        }));
      },
      { concurrency: 5 }
    );

    onUploadEnd();
  };
}

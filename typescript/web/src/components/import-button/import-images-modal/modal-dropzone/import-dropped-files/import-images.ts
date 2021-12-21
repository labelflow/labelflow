/* eslint-disable no-underscore-dangle */
import { ApolloClient, gql } from "@apollo/client";
import { v4 as uuidv4 } from "uuid";
import Bluebird from "bluebird";
import mime from "mime-types";
import chunk from "lodash/fp/chunk";

import { uploadFile } from "../../../../../utils/upload-file";
import { DroppedFile, SetUploadStatuses } from "../../types";

import { BATCH_SIZE, CONCURRENCY } from "../../constants";

const createManyImagesMutation = gql`
  mutation ($images: [ImageCreateManySingleImage!]!, $datasetId: ID!) {
    createManyImages(data: { images: $images, datasetId: $datasetId }) {
      id
    }
  }
`;

const uploadBatchOfImages = async ({
  batch,
  firstUploadDate,
  batchIndex,
  datasetId,
  workspaceId,
  apolloClient,
}: {
  batch: DroppedFile[];
  firstUploadDate: Date;
  batchIndex: number;
  datasetId: string;
  workspaceId: string;
  apolloClient: ApolloClient<any>;
}) => {
  return await Promise.all(
    batch.map(async ({ file }, fileIndex) => {
      const createdAtDate = new Date();
      createdAtDate.setTime(
        firstUploadDate.getTime() + batchIndex * BATCH_SIZE + fileIndex
      );
      const createdAt = createdAtDate.toISOString();
      const key = `${workspaceId}/${datasetId}/${uuidv4()}.${mime.extension(
        file.type
      )}`;

      const url = await uploadFile({
        file,
        key,
        apolloClient,
      });

      return { url, createdAt, name: file.name };
    })
  );
};

export const importImages = async ({
  images,
  workspaceId,
  datasetId,
  apolloClient,
  setFileUploadStatuses,
}: {
  images: DroppedFile[];
  workspaceId: string;
  datasetId: string;
  apolloClient: ApolloClient<any>;
  setFileUploadStatuses: SetUploadStatuses;
}) => {
  const firstUploadDate = new Date();
  const batches = chunk(BATCH_SIZE, images);

  await Bluebird.Promise.map(
    batches,
    async (batch, batchIndex) => {
      const imagesToCreate = await uploadBatchOfImages({
        batch,
        batchIndex,
        firstUploadDate,
        datasetId,
        workspaceId,
        apolloClient,
      });

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
    { concurrency: CONCURRENCY }
  );
};

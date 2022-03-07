/* eslint-disable no-underscore-dangle */
import { ApolloClient, gql } from "@apollo/client";
import { v4 as uuidv4 } from "uuid";
import Bluebird from "bluebird";
import mime from "mime-types";
import chunk from "lodash/fp/chunk";

import { uploadFile } from "../../../../../utils/upload-file";
import { DroppedFile, SetUploadInfos } from "../../types";

import { BATCH_SIZE, CONCURRENCY } from "../../constants";

export const CREATE_MANY_IMAGES_MUTATION = gql`
  mutation CreateManyImagesInModalMutation(
    $images: [ImageCreateManySingleInput!]!
    $datasetId: ID!
  ) {
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
  apolloClient: ApolloClient<object>;
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
  setFileUploadInfos,
}: {
  images: DroppedFile[];
  workspaceId: string;
  datasetId: string;
  apolloClient: ApolloClient<object>;
  setFileUploadInfos: SetUploadInfos;
}) => {
  const firstUploadDate = new Date();
  const batches = chunk(BATCH_SIZE, images);

  await Bluebird.Promise.map(
    batches,
    async (batch, batchIndex) => {
      try {
        const imagesToCreate = await uploadBatchOfImages({
          batch,
          batchIndex,
          firstUploadDate,
          datasetId,
          workspaceId,
          apolloClient,
        });

        await apolloClient.mutate({
          mutation: CREATE_MANY_IMAGES_MUTATION,
          variables: { images: imagesToCreate, datasetId },
        });

        setFileUploadInfos((oldInfos) => ({
          ...oldInfos,
          ...Object.fromEntries(
            imagesToCreate.map((image) => [
              image.name,
              { status: true, warnings: [] },
            ])
          ),
        }));
      } catch (error) {
        setFileUploadInfos((oldInfos) => ({
          ...oldInfos,
          ...Object.fromEntries(
            batch.map(({ file }) => [
              file.name,
              { status: error?.message, warnings: [] },
            ])
          ),
        }));
      }
    },
    { concurrency: CONCURRENCY }
  );
};

/* eslint-disable no-underscore-dangle */
import { ApolloClient, gql } from "@apollo/client";
import { v4 as uuidv4 } from "uuid";
import Bluebird from "bluebird";
import mime from "mime-types";
import chunk from "lodash/fp/chunk";

import { uploadFile } from "../../../../../utils/upload-file";
import { DroppedFile, SetUploadStatuses } from "../../types";

/**
 * Number of images to upload in a batch.
 * For each batch, we perform one "createManyImages" mutation.
 * Increasing this number will lower the number of connections to the database
 * needed to perform the upload.
 *
 * However, every "createManyImages" mutation also performs the processing
 * (thumbnails generations & size validation) of the created all images.
 * If we the batch size, the "createManyImages" mutation will take longer to resolve.
 */
const BATCH_SIZE = 10;

/**
 * Maximum number of batches to perform in parallel.
 * Increasing this number should reduce potentials bottlenecks,
 * and thus, make the upload faster.
 * For example, if the user uploads faster than the images are processed on
 * the server, then the upload would be delayed until one batch is fully finished.
 *
 * However, increasing this number will also increase the number
 * of connections to the database.
 */
const CONCURRENCY = 2;

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

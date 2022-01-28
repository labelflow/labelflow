import isEmpty from "lodash/fp/isEmpty";
import chunk from "lodash/fp/chunk";
import { ApolloClient, gql } from "@apollo/client";
import Bluebird from "bluebird";
import { DroppedUrl, SetUploadStatuses } from "../types";

import { BATCH_SIZE, CONCURRENCY } from "../constants";

const CREATE_MANY_IMAGES_MUTATION = gql`
  mutation CreateManyImagesMutation(
    $images: [ImageCreateManySingleInput!]!
    $datasetId: ID!
  ) {
    createManyImages(data: { images: $images, datasetId: $datasetId }) {
      id
    }
  }
`;

export const importUrls = async ({
  urls,
  apolloClient,
  datasetId,
  setUploadStatuses,
}: {
  urls: DroppedUrl[];
  apolloClient: ApolloClient<object>;
  datasetId: any;
  setUploadStatuses: SetUploadStatuses;
}) => {
  const now = new Date();

  const validUrls = urls.filter((url) => isEmpty(url.errors));

  const batches = chunk(BATCH_SIZE, validUrls);

  await Bluebird.Promise.map(
    batches,
    async (batch, batchIndex) => {
      const imagesToCreate = batch.map(({ url }, urlIndex) => {
        const createdAt = new Date();
        createdAt.setTime(now.getTime() + batchIndex * BATCH_SIZE + urlIndex);

        return {
          externalUrl: url,
          createdAt: createdAt.toISOString(),
        };
      });

      try {
        await apolloClient.mutate({
          mutation: CREATE_MANY_IMAGES_MUTATION,
          variables: { images: imagesToCreate, datasetId },
        });

        setUploadStatuses((oldStatuses) => ({
          ...oldStatuses,
          ...Object.fromEntries(
            imagesToCreate.map(({ externalUrl }) => [externalUrl, true])
          ),
        }));
      } catch (error) {
        setUploadStatuses((oldStatuses) => ({
          ...oldStatuses,
          ...Object.fromEntries(
            imagesToCreate.map(({ externalUrl }) => [
              externalUrl,
              error?.message,
            ])
          ),
        }));
      }
    },
    { concurrency: CONCURRENCY }
  );
};

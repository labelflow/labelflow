import { gql } from "@apollo/client";
// eslint-disable-next-line import/no-extraneous-dependencies
import Bluebird from "bluebird";
import { client } from "../connectors/apollo-client/schema-client";
import { getDatabase } from "../connectors/database";

async function createDataset(id: string, name: string) {
  try {
    const mutationResult = await client.mutate({
      mutation: gql`
        mutation createDataset($id: String!, $name: String!) {
          createDataset(data: { id: $id, name: $name }) {
            id
          }
        }
      `,
      variables: { name, id },
    });

    const {
      data: {
        createDataset: { id: resultId },
      },
    } = mutationResult;
    return resultId;
  } catch (error) {
    // Dataset already exists
    return id;
  }
}

async function createImage(
  id: String,
  name: String,
  file: Blob,
  parentDatasetId: string
) {
  try {
    const mutationResult = await client.mutate({
      mutation: gql`
        mutation createImage(
          $id: String!
          $file: Upload!
          $name: String!
          $datasetId: ID!
        ) {
          createImage(
            data: { id: $id, name: $name, file: $file, datasetId: $datasetId }
          ) {
            id
            name
            width
            height
            url
          }
        }
      `,
      variables: {
        id,
        file,
        name,
        datasetId: parentDatasetId,
      },
    });

    const {
      data: { createImage: image },
    } = mutationResult;

    return image;
  } catch (error) {
    return {
      id,
      file,
      name,
      datasetId: parentDatasetId,
    };
  }
}
export const mockImagesLoader = async ({
  parameters,
}: {
  parameters: {
    mockImages?: {
      datasetId: string;
      images?: { id: string; name: string; url: string }[];
    };
  };
}) => {
  if (!parameters?.mockImages?.datasetId) {
    return {};
  }
  // first, clean the database and the apollo client
  await Promise.all(getDatabase().tables.map((table) => table.clear()));
  await client.clearStore();

  const imageArray = parameters?.mockImages?.images;
  const datasetId = parameters?.mockImages?.datasetId;

  // Because of race conditions we have to randomize the dataset name
  const parentDatasetId = await createDataset(
    datasetId,
    `storybook dataset ${Date.now()}`
  );

  if (imageArray == null) {
    return { images: [] };
  }

  // We use mapSeries to ensure images are created in the same order
  const loadedImages = await Bluebird.mapSeries(
    imageArray,
    ({ id, url, name }) =>
      fetch(url)
        .then((res) => res.blob())
        .then((blob) => createImage(id, name, blob, parentDatasetId))
  );

  return { images: loadedImages, datasetId: parentDatasetId };
};

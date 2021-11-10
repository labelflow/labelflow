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
          createDataset(
            data: { id: $id, name: $name, workspaceSlug: "local" }
          ) {
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
    console.error(error);
    // Dataset already exists
    return id;
  }
}

async function createImage(
  url: String,
  id: String,
  name: String,
  parentDatasetId: string
) {
  try {
    const mutationResult = await client.mutate({
      mutation: gql`
        mutation createImage(
          $url: String!
          $id: String!
          $name: String!
          $datasetId: ID!
        ) {
          createImage(
            data: { url: $url, id: $id, name: $name, datasetId: $datasetId }
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
        url,
        id,

        name,
        datasetId: parentDatasetId,
      },
    });

    const {
      data: { createImage: image },
    } = mutationResult;

    return image;
  } catch (error) {
    console.error(error);
    // Image already exists
    return {
      url,
      id,
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
      datasetName: string;
      images?: { id: string; name: string; url: string }[];
    };
  };
}) => {
  if (!parameters?.mockImages?.datasetId) {
    console.log("No dataset in parameter");
    return {};
  }
  // first, clean the database and the apollo client
  await Promise.all((await getDatabase()).tables.map((table) => table.clear()));
  await client.clearStore();

  const imageArray = parameters?.mockImages?.images;
  const datasetId = parameters?.mockImages?.datasetId;
  const datasetName = parameters?.mockImages?.datasetName;

  // Because of race conditions we have to randomize the dataset name
  const parentDatasetId = await createDataset(
    datasetId,
    datasetName ?? `storybook dataset ${Date.now()}`
  );

  if (imageArray == null) {
    console.log("No images in parameter");
    return { images: [] };
  }

  // We use mapSeries to ensure images are created in the same order
  const loadedImages = await Bluebird.map(imageArray, ({ id, url, name }) =>
    createImage(url, id, name, parentDatasetId)
  );

  console.log("Mock images ok");
  return { images: loadedImages, datasetId: parentDatasetId };
};

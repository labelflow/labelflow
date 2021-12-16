import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";

export const createDataset = async ({
  client,
  name,
  workspaceSlug,
}: {
  client: ApolloClient<NormalizedCacheObject>;
  name: string;
  workspaceSlug: string;
}) => {
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createDataset($name: String, $workspaceSlug: String) {
        createDataset(data: { name: $name, workspaceSlug: $workspaceSlug }) {
          id
          slug
        }
      }
    `,
    variables: {
      name,
      workspaceSlug,
    },
  });

  const {
    data: {
      createDataset: { id, slug },
    },
  } = mutationResult;

  return { id, slug };
};

export const createImage = async ({
  url,
  datasetId,
  client,
}: {
  url: string;
  datasetId: string;
  client: ApolloClient<NormalizedCacheObject>;
}) => {
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createImage($url: String, $datasetId: ID!) {
        createImage(data: { url: $url, datasetId: $datasetId }) {
          id
          name
          width
          height
          url
        }
      }
    `,
    variables: {
      datasetId,
      url,
    },
  });

  const {
    data: { createImage: image },
  } = mutationResult;

  return image;
};

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

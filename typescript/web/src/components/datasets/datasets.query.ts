import {
  ApolloClient,
  gql,
  makeReference,
  useApolloClient,
} from "@apollo/client";
import { canonicalStringify } from "@apollo/client/cache";
import { useCallback } from "react";

export const GET_DATASET_BY_ID_QUERY = gql`
  query GetDatasetByIdQuery($id: ID) {
    dataset(where: { id: $id }) {
      id
      name
    }
  }
`;

export const SEARCH_DATASET_BY_SLUG_QUERY = gql`
  query SearchDatasetBySlugQuery($slug: String!, $workspaceSlug: String!) {
    searchDataset(
      where: { slugs: { slug: $slug, workspaceSlug: $workspaceSlug } }
    ) {
      id
      slug
    }
  }
`;

export const GET_DATASET_BY_SLUG_QUERY = gql`
  query GetDatasetBySlugQuery($slug: String!, $workspaceSlug: String!) {
    dataset(where: { slugs: { slug: $slug, workspaceSlug: $workspaceSlug } }) {
      id
      name
    }
  }
`;

const flushPaginatedDatasetsCache = async (
  apolloClient: ApolloClient<object>,
  workspaceSlug: string
) => {
  const storeFieldName = `datasets:${canonicalStringify({
    where: { workspaceSlug },
  })}`;
  await apolloClient.cache.modify({
    id: apolloClient.cache.identify(makeReference("ROOT_QUERY")),
    fields: {
      datasets: (data: any, details) =>
        details.storeFieldName === storeFieldName
          ? { items: [], totalCount: undefined }
          : data,
    },
  });
};

export const useFlushPaginatedDatasetsCache = (workspaceSlug: string) => {
  const client = useApolloClient();
  return useCallback(() => {
    flushPaginatedDatasetsCache(client, workspaceSlug);
  }, [client, workspaceSlug]);
};

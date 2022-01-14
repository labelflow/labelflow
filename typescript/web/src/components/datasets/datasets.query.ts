import {
  ApolloClient,
  gql,
  makeReference,
  useApolloClient,
} from "@apollo/client";
import { canonicalStringify } from "@apollo/client/cache";
import { useCallback } from "react";

export const getPaginatedDatasetsQuery = gql`
  query getPaginatedDatasets(
    $where: DatasetWhereInput
    $first: Int!
    $skip: Int!
  ) {
    datasets(where: $where, first: $first, skip: $skip) {
      id
      name
      slug
      images(first: 1) {
        id
        url
        thumbnail500Url
      }
      imagesAggregates {
        totalCount
      }
      labelsAggregates {
        totalCount
      }
      labelClassesAggregates {
        totalCount
      }
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

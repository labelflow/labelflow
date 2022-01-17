import {
  ApolloClient,
  gql,
  makeReference,
  useApolloClient,
} from "@apollo/client";
import { canonicalStringify } from "@apollo/client/cache";
import { useCallback } from "react";
import { ImagesQueryCache } from "../../connectors/apollo-client/cache-config";

export const paginatedImagesQuery = gql`
  query paginatedImagesQuery($datasetId: ID!, $first: Int!, $skip: Int!) {
    images(where: { datasetId: $datasetId }, first: $first, skip: $skip) {
      id
      name
      url
      thumbnail500Url
    }
  }
`;

export const flushPaginatedImagesCache = async (
  apolloClient: ApolloClient<object>,
  datasetId: string
) => {
  const storeFieldName = `images:${canonicalStringify({
    where: { datasetId },
  })}`;
  await apolloClient.cache.modify({
    id: apolloClient.cache.identify(makeReference("ROOT_QUERY")),
    fields: {
      images: (data: ImagesQueryCache, details) =>
        details.storeFieldName === storeFieldName
          ? { images: [], totalCount: undefined }
          : data,
    },
  });
};

export const useFlushPaginatedImagesCache = (datasetId: string) => {
  const client = useApolloClient();
  return useCallback(() => {
    flushPaginatedImagesCache(client, datasetId);
  }, [client, datasetId]);
};

import {
  InMemoryCacheConfig,
  FieldFunctionOptions,
  FieldReadFunction,
  FieldMergeFunction,
} from "@apollo/client";
import type { QueryImagesArgs, Image } from "@labelflow/graphql-types";

export type ImagesQueryCache = {
  images: Image[];
  totalCount: number | undefined;
};

const readQueryImages: FieldReadFunction<ImagesQueryCache, Image[]> = (
  existing,
  options: FieldFunctionOptions<QueryImagesArgs, Record<string, any>>
) => {
  // A read function should always return undefined if existing is
  // undefined. Returning undefined signals that the field is
  // missing from the cache, which instructs Apollo Client to
  // fetch its value from your GraphQL server.
  if (existing === undefined) return undefined;
  const offset = options.args?.skip || 0;
  const limit = options.args?.first || undefined;
  const result =
    offset > 0 || limit !== undefined
      ? existing.images.slice(
          offset,
          limit !== undefined ? offset + limit : undefined
        )
      : existing.images;
  const isResultDataInvalid =
    result.length === 0 ||
    (result as (Image | undefined)[]).includes(undefined);
  const shouldBeLastPage = (limit && result.length < limit) || !limit;
  if (
    isResultDataInvalid ||
    (shouldBeLastPage &&
      !(existing.totalCount && existing.totalCount === offset + result.length))
  ) {
    return undefined;
  }
  return result;
};

const mergeQueryImages: FieldMergeFunction<ImagesQueryCache, Image[]> = (
  existing,
  incoming,
  options: FieldFunctionOptions<QueryImagesArgs, Record<string, any>>
) => {
  // Spreading the images array is necessary because the existing data is
  // immutable, and frozen in development
  const merged = {
    images: [...(existing?.images ?? [])],
    totalCount: existing?.totalCount,
  };
  const offset = options.args?.skip || 0;
  const limit = options.args?.first || undefined;
  for (let i = 0; i < incoming.length; i += 1) {
    merged.images[offset + i] = incoming[i];
  }
  if (incoming.length > 0 && (limit === undefined || incoming.length < limit)) {
    merged.totalCount = offset + incoming.length;
  }
  return merged;
};

export const APOLLO_CACHE_CONFIG: InMemoryCacheConfig = {
  typePolicies: {
    Query: {
      fields: {
        images: {
          // Defining nested keyArgs is done in an unusual way but that's how it works
          // https://github.com/apollographql/apollo-client/issues/7314#issuecomment-726331129
          keyArgs: ["where", ["datasetId"]],
          read: readQueryImages,
          merge: mergeQueryImages,
        },
      },
    },
    Label: {
      fields: {
        geometry: {
          // Short for options.mergeObjects(existing, incoming)
          // https://www.apollographql.com/docs/react/caching/cache-field-behavior/#merging-non-normalized-objects
          merge: true,
        },
      },
    },
    Dataset: {
      fields: {
        labelClasses: {
          // Keeps only the incoming data
          // https://www.apollographql.com/docs/react/caching/cache-field-behavior/#merging-non-normalized-objects
          merge: false,
        },
      },
    },
  },
};

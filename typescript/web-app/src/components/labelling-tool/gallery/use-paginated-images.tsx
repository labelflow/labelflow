import { useCallback, useRef } from "react";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

import { Image as ImageType } from "../../../graphql-types.generated";
import { mergeAtIndex } from "./merge-at-index";

const imagesCountQuery = gql`
  query getImageList {
    images {
      id
    }
  }
`;

const paginatedImagesQuery = gql`
  query paginatedImages($first: Int, $skip: Int) {
    images(first: $first, skip: $skip) {
      id
      name
      url
    }
  }
`;

const defaultBatchSize = 10;

export const usePaginatedImages = (
  batchSize: number = defaultBatchSize
): {
  count: number;
  data:
    | {
        images: Array<ImageType | null>;
      }
    | undefined;
  askForItemsInRange: (min: number, max: number) => void;
} => {
  /* TODO: We need to replace it with a proper count query */
  const imagesResult =
    useQuery<{ images: Pick<ImageType, "id">[] }>(imagesCountQuery);
  const count = imagesResult?.data?.images?.length ?? 0;

  // TODO: We need to find a way to reset this on images count changes.
  const alreadyLoadedItems = useRef<Array<Boolean>>([true]);

  const { data, fetchMore } = useQuery<{
    images: Array<ImageType | null>;
  }>(paginatedImagesQuery, { variables: { first: batchSize * 100, skip: 0 } });

  const fetchOneBatch = useCallback(
    (batchIndex: number) => {
      if (alreadyLoadedItems.current[batchIndex] === true) {
        return;
      }

      alreadyLoadedItems.current[batchIndex] = true;
      fetchMore({
        variables: { first: batchSize, skip: batchSize * batchIndex },
        updateQuery: (previousResult, { fetchMoreResult, variables }) => {
          const newImageStartIndex = variables?.skip;

          if (typeof newImageStartIndex !== "number") {
            throw new Error(
              "Paginated Images query has been called without a 'first', this shouldn't happen"
            );
          }

          const previousImages = previousResult?.images ?? [];
          const newImages = fetchMoreResult?.images ?? [];

          return {
            ...previousResult,
            images: mergeAtIndex(previousImages, newImages, newImageStartIndex),
          };
        },
      }).catch(() => {
        alreadyLoadedItems.current[batchIndex] = false;
      });
    },
    [fetchMore, batchSize]
  );

  const askForItemsInRange = useCallback(
    (start: number, end: number) => {
      const startBatchIndex = Math.floor(start / batchSize);
      const endBatchIndex = Math.ceil(end / batchSize);

      for (
        let batchIndex = startBatchIndex;
        batchIndex <= endBatchIndex;
        batchIndex += 1
      ) {
        fetchOneBatch(batchIndex);
      }
    },
    [fetchOneBatch, batchSize]
  );

  return {
    count,
    data,
    askForItemsInRange,
  };
};

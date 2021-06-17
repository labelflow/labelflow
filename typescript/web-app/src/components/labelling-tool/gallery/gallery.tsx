import React, { useRef } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Image, Box } from "@chakra-ui/react";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import useMeasure from "react-use-measure";
import { Image as ImageType } from "../../../graphql-types.generated";
import { mergeAtIndex } from "./merge-at-index";

const paginatedImagesQuery = gql`
  query paginatedImages($first: Int, $skip: Int) {
    images(first: $first, skip: $skip) {
      id
      url
    }
  }
`;

export const Gallery = () => {
  const [containerRef, { width }] = useMeasure();
  const { data, loading, fetchMore } = useQuery<{
    images: Array<ImageType | null>;
  }>(paginatedImagesQuery, { variables: { first: 10, skip: 10 } });

  /* +1 to always trigger a fetchMore.
   * We should replace this is with a proper count query */
  const itemCount = data?.images?.length ?? 0 + 1;

  const Item = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => (
    <Link href={`/images/${data?.images?.[index]?.id}`}>
      <Image
        src={data?.images?.[index]?.url}
        objectFit="contain"
        bgColor="gray.200"
        border="solid 1px"
        borderColor="gray.600"
        style={style}
      />
    </Link>
  );

  const loadMoreItems = (min: number, max: number) => {
    fetchMore({
      variables: { first: max - min, skip: min },
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
    });
  };

  return (
    <Box ref={containerRef}>
      {width && (
        <InfiniteLoader
          isItemLoaded={(index: number) => data?.images?.[index] != null}
          itemCount={itemCount}
          loadMoreItems={loadMoreItems}
        >
          {({
            onItemsRendered,
            ref,
          }: {
            onItemsRendered: () => void;
            ref: React.Ref<HTMLElement>;
          }) => (
            <List
              className="List"
              height={90}
              itemCount={itemCount}
              itemSize={100}
              onItemsRendered={onItemsRendered}
              ref={ref}
              layout="horizontal"
              width={width}
            >
              {Item}
            </List>
          )}
        </InfiniteLoader>
      )}
    </Box>
  );
};

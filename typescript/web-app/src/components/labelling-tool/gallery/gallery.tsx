import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Image, Box, Skeleton, Badge } from "@chakra-ui/react";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import useMeasure from "react-use-measure";
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
      url
    }
  }
`;

export const Gallery = () => {
  const router = useRouter();
  const imageId = router.query.id;
  /* We need to replace it with a proper count query */
  const itemCount =
    useQuery<{ images: Pick<ImageType, "id">[] }>(imagesCountQuery)?.data
      ?.images?.length;

  const [containerRef, { width }] = useMeasure();
  const { data, fetchMore } = useQuery<{
    images: Array<ImageType | null>;
  }>(paginatedImagesQuery, { variables: { first: 10, skip: 10 } });

  const Item = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => (
    <Link href={`/images/${data?.images?.[index]?.id}`}>
      <Box style={style} pl="7.5px" pr="7.5px" pb={4} position="relative">
        <Badge
          pointerEvents="none"
          position="absolute"
          top="5px"
          left="12.5px"
          bg="rgba(0, 0, 0, 0.6)"
          color="white"
          borderRadius="full"
        >
          {index + 1}
        </Badge>
        <Image
          src={data?.images?.[index]?.url}
          fallback={<Skeleton height="100%" width="100%" borderRadius="md" />}
          height="100%"
          width="100%"
          align="center center"
          fit="cover"
          border="2px solid"
          borderColor={
            imageId === data?.images?.[index]?.id ? "brand.500" : "transparent"
          }
          borderRadius="md"
        />
      </Box>
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
    <Box ref={containerRef} pt={4}>
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
              itemSize={150}
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

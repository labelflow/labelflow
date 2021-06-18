/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useRef } from "react";
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
      name
      url
    }
  }
`;

const itemHeight = 90;
const itemWidth = 150;
const getImageOffset = (width: number) => {
  return Math.floor(width / itemWidth / 2);
};

const usePaginatedImages = (): {
  count: number;
  data:
    | {
        images: Array<ImageType | null>;
      }
    | undefined;
  loading: boolean;
  loadMoreItems: (min: number, max: number) => Promise<any>;
} => {
  /* We need to replace it with a proper count query */
  const imagesResult =
    useQuery<{ images: Pick<ImageType, "id">[] }>(imagesCountQuery);
  const count = imagesResult?.data?.images?.length ?? 0;

  const { data, loading, fetchMore } = useQuery<{
    images: Array<ImageType | null>;
  }>(paginatedImagesQuery, { variables: { first: 10, skip: 10 } });

  const loadMoreItems = (min: number, max: number) => {
    return fetchMore({
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

  return {
    count,
    data,
    loading: imagesResult.loading || loading,
    loadMoreItems,
  };
};

export const Gallery = () => {
  const listRef = useRef<List | null>(null);
  const previousImageIndex = useRef<number | null>();
  const router = useRouter();
  const imageId = router.query.id;
  /* We need to replace it with a proper count query */
  const imagesResult =
    useQuery<{ images: Pick<ImageType, "id">[] }>(imagesCountQuery);
  const currentImageIndex = imagesResult?.data?.images.findIndex(
    (image) => image.id === imageId
  );
  const [containerRef, { width }] = useMeasure();

  const {
    count: itemCount,
    data,
    loading,
    loadMoreItems,
  } = usePaginatedImages();

  useEffect(() => {
    if (!currentImageIndex || !listRef.current || !width) return;
    // Initialize previousImageIndex when user just came in
    if (!previousImageIndex.current) {
      previousImageIndex.current = currentImageIndex;
    }
    if (previousImageIndex.current <= currentImageIndex) {
      listRef.current.scrollToItem(currentImageIndex + getImageOffset(width));
    } else {
      listRef.current.scrollToItem(currentImageIndex - getImageOffset(width));
    }
    previousImageIndex.current = currentImageIndex;
  }, [currentImageIndex, listRef.current, width]);

  const isLoading = !width && loading && imagesResult.loading;

  return (
    <Box as="nav" ref={containerRef} pt={4}>
      {!isLoading && (
        <InfiniteLoader
          isItemLoaded={(index: number) => data?.images?.[index] != null}
          itemCount={itemCount}
          loadMoreItems={loadMoreItems}
        >
          {({ onItemsRendered, ref: internalRef }) => (
            <List
              ref={(value) => {
                if (typeof internalRef === "function") {
                  internalRef(value);
                }
                listRef.current = value;
              }}
              className="List"
              height={itemHeight}
              itemCount={itemCount}
              itemSize={itemWidth}
              onItemsRendered={onItemsRendered}
              layout="horizontal"
              width={width}
            >
              {({ index, style }) => (
                <Box
                  style={style}
                  pl="7.5px"
                  pr="7.5px"
                  pb={4}
                  position="relative"
                >
                  {data?.images?.[index] ? (
                    <Link
                      href={`/images/${data?.images?.[index]?.id}`}
                      passHref
                    >
                      <a
                        aria-current={
                          imageId === data?.images?.[index]?.id
                            ? "page"
                            : undefined
                        }
                      >
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
                          fallback={
                            <Skeleton
                              height="100%"
                              width="100%"
                              borderRadius="md"
                            />
                          }
                          height="100%"
                          width="100%"
                          align="center center"
                          fit="cover"
                          border="2px solid"
                          borderColor={
                            imageId === data?.images?.[index]?.id
                              ? "brand.500"
                              : "transparent"
                          }
                          borderRadius="md"
                        />
                      </a>
                    </Link>
                  ) : (
                    <Skeleton height="100%" width="100%" borderRadius="md" />
                  )}
                </Box>
              )}
            </List>
          )}
        </InfiniteLoader>
      )}
    </Box>
  );
};

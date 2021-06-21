/* eslint-disable jsx-a11y/anchor-is-valid */
import { useCallback, useRef, memo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Image, Box, Skeleton, Badge, AspectRatio } from "@chakra-ui/react";
import { useVirtual } from "react-virtual";
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

const batchSize = 10;
const itemHeight = 90;
const itemWidth = 150;
const scrollbarHeight = 17;

const usePaginatedImages = (): {
  count: number;
  data:
    | {
        images: Array<ImageType | null>;
      }
    | undefined;
  loadMoreItems: (min: number, max: number) => void;
} => {
  /* We need to replace it with a proper count query */
  const imagesResult =
    useQuery<{ images: Pick<ImageType, "id">[] }>(imagesCountQuery);
  const count = imagesResult?.data?.images?.length ?? 0;

  // We need to find a way to reset this on images count changes.
  const alreadyLoadedItems = useRef<Array<Boolean>>([true]);

  const { data, fetchMore } = useQuery<{
    images: Array<ImageType | null>;
  }>(paginatedImagesQuery, { variables: { first: batchSize * 100, skip: 0 } });

  const loadMoreItems = (min: number, max: number) => {
    const fetchOneBatch = (batchIndex: number) => {
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
    };

    const minBatchIndex = Math.floor(min / batchSize);
    const maxBatchIndex = Math.ceil(max / batchSize);

    for (
      let batchIndex = minBatchIndex;
      batchIndex <= maxBatchIndex;
      batchIndex += 1
    ) {
      fetchOneBatch(batchIndex);
    }
  };

  return {
    count,
    data,
    loadMoreItems,
  };
};

const GalleryItem = memo(
  ({
    size,
    start,
    url,
    id,
    isSelected,
    index,
  }: {
    size: number;
    start: number;
    url?: string;
    id?: string;
    isSelected: boolean;
    index: number;
  }) => {
    return (
      <Box
        position="absolute"
        top={0}
        left={0}
        height={itemHeight}
        width={`${size}px`}
        transform={`translateX(${start}px)`}
        pl="7.5px"
        pr="7.5px"
      >
        {id ? (
          <Link href={`/images/${id}`} passHref>
            <a aria-current={isSelected ? "page" : undefined}>
              <Badge
                pointerEvents="none"
                position="absolute"
                top="5px"
                left="12.5px"
                bg="rgba(0, 0, 0, 0.6)"
                color="white"
                borderRadius="full"
                zIndex={2}
              >
                {index + 1}
              </Badge>
              <AspectRatio ratio={3 / 2}>
                <Image
                  src={url}
                  fallback={
                    <Skeleton height="100%" width="100%" borderRadius="md" />
                  }
                  height="100%"
                  width="100%"
                  align="center center"
                  fit="cover"
                  border="2px solid"
                  borderColor={isSelected ? "brand.500" : "transparent"}
                  borderRadius="md"
                />
              </AspectRatio>
            </a>
          </Link>
        ) : (
          <Skeleton height="100%" width="100%" borderRadius="md" />
        )}
      </Box>
    );
  }
);

export const Gallery = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const imageId = router.query.id as string;

  // This should be done on the backend side.
  const imagesResult =
    useQuery<{ images: Pick<ImageType, "id">[] }>(imagesCountQuery);
  const currentImageIndex = imagesResult?.data?.images.findIndex(
    (image) => image.id === imageId
  );

  const { count: itemCount, data, loadMoreItems } = usePaginatedImages();

  const { virtualItems, totalSize, scrollToIndex } = useVirtual({
    size: itemCount,
    parentRef: listRef,
    estimateSize: useCallback(() => itemWidth, []),
    horizontal: true,
    overscan: 10,
  });

  useEffect(() => {
    if (!currentImageIndex || currentImageIndex === -1) {
      return;
    }

    scrollToIndex(currentImageIndex, { align: "center" });
  }, [currentImageIndex, scrollToIndex]);

  useEffect(() => {
    if (virtualItems.length === 0) {
      return;
    }

    const min = virtualItems[0].index;
    const max = virtualItems[virtualItems.length - 1].index;
    loadMoreItems(min, max);
  }, [virtualItems]);

  return (
    <Box ref={listRef} as="nav" pt={4} overflow="auto">
      <Box
        height={itemHeight + scrollbarHeight}
        width={totalSize}
        position="relative"
      >
        {virtualItems.map((item) => (
          <GalleryItem
            key={item.index}
            size={item.size}
            id={data?.images?.[item.index]?.id}
            url={data?.images?.[item.index]?.url}
            isSelected={imageId === data?.images?.[item.index]?.id}
            start={item.start}
            index={item.index}
          />
        ))}
      </Box>
    </Box>
  );
};

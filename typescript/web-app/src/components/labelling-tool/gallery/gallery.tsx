import { useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Box } from "@chakra-ui/react";
import { useVirtual } from "react-virtual";
import { Image as ImageType } from "../../../graphql-types.generated";

import { GalleryItem } from "./gallery-item";
import { usePaginatedImages } from "./use-paginated-images";
import { itemHeight, itemWidth, scrollbarHeight } from "./constants";

const imagesCountQuery = gql`
  query getImageList {
    images {
      id
    }
  }
`;

export const Gallery = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const imageId = router.query.id as string;

  // TODO: This should be done on the backend side.
  const imagesResult =
    useQuery<{ images: Pick<ImageType, "id">[] }>(imagesCountQuery);
  const currentImageIndex = imagesResult?.data?.images.findIndex(
    (image) => image.id === imageId
  );

  const { count: itemCount, data, askForItemsInRange } = usePaginatedImages();

  const { virtualItems, totalSize, scrollToIndex } = useVirtual({
    size: itemCount,
    parentRef: listRef,
    estimateSize: useCallback(() => itemWidth, []),
    horizontal: true,
    overscan: 10,
  });

  useEffect(() => {
    if (currentImageIndex == null || currentImageIndex === -1) {
      return;
    }

    scrollToIndex(currentImageIndex, { align: "center" });
  }, [currentImageIndex, scrollToIndex]);

  useEffect(() => {
    if (virtualItems.length === 0) {
      return;
    }

    const start = virtualItems[0].index;
    const end = virtualItems[virtualItems.length - 1].index;
    askForItemsInRange(start, end);
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

import { useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { Box } from "@chakra-ui/react";
import { useVirtual } from "react-virtual";

import { useImagesNavigation } from "../../hooks/use-images-navigation";

import { GalleryItem } from "./gallery-item";
import { itemHeight, itemWidth, scrollbarHeight } from "./constants";

export const Gallery = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const imageId = router.query.id as string;

  const { images, currentImageIndex } = useImagesNavigation();

  const { virtualItems, totalSize, scrollToIndex } = useVirtual({
    size: images.length ?? 0,
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
            id={images[item.index]?.id}
            url={images[item.index]?.url}
            isSelected={imageId === images[item.index]?.id}
            start={item.start}
            index={item.index}
          />
        ))}
      </Box>
    </Box>
  );
};

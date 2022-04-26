import { useCallback, useRef, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { useVirtual } from "react-virtual";

import { useImagesNavigation } from "../../hooks/use-images-navigation";

import { GalleryItem } from "./gallery-item";
import { itemHeight, itemWidth, scrollbarHeight } from "./constants";
import { useDataset, useDatasetImage, useWorkspace } from "../../hooks";

/**
 * Virtualized, unpaginated list of images.
 *
 * Side note:
 * This component was paginated. We decided to revert this and go for a simpler solution.
 * Now it queries every images at once. See `useImagesNavigation`.
 * If you, beings of the future, wish to change paginate this component again,
 * you can find the code here:
 * https://github.com/labelflow/labelflow/pull/179/files/22a9cf33c2c0af2d4b91762a6cc3d18f5f678274..427b488b7180272e7b7d8dcbb11a464a6bea32b7
 */
export const Gallery = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const { slug: workspaceSlug } = useWorkspace();
  const { slug: datasetSlug } = useDataset();
  const { id: imageId } = useDatasetImage();

  const { images, currentImageIndex } = useImagesNavigation();

  const { virtualItems, totalSize, scrollToIndex } = useVirtual({
    size: images?.length ?? 0,
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
            imageId={images?.[item.index]?.id}
            datasetSlug={datasetSlug}
            workspaceSlug={workspaceSlug}
            url={images?.[item.index]?.thumbnail200Url ?? undefined}
            isSelected={imageId === images?.[item.index]?.id}
            start={item.start}
            index={item.index}
          />
        ))}
      </Box>
    </Box>
  );
};

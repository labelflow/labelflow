import { useEffect, useRef } from "react";
import { HStack, VStack, useColorModeValue, Flex } from "@chakra-ui/react";
import { useQueryParam } from "use-query-params";
import { OpenlayersMap } from "./openlayers-map";
import { DrawingToolbar } from "./drawing-tool-bar";
import { ViewToolbar } from "./view-tool-bar";
import { OptionsToolBar } from "./options-tool-bar";
import { ImageLoadError } from "./image-load-error";
import { ImageNavigationTool } from "./image-navigation";
import { useUndoStore } from "../../connectors/undo-store";
import { useLabelingStore } from "../../connectors/labeling-state";
import { BoolParam } from "../../utils/query-param-bool";
import { useDatasetImage } from "../../hooks";

export const LabelingTool = () => {
  const { clear } = useUndoStore();

  const { id: imageId } = useDatasetImage();
  const containerRef = useRef<HTMLDivElement>(null);

  const containerSx = {
    backgroundColor: useColorModeValue("gray.100", "gray.900"),
  };

  useEffect(() => {
    clear();
    return () => {
      useLabelingStore.getState().setSelectedLabelId(null);
      useLabelingStore.getState().setIsContextMenuOpen(false);
    };
  }, [imageId]);

  const [imageLoadError] = useQueryParam("image-load-error", BoolParam);

  return (
    <Flex
      grow={1}
      direction="column"
      position="relative"
      overflow="hidden"
      ref={containerRef}
      sx={containerSx}
    >
      {imageLoadError ? <ImageLoadError /> : <OpenlayersMap />}

      <HStack
        position="absolute"
        top={0}
        left={0}
        padding={4}
        spacing={4}
        pointerEvents="none"
        alignItems="flex-start"
      >
        <VStack spacing={4} alignItems="flex-start">
          <DrawingToolbar />
        </VStack>
        <OptionsToolBar />
      </HStack>
      <VStack
        padding={4}
        spacing={4}
        position="absolute"
        top={0}
        right={0}
        pointerEvents="none"
      >
        <ViewToolbar containerRef={containerRef} />
      </VStack>
      <HStack
        padding={4}
        spacing={4}
        position="absolute"
        bottom={0}
        left={0}
        pointerEvents="none"
      >
        <ImageNavigationTool />
      </HStack>
    </Flex>
  );
};

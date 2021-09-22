import { useEffect, useRef } from "react";
import {
  Box,
  HStack,
  VStack,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import { OpenlayersMap } from "./openlayers-map";
import { DrawingToolbar } from "./drawing-tool-bar";
import { ZoomToolbar } from "./zoom-tool-bar";
import { OptionsToolBar } from "./options-tool-bar";
import { ImageNavigationToolbar } from "./image-navigation-tool-bar";
import { useUndoStore } from "../../connectors/undo-store";
import { useLabellingStore } from "../../connectors/labelling-state";

export const LabellingTool = () => {
  const { clear } = useUndoStore();
  const setSelectedLabelId = useLabellingStore(
    (state) => state.setSelectedLabelId
  );
  const router = useRouter();
  const { imageId } = router?.query;
  const containerRef = useRef<HTMLDivElement>(null);

  const containerSx = {
    backgroundColor: mode("gray.100", "gray.900"),
  };

  useEffect(() => {
    clear();
    return () => setSelectedLabelId(null);
  }, [imageId]);

  return (
    <Box
      height="100%"
      position="relative"
      overflow="hidden"
      ref={containerRef}
      sx={containerSx}
    >
      <OpenlayersMap />
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
        <ZoomToolbar containerRef={containerRef} />
      </VStack>
      <HStack
        padding={4}
        spacing={4}
        position="absolute"
        bottom={0}
        left={0}
        pointerEvents="none"
      >
        <ImageNavigationToolbar />
      </HStack>
    </Box>
  );
};

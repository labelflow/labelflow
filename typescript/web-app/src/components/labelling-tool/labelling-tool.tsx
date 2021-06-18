import { useEffect } from "react";
import { Box, HStack, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { OpenlayersMap } from "./openlayers-map";
import { DrawingToolbar } from "./drawing-tool-bar";
import { ZoomToolbar } from "./zoom-tool-bar";
import { ImageNavigationToolbar } from "./image-navigation-tool-bar";
import { useUndoStore } from "../../connectors/undo-store";

export const LabellingTool = () => {
  const { clear } = useUndoStore();
  const router = useRouter();
  const imageId = router.query.id;

  useEffect(() => clear(), [imageId]);

  return (
    <Box height="100%" position="relative" overflow="hidden">
      <OpenlayersMap />
      <VStack
        padding={4}
        spacing={4}
        position="absolute"
        top={0}
        left={0}
        pointerEvents="none"
        alignItems="flex-start"
      >
        <DrawingToolbar />
      </VStack>
      <VStack
        padding={4}
        spacing={4}
        position="absolute"
        top={0}
        right={0}
        pointerEvents="none"
        zIndex={1}
      >
        <ZoomToolbar />
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

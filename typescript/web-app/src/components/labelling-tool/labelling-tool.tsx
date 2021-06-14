import { Box, HStack, VStack } from "@chakra-ui/react";

import { OpenlayersMap } from "./openlayers-map";
import { DrawingToolbar } from "./drawing-tool-bar";
import { ImageNavigationToolbar } from "./image-navigation-tool-bar";

export const LabellingTool = () => {
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
      >
        <DrawingToolbar />
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

import { Box, HStack, VStack } from "@chakra-ui/react";
import { NextRouter } from "next/router";
import { DrawingToolbar } from "../drawing-tool-bar";

import type { Image } from "../../types.generated";
import { ImageNavigationToolbar } from "../image-navigation-tool-bar";
import OpenlayersMap from "../openlayers-map";

export type Props = {
  image?: Pick<Image, "id" | "url" | "name" | "width" | "height">;
  images?: Pick<Image, "id">[];
  router: NextRouter;
};

export const LabellingTool = ({ image, images, router }: Props) => {
  return (
    <Box height="100%" position="relative">
      <OpenlayersMap image={image} />
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
        <ImageNavigationToolbar
          imageId={image?.id}
          images={images}
          router={router}
        />
      </HStack>
    </Box>
  );
};

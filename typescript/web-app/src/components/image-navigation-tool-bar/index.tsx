import { HStack } from "@chakra-ui/react";

import { NextRouter } from "next/router";

import { Image } from "../../types.generated";
import { ImageNavigationTool } from "./image-navigation-tool";

export type Props = {
  imageId: string | undefined;
  images: Pick<Image, "id">[] | undefined;
  router: NextRouter;
};

export const ImageNavigationToolbar = ({ imageId, images, router }: Props) => {
  return (
    <HStack
      padding={4}
      spacing={4}
      position="absolute"
      bottom={0}
      left={0}
      pointerEvents="none"
    >
      <ImageNavigationTool imageId={imageId} images={images} router={router} />
    </HStack>
  );
};

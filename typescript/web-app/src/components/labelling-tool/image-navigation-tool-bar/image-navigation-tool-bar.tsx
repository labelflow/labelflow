import { NextRouter } from "next/router";

import { Image } from "../../../graphql-types.generated";
import { ImageNavigationTool } from "./image-navigation-tool";

export type Props = {
  imageId: string | undefined;
  images: Pick<Image, "id">[] | undefined;
  router: NextRouter;
};

export const ImageNavigationToolbar = ({ imageId, images, router }: Props) => {
  return (
    <>
      <ImageNavigationTool imageId={imageId} images={images} router={router} />
    </>
  );
};

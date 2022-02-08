import { DbImage } from "../..";
import { DbLabel } from "../../types";

type ImageDimensions = {
  width: number;
  height: number;
};

export const addImageDimensionsToLabels = (
  labels: DbLabel[],
  images: DbImage[]
) => {
  const dimensionsByImage = images.reduce(
    (acc: { [imageId: string]: ImageDimensions }, image) => {
      const key = image.id;
      if (!acc[key]) {
        acc[key] = { width: image.width, height: image.height };
      }
      return acc;
    },
    {}
  );

  return labels.map((label) => ({
    ...label,
    imageDimensions: dimensionsByImage[label.imageId],
  }));
};

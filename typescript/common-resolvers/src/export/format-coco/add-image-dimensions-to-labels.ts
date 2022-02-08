import { DbLabel, DbImage } from "../../types";

type ImageDimensions = Pick<DbImage, "width" | "height">;

export const addImageDimensionsToLabels = (
  labels: DbLabel[],
  images: DbImage[]
) => {
  const dimensionsByImage = images.reduce<Record<string, ImageDimensions>>(
    (prev, { id, width, height }) => ({ ...prev, [id]: { width, height } }),
    {}
  );
  return labels.map((label) => ({
    ...label,
    imageDimensions: dimensionsByImage[label.imageId],
  }));
};

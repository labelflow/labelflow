import { DbLabel, Repository } from "../../types";
import { DbLabelWithImageDimensions } from "./coco-core/types";

export const addImageDimensionsToLabels = async (
  labels: DbLabel[],
  repository: Repository
): Promise<DbLabelWithImageDimensions[]> => {
  return await Promise.all(
    labels.map(async (label) => {
      const { imageId } = label;
      const image = await repository.image.getById(imageId);
      if (image == null) {
        throw new Error(`Missing image with id ${imageId}`);
      }
      return {
        ...label,
        imageDimensions: { height: image.height, width: image.width },
      };
    })
  );
};

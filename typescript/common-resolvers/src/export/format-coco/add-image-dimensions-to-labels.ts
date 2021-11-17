import { DbLabel, Repository } from "../../types";
import { DbLabelWithImageDimensions } from "./coco-core/types";

export const addImageDimensionsToLabels = async (
  labels: DbLabel[],
  repository: Repository,
  user?: { id: string }
): Promise<DbLabelWithImageDimensions[]> => {
  return await Promise.all(
    labels.map(async (label) => {
      const { imageId } = label;
      const image = await repository.image.get({ id: imageId }, user);
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

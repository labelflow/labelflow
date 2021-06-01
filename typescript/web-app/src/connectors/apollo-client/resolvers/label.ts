import { v4 as uuidv4 } from "uuid";
import type { Label, MutationCreateLabelArgs } from "../../../types.generated";

import { db } from "../../database";

// Mutations
const createLabel = async (
  _: any,
  args: MutationCreateLabelArgs
): Promise<Label> => {
  const { imageId, x, y, height, width } = args.data;

  // We need to ensure the image exists before adding the labels
  const image = await db.image.get(imageId);
  if (image == null) {
    throw new Error(`The image id ${imageId} doesn't exist.`);
  }

  const labelId = uuidv4();
  const newLabelEntity = {
    id: labelId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    imageId,
    x,
    y,
    height,
    width,
  };

  await db.label.add(newLabelEntity);
  return newLabelEntity;
};

export default {
  Mutation: {
    createLabel,
  },
};

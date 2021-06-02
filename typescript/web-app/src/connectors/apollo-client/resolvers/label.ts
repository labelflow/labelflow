import { v4 as uuidv4 } from "uuid";
import type { Label, MutationCreateLabelArgs } from "../../../types.generated";

import { db, Label as LabelDb } from "../../database";

// Queries
const labelClass = async (label: LabelDb) => {
  return db.labelClass.get(label.labelClassId);
};

// Mutations
const createLabel = async (
  _: any,
  args: MutationCreateLabelArgs
): Promise<Partial<Label>> => {
  const { id, imageId, x, y, height, width, labelClassId } = args.data;

  // We need to ensure the image exists before adding the labels
  const image = await db.image.get(imageId);
  if (image == null) {
    throw new Error(`The image id ${imageId} doesn't exist.`);
  }

  const labelId = id ?? uuidv4();

  const newLabelEntity = {
    id: labelId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    labelClassId,
    imageId,
    x,
    y,
    height,
    width,
  };

  await db.label.add(newLabelEntity);
  const result = await db.label.get(labelId);
  if (!result) {
    throw new Error("Could not create the label entity");
  }
  return result;
};

export default {
  Mutation: {
    createLabel,
  },
  Label: {
    labelClass,
  },
};

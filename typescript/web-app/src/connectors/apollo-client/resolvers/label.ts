import { v4 as uuidv4 } from "uuid";
import type {
  Label,
  MutationCreateLabelArgs,
  MutationDeleteLabelArgs,
} from "../../../types.generated";

import { db, Label as LabelDb } from "../../database";

// Queries
const labelClass = async (label: LabelDb) => {
  if (!label?.labelClassId) {
    return null;
  }

  return db.labelClass.get(label.labelClassId) ?? null;
};

// Mutations
const createLabel = async (
  _: any,
  args: MutationCreateLabelArgs
): Promise<Partial<Label>> => {
  const { id, imageId, x, y, height, width, labelClassId } = args.data;

  // Since we don't have any constraint checks with Dexie
  // We need to ensure that the imageId and the labelClassId
  // matches some entity before being able to continue.
  if ((await db.image.get(imageId)) == null) {
    throw new Error(`The image id ${imageId} doesn't exist.`);
  }

  if (labelClassId != null) {
    if ((await db.labelClass.get(labelClassId)) == null) {
      throw new Error(`The labelClass id ${labelClassId} doesn't exist.`);
    }
  }

  const labelId = id ?? uuidv4();
  const now = new Date();

  const newLabelEntity = {
    id: labelId,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
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

const deleteLabel = async (_: any, args: MutationDeleteLabelArgs) => {
  const labelId = args.data.id;

  const label = await db.label.get(labelId);

  if (!label) {
    throw new Error("No label with such id");
  }

  await db.label.delete(labelId);

  return label;
};

export default {
  Mutation: {
    createLabel,
    deleteLabel,
  },
  Label: {
    labelClass,
  },
};

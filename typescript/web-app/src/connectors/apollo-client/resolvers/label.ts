import { v4 as uuidv4 } from "uuid";
import type {
  Label,
  MutationCreateLabelArgs,
  MutationDeleteLabelArgs,
  MutationUpdateLabelArgs,
} from "../../../graphql-types.generated";
import { ContextWithDataSources } from "../datasources/types";

import { db, DbLabel } from "../../database";

export const getLabels = () => db.label.toArray();

// Queries
const labelClass = async (
  parent: DbLabel,
  _args: any,
  context: ContextWithDataSources
) => {
  const {
    dataSources: { labelClassDataSource },
  } = context;

  if (parent.labelClassId == null) return null;

  try {
    return await labelClassDataSource.getLabelClassById(parent.labelClassId);
  } catch (e) {
    return null;
  }
};

// Mutations
const createLabel = async (
  _: any,
  args: MutationCreateLabelArgs
): Promise<Label> => {
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
  const labelId = args.where.id;

  const label = await db.label.get(labelId);

  if (!label) {
    throw new Error("No label with such id");
  }

  await db.label.delete(labelId);

  return label;
};

const updateLabel = async (_: any, args: MutationUpdateLabelArgs) => {
  const labelId = args.where.id;

  const label = await db.label.get(labelId);

  if ("labelClassId" in args.data && args.data.labelClassId != null) {
    const labelClassToConnect = await db.labelClass.get(args.data.labelClassId);

    if (!labelClassToConnect) {
      throw new Error("No label class with such id");
    }
  }

  if (!label) {
    throw new Error("No label with such id");
  }

  await db.label.update(labelId, args.data);

  return db.label.get(labelId);
};

export default {
  Mutation: {
    createLabel,
    deleteLabel,
    updateLabel,
  },
  Label: {
    labelClass,
  },
};

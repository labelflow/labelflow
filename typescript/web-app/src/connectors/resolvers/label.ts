import { v4 as uuidv4 } from "uuid";
import type {
  Label,
  MutationCreateLabelArgs,
  MutationDeleteLabelArgs,
  MutationUpdateLabelArgs,
  QueryLabelArgs,
} from "../../graphql-types.generated";

import { db, DbLabel } from "../database";

export const getLabels = () => db.label.toArray();

const getLabelById = async (id: string): Promise<DbLabel> => {
  const entity = await db.label.get(id);
  if (entity === undefined) {
    throw new Error("No label with such id");
  }

  return entity;
};

const resizeLabelToFitInsideImageBounds = async (labelData: {
  x: number;
  y: number;
  width: number;
  height: number;
  imageId: string;
}): Promise<{
  x: number;
  y: number;
  width: number;
  height: number;
}> => {
  const { x, y, width, height, imageId } = labelData;
  const image = await db.image.get(imageId);
  const imageWidth = image?.width ?? x + width;
  const imageHeight = image?.height ?? y + height;
  if (
    (x < 0 && x + width < 0) ||
    (x + width > imageWidth && x > imageWidth) ||
    (y < 0 && y + height < 0) ||
    (y + height > imageHeight && y > imageHeight)
  ) {
    throw new Error("Bounding box out of image bounds");
  }

  const boundedX = Math.max(x, 0);
  const boundedY = Math.max(y, 0);

  return {
    x: boundedX,
    y: boundedY,
    height: Math.min(imageHeight, y + height) - boundedY,
    width: Math.min(imageWidth, x + width) - boundedX,
  };
};

// Queries
const labelClass = async (label: DbLabel) => {
  if (!label?.labelClassId) {
    return null;
  }

  return db.labelClass.get(label.labelClassId) ?? null;
};

const label = (_: any, args: QueryLabelArgs) => {
  return getLabelById(args?.where?.id);
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
  const image = await db.image.get(imageId);
  if (image == null) {
    throw new Error(`The image id ${imageId} doesn't exist.`);
  }

  if (labelClassId != null) {
    if ((await db.labelClass.get(labelClassId)) == null) {
      throw new Error(`The labelClass id ${labelClassId} doesn't exist.`);
    }
  }

  const labelId = id ?? uuidv4();
  const now = new Date();

  const resizedLabel = await resizeLabelToFitInsideImageBounds({
    x,
    y,
    width,
    height,
    imageId,
  });

  const newLabelEntity = {
    id: labelId,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    labelClassId,
    imageId,
    x: resizedLabel.x,
    y: resizedLabel.y,
    height: resizedLabel.height,
    width: resizedLabel.width,
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

  const labelToDelete = await db.label.get(labelId);

  if (!labelToDelete) {
    throw new Error("No label with such id");
  }

  await db.label.delete(labelId);

  return labelToDelete;
};

const updateLabel = async (_: any, args: MutationUpdateLabelArgs) => {
  const labelId = args.where.id;

  if ("labelClassId" in args.data && args.data.labelClassId != null) {
    const labelClassToConnect = await db.labelClass.get(args.data.labelClassId);

    if (!labelClassToConnect) {
      throw new Error("No label class with such id");
    }
  }

  const labelData = await getLabelById(labelId);
  const imageId = labelData?.imageId;
  const { x, y, width, height } = labelData;
  const resizedLabel = await resizeLabelToFitInsideImageBounds({
    x: args.data?.x ?? x,
    y: args.data?.y ?? y,
    height: args.data?.height ?? height,
    width: args.data?.width ?? width,
    imageId,
  });

  await db.label.update(labelId, { ...args.data, ...resizedLabel });

  return labelData;
};

const labelsAggregates = () => {
  return {};
};

const totalCount = () => {
  return db.label.count();
};

export default {
  Query: {
    label,
    labelsAggregates,
  },
  Mutation: {
    createLabel,
    deleteLabel,
    updateLabel,
  },
  Label: {
    labelClass,
  },
  LabelsAggregates: { totalCount },
};

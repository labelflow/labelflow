import { v4 as uuidv4 } from "uuid";
import type {
  Label,
  MutationCreateLabelArgs,
  QueryLabelArgs,
  QueryLabelsArgs,
  Maybe,
} from "../../../types.generated";

import { db } from "../../database";

const getLabelById = async (id: string): Promise<Label> => {
  const entity = await db.label.get(id);

  if (entity === undefined) {
    throw new Error("No label with such id");
  }

  return entity;
};

const getPaginatedLabels = async (
  skip?: Maybe<number>,
  first?: Maybe<number>
): Promise<any[]> => {
  const query = await db.label.orderBy("createdAt").offset(skip ?? 0);

  if (first) {
    return query.limit(first).toArray();
  }

  return query.toArray();
};

// Queries
export const label = async (_: any, args: QueryLabelArgs) => {
  return getLabelById(args?.where?.id);
};

export const labels = async (_: any, args: QueryLabelsArgs) => {
  return getPaginatedLabels(args?.skip, args?.first);
};

// Mutations
export const createLabel = async (
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
  Query: {
    label,
    labels,
  },

  Mutation: {
    createLabel,
  },
};

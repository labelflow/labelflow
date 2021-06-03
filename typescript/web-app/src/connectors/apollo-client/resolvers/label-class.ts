import { v4 as uuidv4 } from "uuid";
import type {
  LabelClass,
  MutationCreateLabelClassArgs,
  QueryLabelClassArgs,
  QueryLabelClassesArgs,
  Maybe,
} from "../../../types.generated";

import { db } from "../../database";

const getLabelClassById = async (id: string): Promise<Partial<LabelClass>> => {
  const entity = await db.labelClass.get(id);

  if (entity === undefined) {
    throw new Error("No labelClass with such id");
  }

  return entity;
};

const getPaginatedLabelClasses = async (
  skip?: Maybe<number>,
  first?: Maybe<number>
): Promise<any[]> => {
  const query = await db.labelClass.orderBy("createdAt").offset(skip ?? 0);

  if (first) {
    return query.limit(first).toArray();
  }

  return query.toArray();
};

// Queries
const labels = async (labelClass: LabelClass) => {
  const getResults = await db.label
    .where({ labelClassId: labelClass.id })
    .sortBy("createdAt");

  return getResults ?? [];
};

const labelClass = async (_: any, args: QueryLabelClassArgs) => {
  return getLabelClassById(args?.where?.id);
};

const labelClasses = async (_: any, args: QueryLabelClassesArgs) =>
  getPaginatedLabelClasses(args?.skip, args?.first);

// Mutations
const createLabelClass = async (
  _: any,
  args: MutationCreateLabelClassArgs
): Promise<Partial<LabelClass>> => {
  const { color, name, id } = args.data;
  const labelClassId = id ?? uuidv4();
  const newLabelClassEntity = {
    id: labelClassId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name,
    color,
  };
  await db.labelClass.add(newLabelClassEntity);
  return getLabelClassById(newLabelClassEntity.id);
};

export default {
  Query: {
    labelClass,
    labelClasses,
  },

  Mutation: {
    createLabelClass,
  },

  LabelClass: {
    labels,
  },
};

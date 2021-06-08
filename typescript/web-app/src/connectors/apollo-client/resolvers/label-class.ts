import { v4 as uuidv4 } from "uuid";
import type {
  LabelClass,
  MutationCreateLabelClassArgs,
  QueryLabelClassArgs,
  QueryLabelClassesArgs,
  Maybe,
} from "../../../graphql-types.generated";

import { db, DbLabelClass } from "../../database";

const getLabelClassById = async (id: string): Promise<DbLabelClass> => {
  const entity = await db.labelClass.get(id);

  if (entity === undefined) {
    throw new Error("No labelClass with such id");
  }

  return entity;
};

export const getPaginatedLabelClasses = async (
  skip?: Maybe<number>,
  first?: Maybe<number>
): Promise<DbLabelClass[]> => {
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

const labelClass = async (_: any, args: QueryLabelClassArgs) =>
  getLabelClassById(args?.where?.id);

const labelClasses = async (_: any, args: QueryLabelClassesArgs) =>
  getPaginatedLabelClasses(args?.skip, args?.first);

// Mutations
const createLabelClass = async (
  _: any,
  args: MutationCreateLabelClassArgs
): Promise<DbLabelClass> => {
  const { color, name, id } = args.data;
  const labelClassId = id ?? uuidv4();
  const now = new Date();

  const newLabelClassEntity = {
    id: labelClassId,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
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

import { v4 as uuidv4 } from "uuid";
import type {
  LabelClass,
  MutationCreateLabelClassArgs,
  MutationDeleteLabelClassArgs,
  QueryLabelClassArgs,
  QueryLabelClassesArgs,
  Maybe,
  LabelClassWhereInput,
} from "../../graphql-types.generated";

import { db, DbLabelClass } from "../database";
import { projectTypename } from "./project";

const getLabelClassById = async (id: string): Promise<DbLabelClass> => {
  const entity = await db.labelClass.get(id);

  if (entity === undefined) {
    throw new Error("No labelClass with such id");
  }

  return entity;
};

export const getPaginatedLabelClasses = async (
  where?: Maybe<LabelClassWhereInput>,
  skip?: Maybe<number>,
  first?: Maybe<number>
): Promise<DbLabelClass[]> => {
  const query = db.labelClass.orderBy("createdAt");

  if (where?.projectId) {
    query.filter((image) => image.projectId === where.projectId);
  }

  if (skip) {
    query.offset(skip);
  }
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
  getPaginatedLabelClasses(args?.where, args?.skip, args?.first);

// Mutations
const createLabelClass = async (
  _: any,
  args: MutationCreateLabelClassArgs
): Promise<DbLabelClass> => {
  const { color, name, id, projectId } = args.data;

  // Since we don't have any constraint checks with Dexie
  // we need to ensure that the projectId matches some
  // entity before being able to continue.
  const project = await db.project.get(projectId);
  if (project == null) {
    throw new Error(`The project id ${projectId} doesn't exist.`);
  }

  const labelClassId = id ?? uuidv4();
  const now = new Date();

  const newLabelClassEntity = {
    id: labelClassId,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    name,
    color,
    projectId,
  };
  await db.labelClass.add(newLabelClassEntity);
  return getLabelClassById(newLabelClassEntity.id);
};

const updateLabelClass = async (_: any, args: MutationUpdateLabelClassArgs) => {
  const labelClassId = args.where.id;

  const labelClassToUpdate = await getLabelClassById(labelClassId);

  await db.labelClass.update(labelClassId, {
    ...labelClassToUpdate,
    ...args.data,
  });

  return getLabelClassById(labelClassId);
};

const deleteLabelClass = async (_: any, args: MutationDeleteLabelClassArgs) => {
  const labelClassId = args.where.id;

  const labelClassToDelete = await db.labelClass.get(labelClassId);

  if (!labelClassToDelete) {
    throw new Error("No labelClass with such id");
  }

  await db.labelClass.delete(labelClassId);

  return labelClassToDelete;
};

const labelClassesAggregates = (parent: any) => {
  // Forward `parent` to chained resolvers if it exists
  return parent ?? {};
};

const totalCount = (parent: any) => {
  // eslint-disable-next-line no-underscore-dangle
  const typename = parent?.__typename;

  if (typename === projectTypename) {
    return db.labelClass
      .where({
        projectId: parent.id,
      })
      .count();
  }

  return db.labelClass.count();
};

export default {
  Query: {
    labelClass,
    labelClasses,
    labelClassesAggregates,
  },

  Mutation: {
    createLabelClass,
    updateLabelClass,
    deleteLabelClass,
  },

  LabelClass: {
    labels,
  },

  LabelClassesAggregates: { totalCount },

  Project: {
    labelClassesAggregates,
  },
};

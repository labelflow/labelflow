import { v4 as uuidv4 } from "uuid";
import type {
  LabelClass,
  MutationCreateLabelClassArgs,
  MutationUpdateLabelClassArgs,
  MutationDeleteLabelClassArgs,
  QueryLabelClassArgs,
  QueryLabelClassesArgs,
} from "@labelflow/graphql-types";

import { Context, DbLabelClass } from "./types";
import { throwIfResolvesToNil } from "./utils/throw-if-resolves-to-nil";

// Queries
const labels = async (
  labelClass: LabelClass,
  _args: any,
  { repository }: Context
) => {
  return await repository.label.list({ labelClassId: labelClass.id });
};

const labelClass = async (
  _: any,
  args: QueryLabelClassArgs,
  { repository }: Context
) => {
  return await throwIfResolvesToNil(
    "No labelClass with such id",
    repository.labelClass.getById
  )(args?.where?.id);
};

const labelClasses = async (
  _: any,
  args: QueryLabelClassesArgs,
  { repository }: Context
) => {
  return await repository.labelClass.list(args?.where, args?.skip, args?.first);
};

// Mutations
const createLabelClass = async (
  _: any,
  args: MutationCreateLabelClassArgs,
  { repository }: Context
): Promise<DbLabelClass> => {
  const { color, name, id, datasetId } = args.data;

  // Since we don't have any constraint checks with Dexie
  // we need to ensure that the datasetId matches some
  // entity before being able to continue.
  await throwIfResolvesToNil(
    `The dataset id ${datasetId} doesn't exist.`,
    repository.dataset.getById
  )(datasetId);

  const labelClassId = id ?? uuidv4();
  const now = new Date();

  const newLabelClassEntity = {
    id: labelClassId,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    name,
    color,
    datasetId,
  };
  await repository.labelClass.add(newLabelClassEntity);

  return await throwIfResolvesToNil(
    "No labelClass with such id",
    repository.labelClass.getById
  )(newLabelClassEntity.id);
};

const updateLabelClass = async (
  _: any,
  args: MutationUpdateLabelClassArgs,
  { repository }: Context
) => {
  const labelClassId = args.where.id;

  const labelClassToUpdate = await throwIfResolvesToNil(
    "No labelClass with such id",
    repository.labelClass.getById
  )(labelClassId);

  await repository.labelClass.update(labelClassId, {
    ...labelClassToUpdate,
    ...args.data,
  });

  return await repository.labelClass.getById(labelClassId);
};

const deleteLabelClass = async (
  _: any,
  args: MutationDeleteLabelClassArgs,
  { repository }: Context
) => {
  const labelToDelete = await throwIfResolvesToNil(
    "No labelClass with such id",
    repository.labelClass.getById
  )(args.where.id);

  await repository.labelClass.delete(labelToDelete.id);
  return labelToDelete;
};

const labelClassesAggregates = (parent: any) => {
  // Forward `parent` to chained resolvers if it exists
  return parent ?? {};
};

const totalCount = async (parent: any, _args: any, { repository }: Context) => {
  // eslint-disable-next-line no-underscore-dangle
  const typename = parent?.__typename;

  if (typename === "Dataset") {
    return await repository.labelClass.count({
      datasetId: parent.id,
    });
  }

  return await repository.labelClass.count();
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

  Dataset: {
    labelClassesAggregates,
  },
};

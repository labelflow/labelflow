import { v4 as uuidv4 } from "uuid";
import type {
  LabelClass,
  MutationCreateLabelClassArgs,
  MutationDeleteLabelClassArgs,
  QueryLabelClassArgs,
  QueryLabelClassesArgs,
} from "@labelflow/graphql-types";

import { projectTypename } from "./project";

import { Context, DbLabelClass } from "./types";
import { throwIfResolvesToNil } from "./utils/throw-if-resolves-to-nil";

// Queries
const labels = async (
  labelClass: LabelClass,
  _args: any,
  { repository }: Context
) => {
  return repository.label.list({ labelClassId: labelClass.id });
};

const labelClass = async (
  _: any,
  args: QueryLabelClassArgs,
  { repository }: Context
) =>
  throwIfResolvesToNil(
    "No labelClass with such id",
    repository.labelClass.getById
  )(args?.where?.id);

const labelClasses = async (
  _: any,
  args: QueryLabelClassesArgs,
  { repository }: Context
) => repository.labelClass.list(args?.where, args?.skip, args?.first);

// Mutations
const createLabelClass = async (
  _: any,
  args: MutationCreateLabelClassArgs,
  { repository }: Context
): Promise<DbLabelClass> => {
  const { color, name, id, projectId } = args.data;

  // Since we don't have any constraint checks with Dexie
  // we need to ensure that the projectId matches some
  // entity before being able to continue.
  await throwIfResolvesToNil(
    `The project id ${projectId} doesn't exist.`,
    repository.project.getById
  )(projectId);

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
  await repository.labelClass.add(newLabelClassEntity);

  return throwIfResolvesToNil(
    "No labelClass with such id",
    repository.labelClass.getById
  )(newLabelClassEntity.id);
};

const deleteLabelClass = async (
  _: any,
  args: MutationDeleteLabelClassArgs,
  { repository }: Context
) => {
  const labelClassId = args.where.id;

  const labelClassToDelete = await throwIfResolvesToNil(
    "No labelClass with such id",
    repository.labelClass.getById
  )(labelClassId);

  await repository.labelClass.delete(labelClassId);

  return labelClassToDelete;
};

const labelClassesAggregates = (parent: any) => {
  // Forward `parent` to chained resolvers if it exists
  return parent ?? {};
};

const totalCount = (parent: any, _args: any, { repository }: Context) => {
  // eslint-disable-next-line no-underscore-dangle
  const typename = parent?.__typename;

  if (typename === projectTypename) {
    return repository.labelClass.count({
      projectId: parent.id,
    });
  }

  return repository.labelClass.count();
};

export default {
  Query: {
    labelClass,
    labelClasses,
    labelClassesAggregates,
  },

  Mutation: {
    createLabelClass,
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

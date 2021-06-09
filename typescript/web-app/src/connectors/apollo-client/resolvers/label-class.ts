import type {
  LabelClass,
  MutationCreateLabelClassArgs,
  QueryLabelClassArgs,
  QueryLabelClassesArgs,
} from "../../../graphql-types.generated";

import { db } from "../../database";

import { LabelClassDataSource } from "../datasources/types";

// Queries
const labels = async (labelClass: LabelClass) => {
  const getResults = await db.label
    .where({ labelClassId: labelClass.id })
    .sortBy("createdAt");

  return getResults ?? [];
};

const labelClass = async (
  _: any,
  args: QueryLabelClassArgs,
  context: { dataSources: { labelClassDataSource: LabelClassDataSource } }
): Promise<LabelClass> => {
  const {
    dataSources: { labelClassDataSource },
  } = context;

  return labelClassDataSource.getLabelClassById(args?.where?.id);
};

const labelClasses = async (
  _: any,
  args: QueryLabelClassesArgs,
  {
    dataSources: { labelClassDataSource },
  }: { dataSources: { labelClassDataSource: LabelClassDataSource } }
) => labelClassDataSource.getPaginatedLabelClasses(args);

// Mutations
const createLabelClass = async (
  _: any,
  args: MutationCreateLabelClassArgs,
  context: { dataSources: { labelClassDataSource: LabelClassDataSource } }
): Promise<LabelClass> => {
  const {
    dataSources: { labelClassDataSource },
  } = context;

  const newLabelClassId = await labelClassDataSource.createLabelClass(
    args?.data
  );

  return labelClassDataSource.getLabelClassById(newLabelClassId);
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

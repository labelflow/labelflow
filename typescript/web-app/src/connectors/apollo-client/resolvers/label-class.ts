import type {
  LabelClass,
  MutationCreateLabelClassArgs,
  QueryLabelClassArgs,
  QueryLabelClassesArgs,
} from "../../../graphql-types.generated";

import { ContextWithDataSources } from "../datasources/types";

// Queries
const labels = async (
  parent: LabelClass,
  _: any,
  context: ContextWithDataSources
) => {
  const {
    dataSources: { labelDataSource },
  } = context;
  return labelDataSource.getLabelsByClassId(parent.id);
};

const labelClass = async (
  _: any,
  args: QueryLabelClassArgs,
  context: ContextWithDataSources
): Promise<LabelClass> => {
  const {
    dataSources: { labelClassDataSource },
  } = context;

  return labelClassDataSource.getLabelClassById(args?.where?.id);
};

const labelClasses = async (
  _: any,
  args: QueryLabelClassesArgs,
  context: ContextWithDataSources
) => {
  const {
    dataSources: { labelClassDataSource },
  } = context;
  return labelClassDataSource.getPaginatedLabelClasses(args);
};

// Mutations
const createLabelClass = async (
  _: any,
  args: MutationCreateLabelClassArgs,
  context: ContextWithDataSources
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

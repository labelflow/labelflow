import type {
  LabelClass,
  MutationCreateLabelClassArgs,
  QueryLabelClassArgs,
  QueryLabelClassesArgs,
} from "../../../graphql-types.generated";

import { LabelClassDataSource, LabelDataSource } from "../datasources/types";

// Queries
const labels = async (
  parent: LabelClass,
  _: any,
  context: { dataSources: { labelDataSource: LabelDataSource } }
) => {
  const {
    dataSources: { labelDataSource },
  } = context;
  return labelDataSource.getLabelsByClassId(parent.id);
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

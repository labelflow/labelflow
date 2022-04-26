import { v4 as uuidv4 } from "uuid";
import type {
  LabelClass,
  MutationCreateLabelClassArgs,
  MutationCreateManyLabelClassesArgs,
  MutationUpdateLabelClassArgs,
  MutationReorderLabelClassArgs,
  MutationDeleteLabelClassArgs,
  QueryLabelClassArgs,
  QueryLabelClassesArgs,
} from "@labelflow/graphql-types";
import { getNextClassColor } from "@labelflow/utils";
import { Context, DbLabelClass } from "./types";
import { throwIfResolvesToNil } from "./utils/throw-if-resolves-to-nil";

// Queries
const labels = async (
  labelClass: LabelClass,
  _args: any,
  { repository, user }: Context
) => {
  return await repository.label.list({ labelClassId: labelClass.id, user });
};

const labelClass = async (
  _: any,
  args: QueryLabelClassArgs,
  { repository, user }: Context
) => {
  return await throwIfResolvesToNil(
    "No labelClass with such id",
    repository.labelClass.get
  )({ id: args?.where?.id }, user);
};

const labelClasses = async (
  _: any,
  args: QueryLabelClassesArgs,
  { repository, user }: Context
) => {
  return await repository.labelClass.list(
    { ...args?.where, user },
    args?.skip,
    args?.first
  );
};

const labelClassExists = async (
  _: any,
  args: QueryLabelClassArgs,
  { repository, user }: Context
): Promise<Boolean> => {
  try {
    const data = await repository.labelClass.list({ ...args?.where, user });
    return data.length > 0;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("User not authorized to access workspace")
    ) {
      return true;
    }
    throw error;
  }
};

// Mutations
const createLabelClass = async (
  _: any,
  args: MutationCreateLabelClassArgs,
  { repository, user }: Context
): Promise<DbLabelClass> => {
  const { color, name, id, datasetId } = args.data;
  const createdLabelClasses = await repository.labelClass.list({
    datasetId,
    user,
  });

  const labelClassId = id ?? uuidv4();
  const now = new Date();

  const newLabelClassEntity = {
    id: labelClassId,
    index: createdLabelClasses.length,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    name,
    color:
      color ??
      getNextClassColor(
        createdLabelClasses.map((attributedClass) => attributedClass.color)
      ),
    datasetId,
  };
  await repository.labelClass.add(newLabelClassEntity, user);
  return await throwIfResolvesToNil(
    "No labelClass with such id",
    repository.labelClass.get
  )({ id: newLabelClassEntity.id }, user);
};

const createManyLabelClasses = async (
  _: any,
  args: MutationCreateManyLabelClassesArgs,
  { repository, user }: Context
): Promise<DbLabelClass[]> => {
  const { labelClasses: newLabelClasses, datasetId } = args.data;
  const existingLabelClasses = await repository.labelClass.list({
    datasetId,
    user,
  });
  const nowIso = new Date().toISOString();
  const { newColors } = newLabelClasses.reduce<{
    existingColors: string[];
    newColors: string[];
  }>(
    (colors) => {
      const newColor = getNextClassColor(colors.existingColors);
      colors.existingColors.push(newColor);
      colors.newColors.push(newColor);
      return colors;
    },
    {
      existingColors: existingLabelClasses.map((item) => item.color),
      newColors: [],
    }
  );
  const newLabelClassesEntities = newLabelClasses.map(
    (newLabelClass, index) => ({
      id: newLabelClass.id ?? uuidv4(),
      index: existingLabelClasses.length + index,
      createdAt: nowIso,
      updatedAt: nowIso,
      name: newLabelClass.name,
      color: newColors[index],
      datasetId,
    })
  );
  const labelClassesIds = await repository.labelClass.addMany(
    { labelClasses: newLabelClassesEntities },
    user
  );
  return await repository.labelClass.list({
    id: { in: labelClassesIds },
    user,
  });
};

const reorderLabelClass = async (
  _: any,
  args: MutationReorderLabelClassArgs,
  { repository, user }: Context
) => {
  const labelClassId = args.where.id;

  const labelClassToUpdate = await throwIfResolvesToNil(
    "No labelClass with such id",
    repository.labelClass.get
  )({ id: labelClassId }, user);
  const oldIndex = labelClassToUpdate.index;
  const newIndex = args.data.index;
  if (oldIndex === newIndex) {
    return labelClassToUpdate;
  }
  const labelClassesOfDataset = await repository.labelClass.list({
    datasetId: labelClassToUpdate?.datasetId,
    user,
  });
  if (newIndex < 0 || newIndex > labelClassesOfDataset.length - 1) {
    throw new Error(`Can't reorder a labelClass with an index that is negative or more than the number of labelClasses.
    Received newIndex = ${newIndex} | maximum possible index is ${
      labelClassesOfDataset.length - 1
    }`);
  }

  const indexUpdate = newIndex < oldIndex ? 1 : -1;
  await Promise.all(
    labelClassesOfDataset.map(async (labelClassOfDataset) => {
      if (
        labelClassOfDataset.index === newIndex ||
        (labelClassOfDataset.index > Math.min(oldIndex, newIndex) &&
          labelClassOfDataset.index < Math.max(oldIndex, newIndex))
      ) {
        await repository.labelClass.update(
          { id: labelClassOfDataset.id },
          {
            ...labelClassOfDataset,
            index: labelClassOfDataset.index + indexUpdate,
          },
          user
        );
      }
    })
  );
  await repository.labelClass.update(
    { id: labelClassId },
    {
      ...labelClassToUpdate,
      index: args.data.index,
    },
    user
  );

  return await repository.labelClass.get({ id: labelClassId }, user);
};

const updateLabelClass = async (
  _: any,
  args: MutationUpdateLabelClassArgs,
  { repository, user }: Context
) => {
  const labelClassId = args.where.id;

  const labelClassToUpdate = await throwIfResolvesToNil(
    "No labelClass with such id",
    repository.labelClass.get
  )({ id: labelClassId }, user);

  await repository.labelClass.update(
    { id: labelClassId },
    {
      ...labelClassToUpdate,
      ...args.data,
    },
    user
  );

  return await repository.labelClass.get({ id: labelClassId }, user);
};

const deleteLabelClass = async (
  _: any,
  args: MutationDeleteLabelClassArgs,
  { repository, user }: Context
) => {
  const labelClassToDelete = await throwIfResolvesToNil(
    "No labelClass with such id",
    repository.labelClass.get
  )({ id: args.where.id }, user);

  await repository.labelClass.delete({ id: labelClassToDelete.id }, user);
  const labelClassesOfDataset = await repository.labelClass.list({
    datasetId: labelClassToDelete?.datasetId,
    user,
  });
  await Promise.all(
    labelClassesOfDataset.map(async (labelClassOfDataset) => {
      if (labelClassOfDataset.index > labelClassToDelete.index) {
        await repository.labelClass.update(
          { id: labelClassOfDataset.id },
          {
            ...labelClassOfDataset,
            index: labelClassOfDataset.index - 1,
          },
          user
        );
      }
    })
  );
  return labelClassToDelete;
};

const labelClassesAggregates = (parent: any) => {
  // Forward `parent` to chained resolvers if it exists
  return parent ?? {};
};

const totalCount = async (
  parent: any,
  _args: any,
  { repository, user }: Context
) => {
  // eslint-disable-next-line no-underscore-dangle
  const typename = parent?.__typename;

  if (typename === "Dataset") {
    return await repository.labelClass.count({
      datasetId: parent.id,
      user,
    });
  }

  return await repository.labelClass.count({ user });
};

const dataset = async (
  parent: DbLabelClass,
  _args: any,
  { repository, user }: Context
) => {
  return await repository.dataset.get({ id: parent.datasetId }, user);
};

export default {
  Query: {
    labelClass,
    labelClasses,
    labelClassesAggregates,
    labelClassExists,
  },

  Mutation: {
    createLabelClass,
    createManyLabelClasses,
    updateLabelClass,
    deleteLabelClass,
    reorderLabelClass,
  },

  LabelClass: {
    labels,
    dataset,
  },

  LabelClassesAggregates: { totalCount },

  Dataset: {
    labelClassesAggregates,
  },
};

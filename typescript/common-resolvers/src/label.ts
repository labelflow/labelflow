import { v4 as uuidv4 } from "uuid";

import type {
  Dataset,
  Label,
  LabelClass,
  MutationCreateLabelArgs,
  MutationDeleteLabelArgs,
  MutationUpdateLabelArgs,
  QueryLabelArgs,
  LabelWhereInput,
  MutationDeleteManyLabelsArgs,
} from "@labelflow/graphql-types";
import { LabelType } from "@labelflow/graphql-types";

import { DbLabel, Context, Repository } from "./types";

import { throwIfResolvesToNil } from "./utils/throw-if-resolves-to-nil";
import { getBoundedGeometryFromImage } from "./utils/get-bounded-geometry-from-image";
import { addTypename } from "./utils";

const LABEL_CLASS_ID_PROPERTY_NAMES: Record<
  "Dataset" | "LabelClass",
  keyof LabelWhereInput
> = {
  Dataset: "datasetId",
  LabelClass: "labelClassId",
};

const getLabelById = async (
  id: string,
  repository: Repository,
  user?: { id: string }
): Promise<DbLabel> => {
  return await throwIfResolvesToNil(
    "No label with such id",
    repository.label.get
  )({ id }, user);
};

// Queries
const labelClass = async (
  label: DbLabel,
  _args: any,
  { repository, user }: Context
) => {
  if (!label?.labelClassId) {
    return null;
  }

  return (
    (await repository.labelClass.get({ id: label.labelClassId }, user)) ?? null
  );
};

const label = async (
  _: any,
  args: QueryLabelArgs,
  { repository, user }: Context
) => {
  return await getLabelById(args?.where?.id, repository, user);
};

// Mutations
const createLabel = async (
  _: any,
  args: MutationCreateLabelArgs,
  { repository, user }: Context
): Promise<Label> => {
  const { id, imageId, labelClassId, geometry, type, smartToolInput } =
    args.data;

  // Since we don't have any constraint checks with Dexie
  // We need to ensure that the imageId and the labelClassId
  // matches some entity before being able to continue.
  const image = await throwIfResolvesToNil(
    `The image id ${imageId} doesn't exist.`,
    repository.image.get
  )({ id: imageId }, user);

  if (labelClassId != null) {
    await throwIfResolvesToNil(
      `The labelClass id ${labelClassId} doesn't exist.`,
      repository.labelClass.get
    )({ id: labelClassId }, user);
  }

  const labelId = id ?? uuidv4();
  const now = new Date();

  const {
    geometry: clippedGeometry,
    x,
    y,
    width,
    height,
  } = getBoundedGeometryFromImage(image, geometry);

  const newLabelEntity = {
    id: labelId,
    type: type ?? LabelType.Polygon,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    labelClassId,
    imageId,
    x,
    y,
    width,
    height,
    geometry: clippedGeometry,
    smartToolInput,
  };

  await repository.label.add(newLabelEntity, user);
  return await throwIfResolvesToNil(
    "Could not create the label entity",
    await repository.label.get
  )({ id: labelId }, user);
};

const deleteLabel = async (
  _: any,
  args: MutationDeleteLabelArgs,
  { repository, user }: Context
) => {
  const labelId = args.where.id;

  const labelToDelete = await throwIfResolvesToNil(
    "No label with such id",
    repository.label.get
  )({ id: labelId }, user);

  await repository.label.delete({ id: labelId }, user);

  return labelToDelete;
};

const deleteManyLabels = async (
  _: never,
  { where }: MutationDeleteManyLabelsArgs,
  { repository, user }: Context
) => {
  const labelsToDelete = await throwIfResolvesToNil(
    "No labels to delete",
    repository.label.list
  )({ ...where, user });
  await repository.label.deleteMany(where, user);
  return labelsToDelete;
};

const updateLabel = async (
  _: any,
  args: MutationUpdateLabelArgs,
  { repository, user }: Context
) => {
  const labelId = args.where.id;

  if ("labelClassId" in args.data && args.data.labelClassId != null) {
    await throwIfResolvesToNil(
      "No label class with such id",
      repository.labelClass.get
    )({ id: args.data.labelClassId }, user);
  }

  if (!args?.data?.geometry) {
    await repository.label.update({ id: labelId }, args.data, user);

    return await getLabelById(labelId, repository, user);
  }

  const { imageId } = await getLabelById(labelId, repository, user);
  const image = await throwIfResolvesToNil(
    `The image id ${imageId} doesn't exist.`,
    repository.image.get
  )({ id: imageId }, user);

  const {
    geometry: clippedGeometry,
    x,
    y,
    width,
    height,
  } = getBoundedGeometryFromImage(image, args.data.geometry);
  const now = new Date();

  const newLabelEntity = {
    ...args.data,
    updatedAt: now.toISOString(),
    geometry: clippedGeometry,
    x,
    y,
    height,
    width,
  };

  await repository.label.update({ id: labelId }, newLabelEntity, user);

  return await getLabelById(labelId, repository, user);
};

const labelsAggregates = () => ({});

const labelsAggregatesOfDataset = (parent: Dataset) => {
  if (!parent) {
    throw new Error("No parent Dataset");
  }
  return addTypename(parent, "Dataset");
};

const labelsAggregatesOfLabelClass = (parent: LabelClass) => {
  if (!parent) {
    throw new Error("No parent LabelClass");
  }
  return addTypename(parent, "LabelClass");
};

const totalCount = async (
  parent: LabelClass | Dataset | null,
  _args: any,
  { repository, user }: Context
) => {
  // eslint-disable-next-line no-underscore-dangle
  const typename = parent?.__typename;
  const idProp = typename ? LABEL_CLASS_ID_PROPERTY_NAMES[typename] : undefined;
  const idWhere: LabelWhereInput | undefined =
    idProp && parent ? { [idProp]: parent.id } : undefined;

  return await repository.label.count({ user, ...idWhere });
};

export default {
  Query: {
    label,
    labelsAggregates,
  },
  Mutation: {
    createLabel,
    deleteLabel,
    deleteManyLabels,
    updateLabel,
  },
  Label: {
    labelClass,
  },
  LabelClass: { labelsAggregates: labelsAggregatesOfLabelClass },
  LabelsAggregates: { totalCount },
  Dataset: { labelsAggregates: labelsAggregatesOfDataset },
};

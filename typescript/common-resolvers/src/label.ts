import { v4 as uuidv4 } from "uuid";

import type {
  Label,
  MutationCreateLabelArgs,
  MutationDeleteLabelArgs,
  MutationUpdateLabelArgs,
  QueryLabelArgs,
} from "@labelflow/graphql-types";
import { LabelType } from "@labelflow/graphql-types";

import { DbLabel, Context, Repository } from "./types";

import { throwIfResolvesToNil } from "./utils/throw-if-resolves-to-nil";
import { getBoundedGeometryFromImage } from "./utils/get-bounded-geometry-from-image";

const getLabelById = async (
  id: string,
  repository: Repository
): Promise<DbLabel> =>
  throwIfResolvesToNil("No label with such id", repository.label.getById)(id);

// Queries
const labelClass = async (
  label: DbLabel,
  _args: any,
  { repository }: Context
) => {
  if (!label?.labelClassId) {
    return null;
  }

  return repository.labelClass.getById(label.labelClassId) ?? null;
};

const label = async (_: any, args: QueryLabelArgs, { repository }: Context) => {
  return getLabelById(args?.where?.id, repository);
};

// Mutations
const createLabel = async (
  _: any,
  args: MutationCreateLabelArgs,
  { repository }: Context
): Promise<Label> => {
  const { id, imageId, labelClassId, geometry, type } = args.data;

  // Since we don't have any constraint checks with Dexie
  // We need to ensure that the imageId and the labelClassId
  // matches some entity before being able to continue.
  const image = await throwIfResolvesToNil(
    `The image id ${imageId} doesn't exist.`,
    repository.image.getById
  )(imageId);

  if (labelClassId != null) {
    await throwIfResolvesToNil(
      `The labelClass id ${labelClassId} doesn't exist.`,
      repository.labelClass.getById
    )(labelClassId);
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
  };

  await repository.label.add(newLabelEntity);
  return throwIfResolvesToNil(
    "Could not create the label entity",
    await repository.label.getById
  )(labelId);
};

const deleteLabel = async (
  _: any,
  args: MutationDeleteLabelArgs,
  { repository }: Context
) => {
  const labelId = args.where.id;

  const labelToDelete = await throwIfResolvesToNil(
    "No label with such id",
    repository.label.getById
  )(labelId);

  await repository.label.delete(labelId);

  return labelToDelete;
};

const updateLabel = async (
  _: any,
  args: MutationUpdateLabelArgs,
  { repository }: Context
) => {
  const labelId = args.where.id;

  if ("labelClassId" in args.data && args.data.labelClassId != null) {
    await throwIfResolvesToNil(
      "No label class with such id",
      repository.labelClass.getById
    )(args.data.labelClassId);
  }

  if (!args?.data?.geometry) {
    await repository.label.update(labelId, args.data);

    return getLabelById(labelId, repository);
  }

  const { imageId } = await getLabelById(labelId, repository);
  const image = await throwIfResolvesToNil(
    `The image id ${imageId} doesn't exist.`,
    repository.image.getById
  )(imageId);

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

  await repository.label.update(labelId, newLabelEntity);

  return getLabelById(labelId, repository);
};

const labelsAggregates = (parent: any) => {
  // Forward `parent` to chained resolvers if it exists
  return parent ?? {};
};

const totalCount = async (parent: any, _args: any, { repository }: Context) => {
  // eslint-disable-next-line no-underscore-dangle
  const typename = parent?.__typename;

  if (typename === "Dataset") {
    return repository.label.count({ datasetId: parent.id });
  }

  return repository.label.count();
};

export default {
  Query: {
    label,
    labelsAggregates,
  },
  Mutation: {
    createLabel,
    deleteLabel,
    updateLabel,
  },
  Label: {
    labelClass,
  },
  LabelsAggregates: { totalCount },
  Dataset: { labelsAggregates },
};

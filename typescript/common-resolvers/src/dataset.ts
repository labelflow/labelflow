import { trim } from "lodash/fp";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";
import type {
  MutationCreateDatasetArgs,
  MutationDeleteDatasetArgs,
  MutationUpdateDatasetArgs,
  DatasetWhereUniqueInput,
  QueryDatasetArgs,
  QueryDatasetsArgs,
  QueryImagesArgs,
} from "@labelflow/graphql-types";

import { Context, DbDataset, Repository } from "./types";
import { throwIfResolvesToNil } from "./utils/throw-if-resolves-to-nil";
import { getImageEntityFromMutationArgs } from "./image";

// The demo dataset images
const demoImageUrls = [
  "https://images.unsplash.com/photo-1579513141590-c597876aefbc?auto=format&fit=crop&w=882&q=80",
  "https://images.unsplash.com/photo-1504710685809-7bb702595f8f?auto=format&fit=crop&w=934&q=80",
  "https://images.unsplash.com/photo-1569579933032-9e16447c50e3?auto=format&fit=crop&w=2100&q=80",
  "https://images.unsplash.com/photo-1595687453172-253f44ed3975?auto=format&fit=crop&w=2100&q=80",
  "https://images.unsplash.com/photo-1574082595167-86d59cefcc3a?auto=format&fit=crop&w=2100&q=80",
];

const getDatasetById = async (
  id: string,
  repository: Repository
): Promise<DbDataset> => {
  const dataset = await throwIfResolvesToNil(
    "No dataset with such id",
    repository.dataset.getById
  )(id);

  return { ...dataset, __typename: "Dataset" };
};

const getDatasetByName = async (
  name: string,
  repository: Repository
): Promise<DbDataset> => {
  const dataset = await throwIfResolvesToNil(
    `No dataset with name "${name}"`,
    repository.dataset.getByName
  )(name);

  return { ...dataset, __typename: "Dataset" };
};

const getDatasetBySlug = async (
  slug: string,
  repository: Repository
): Promise<DbDataset> => {
  const dataset = await throwIfResolvesToNil(
    `No dataset with slug "${slug}"`,
    repository.dataset.getBySlug
  )(slug);

  return { ...dataset, __typename: "Dataset" };
};

const getDatasetFromWhereUniqueInput = async (
  where: DatasetWhereUniqueInput,
  repository: Repository
): Promise<DbDataset> => {
  const { id, name, slug } = where;

  if (id != null) return getDatasetById(id, repository);

  if (name != null) return getDatasetByName(name, repository);

  if (slug != null) return getDatasetBySlug(slug, repository);

  throw new Error("Invalid where unique input for dataset entity");
};

const getLabelClassesByDatasetId = (
  datasetId: string,
  repository: Repository
) => {
  return repository.labelClass.list({ datasetId });
};

// Queries
const images = (
  dataset: DbDataset,
  args: QueryImagesArgs,
  { repository }: Context
) => {
  return repository.image.list(
    { datasetId: dataset.id },
    args?.skip,
    args?.first
  );
};

const labels = async (
  dataset: DbDataset,
  _args: any,
  { repository }: Context
) => {
  return repository.label.list({ datasetId: dataset.id });
};

const labelClasses = async (
  dataset: DbDataset,
  _args: any,
  { repository }: Context
) => {
  return getLabelClassesByDatasetId(dataset.id, repository);
};

const dataset = async (
  _: any,
  args: QueryDatasetArgs,
  { repository }: Context
): Promise<DbDataset> => {
  return getDatasetFromWhereUniqueInput(args.where, repository);
};

const datasets = async (
  _: any,
  args: QueryDatasetsArgs,
  { repository }: Context
): Promise<DbDataset[]> => {
  const queryResult = await repository.dataset.list(
    null,
    args.skip,
    args.first
  );

  return queryResult.map((datasetWithoutTypename) => ({
    ...datasetWithoutTypename,
    __typename: "Dataset",
  }));
};

// Mutations
const createDataset = async (
  _: any,
  args: MutationCreateDatasetArgs,
  { repository }: Context
): Promise<DbDataset> => {
  const date = new Date().toISOString();

  const datasetId = args?.data?.id ?? uuidv4();
  const name = trim(args?.data?.name);

  if (name === "") {
    throw new Error("Could not create the dataset with an empty name");
  }

  try {
    await repository.dataset.add({
      id: datasetId,
      createdAt: date,
      updatedAt: date,
      name,
      slug: slugify(name, { lower: true }),
    });

    return await getDatasetById(datasetId, repository);
  } catch (e) {
    throw new Error("Could not create the dataset");
  }
};

const createDemoDataset = async (
  _: any,
  args: {},
  { repository }: Context
): Promise<DbDataset> => {
  const datasetId = uuidv4();
  const currentDate = new Date().toISOString();
  try {
    await repository.dataset.add({
      name: "Demo dataset",
      slug: "demo-dataset",
      id: datasetId,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
  } catch (error) {
    if (error.name === "ConstraintError") {
      // The demo dataset already exists, just return it
      return getDatasetByName("Demo dataset", repository);
    }
    throw error;
  }
  await Promise.all(
    demoImageUrls.map(async (url) => {
      const imageEntity = await getImageEntityFromMutationArgs(
        {
          datasetId,
          url,
        },
        {
          upload: repository.upload,
        }
      );
      return repository.image.add(imageEntity);
    })
  );

  return getDatasetById(datasetId, repository);
};

const updateDataset = async (
  _: any,
  args: MutationUpdateDatasetArgs,
  { repository }: Context
): Promise<DbDataset> => {
  const datasetToUpdate = await throwIfResolvesToNil(
    "No dataset with such id",
    repository.dataset.getById
  )(args.where.id);

  const newData =
    "name" in args.data
      ? { ...args.data, slug: slugify(args.data.name) }
      : args.data;

  try {
    const updateResult = await repository.dataset.update(
      datasetToUpdate.id,
      newData
    );
    if (!updateResult) {
      throw new Error("Could not update the dataset");
    }
  } catch (e) {
    throw new Error("Could not update the dataset");
  }

  return getDatasetById(datasetToUpdate.id, repository);
};

const deleteDataset = async (
  _: any,
  args: MutationDeleteDatasetArgs,
  { repository }: Context
): Promise<DbDataset> => {
  const datasetToDelete = await throwIfResolvesToNil(
    "No dataset with such id",
    repository.dataset.getById
  )(args.where.id);
  await repository.dataset.delete(datasetToDelete.id);
  return datasetToDelete;
};

export default {
  Query: {
    dataset,
    datasets,
  },

  Mutation: {
    createDataset,
    createDemoDataset,
    updateDataset,
    deleteDataset,
  },

  Dataset: {
    images,
    labels,
    labelClasses,
  },
};

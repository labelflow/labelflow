import { trim } from "lodash/fp";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";
import { add } from "date-fns";
import {
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
import {
  tutorialImageUrls,
  tutorialLabelClassId,
  tutorialLabels,
} from "./data/dataset-tutorial";

const getDatasetById = async (
  id: string,
  repository: Repository
): Promise<DbDataset> => {
  const dataset = await throwIfResolvesToNil(
    `No dataset with id "${id}"`,
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

  if (id != null) {
    return await getDatasetById(id, repository);
  }

  if (name != null) {
    return await getDatasetByName(name, repository);
  }

  if (slug != null) {
    return await getDatasetBySlug(slug, repository);
  }

  throw new Error(
    `Invalid where unique input for dataset entity: ${JSON.stringify(where)}`
  );
};

const getLabelClassesByDatasetId = async (
  datasetId: string,
  repository: Repository
) => {
  return await repository.labelClass.list({ datasetId });
};

// Queries
const images = async (
  dataset: DbDataset,
  args: QueryImagesArgs,
  { repository }: Context
) => {
  return await repository.image.list(
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
  return await repository.label.list({ datasetId: dataset.id });
};

const labelClasses = async (
  dataset: DbDataset,
  _args: any,
  { repository }: Context
) => {
  return await getLabelClassesByDatasetId(dataset.id, repository);
};

const dataset = async (
  _: any,
  args: QueryDatasetArgs,
  { repository }: Context
): Promise<DbDataset> => {
  return await getDatasetFromWhereUniqueInput(args.where, repository);
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

  const dbDataset: DbDataset = {
    id: datasetId,
    createdAt: date,
    updatedAt: date,
    name,
    slug: slugify(name, { lower: true }),
  };
  try {
    await repository.dataset.add(dbDataset);

    return await getDatasetById(datasetId, repository);
  } catch (e) {
    console.error(e);
    throw new Error(
      `Could not create the dataset ${JSON.stringify(dbDataset)}`
    );
  }
};

const createDemoDataset = async (
  _: any,
  args: {},
  { repository }: Context
): Promise<DbDataset> => {
  const datasetId = uuidv4();
  const now = new Date();
  const currentDate = now.toISOString();
  try {
    await repository.dataset.add({
      name: "Tutorial dataset",
      slug: "tutorial-dataset",
      id: datasetId,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
  } catch (error) {
    if (error.name === "ConstraintError") {
      // The tutorial dataset already exists, just return it
      return await getDatasetByName("Tutorial dataset", repository);
    }
    throw error;
  }
  const tutorialDatasetImages = await Promise.all(
    tutorialImageUrls.map(async (url, index) => {
      const imageEntity = await getImageEntityFromMutationArgs(
        {
          datasetId,
          url,
          createdAt: add(now, { seconds: index }).toISOString(),
          name: url.match(/\/static\/img\/(.*?)$/)[1],
        },
        {
          upload: repository.upload,
        }
      );
      return await repository.image.add(imageEntity);
    })
  );

  await repository.labelClass.add({
    id: tutorialLabelClassId,
    name: "Horse",
    color: "#F87171",
    createdAt: currentDate,
    updatedAt: currentDate,
    datasetId,
  });

  await Promise.all(
    tutorialLabels.map(async (label) => {
      return await repository.label.add({
        ...label,
        id: uuidv4(),
        createdAt: currentDate,
        updatedAt: currentDate,
        imageId: tutorialDatasetImages[2],
      });
    })
  );

  return await getDatasetById(datasetId, repository);
};

const updateDataset = async (
  _: any,
  args: MutationUpdateDatasetArgs,
  { repository }: Context
): Promise<DbDataset> => {
  const datasetToUpdate = await throwIfResolvesToNil(
    `No dataset with id "${args.where.id}" to update`,
    repository.dataset.getById
  )(args.where.id);

  const newData =
    "name" in args.data
      ? { ...args.data, slug: slugify(args.data.name, { lower: true }) }
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

  return await getDatasetById(datasetToUpdate.id, repository);
};

const deleteDataset = async (
  _: any,
  args: MutationDeleteDatasetArgs,
  { repository }: Context
): Promise<DbDataset> => {
  const datasetToDelete = await throwIfResolvesToNil(
    `No dataset with id "${args.where.id}"`,
    repository.dataset.getById
  )(args.where.id);
  const imagesOfDataset = await repository.image.list({
    datasetId: args.where.id,
  });
  await Promise.all(
    imagesOfDataset.map(
      async (image) => await repository.upload.delete(image.url)
    )
  );
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

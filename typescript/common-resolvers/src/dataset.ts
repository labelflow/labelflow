import {
  DatasetWhereUniqueInput,
  MutationCreateDatasetArgs,
  MutationDeleteDatasetArgs,
  MutationUpdateDatasetArgs,
  QueryDatasetArgs,
  QueryDatasetExistsArgs,
  QueryDatasetsArgs,
  QueryImagesArgs,
} from "@labelflow/graphql-types";
import { ErrorOverride } from "@labelflow/utils";
import { isNil, trim } from "lodash/fp";
import { v4 as uuidv4 } from "uuid";
import { Context, DbDataset, Repository } from "./types";
import { addTypename, addTypenames, getSlug } from "./utils";

const overrideDatasetExistError: ErrorOverride = (error: any) => {
  // Try to see if the query failed because another workspace with the same name or slug already exists
  if (
    !isNil(error) &&
    typeof error === "object" &&
    "code" in error &&
    "meta" in error &&
    // P2002: "Unique constraint failed on the {constraint}"
    error.code === "P2002" &&
    !isNil(error.meta)
  ) {
    const { target = [] } = error.meta as { target?: string[] };
    if (target.includes("name") || target.includes("slug")) {
      throw new Error("A dataset with the same name already exists");
    }
  }
};

const getLabelClassesByDatasetId = async (
  datasetId: string,
  repository: Repository,
  user?: { id: string }
) => {
  return await repository.labelClass.list({ datasetId, user });
};

const getDataset = async (
  where: DatasetWhereUniqueInput,
  repository: Repository,
  user?: { id: string }
): Promise<DbDataset & { __typename: "Dataset" }> => {
  const datasetFromRepository = await repository.dataset.get(where, user);
  if (datasetFromRepository == null) {
    throw new Error(
      `Couldn't find dataset corresponding to ${JSON.stringify(where)}`
    );
  }
  return addTypename(datasetFromRepository, "Dataset");
};

const datasetExists = async (
  _: any,
  args: QueryDatasetExistsArgs,
  { repository, user }: Context
): Promise<boolean> => {
  try {
    const data = await repository.dataset.get(args.where, user);
    return !isNil(data);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("User not authorized to access dataset")
    ) {
      return false;
    }
    throw error;
  }
};

// Queries
const images = async (
  dataset: DbDataset,
  args: QueryImagesArgs,
  { repository, user }: Context
) => {
  const data = await repository.image.list(
    { datasetId: dataset.id, user },
    args?.skip,
    args?.first
  );
  return addTypenames(data, "Image");
};

const labels = async (
  dataset: DbDataset,
  _args: any,
  { repository, user }: Context
) => {
  return await repository.label.list({ datasetId: dataset.id, user });
};

const labelClasses = async (
  dataset: DbDataset,
  _args: any,
  { repository, user }: Context
) => {
  return await getLabelClassesByDatasetId(dataset.id, repository, user);
};

const workspace = async (
  dataset: DbDataset,
  _args: any,
  { repository, user }: Context
) => {
  return await repository.workspace.get({ slug: dataset.workspaceSlug }, user);
};

const dataset = async (
  _: any,
  args: QueryDatasetArgs,
  { repository, user }: Context
): Promise<DbDataset & { __typename: string }> =>
  await getDataset(args.where, repository, user);

const datasets = async (
  _: any,
  args: QueryDatasetsArgs,
  { repository, user }: Context
): Promise<DbDataset[]> => {
  const queryResult = await repository.dataset.list(
    { user, ...args.where },
    args.skip,
    args.first
  );

  return addTypenames(queryResult, "Dataset");
};

// Mutations
const createDataset = async (
  _: any,
  args: MutationCreateDatasetArgs,
  { repository, user }: Context
): Promise<DbDataset & { __typename: string }> => {
  const date = new Date().toISOString();

  const datasetId = args?.data?.id ?? uuidv4();
  const name = trim(args?.data?.name);

  if (name === "") {
    throw new Error("Could not create the dataset with an empty name");
  }

  const dbDataset = {
    id: datasetId,
    createdAt: date,
    updatedAt: date,
    name,
    workspaceSlug: args.data.workspaceSlug,
  };
  try {
    await repository.dataset.add(dbDataset, user);

    return await getDataset({ id: datasetId }, repository, user);
  } catch (error: any) {
    overrideDatasetExistError(error);
    console.error(error);
    throw new Error(
      `Could not create the dataset ${JSON.stringify(
        dbDataset
      )} due to error "${error?.message ?? error}"`
    );
  }
};

const updateDataset = async (
  _: any,
  args: MutationUpdateDatasetArgs,
  { repository, user }: Context
): Promise<DbDataset> => {
  const datasetToUpdate = await getDataset(args.where, repository, user);

  const newData =
    "name" in args.data
      ? { ...args.data, slug: getSlug(args.data.name) }
      : args.data;

  try {
    const updateResult = await repository.dataset.update(
      { id: datasetToUpdate.id },
      newData,
      user
    );
    if (!updateResult) {
      throw new Error("Could not update the dataset");
    }
  } catch (e) {
    throw new Error("Could not update the dataset");
  }

  return await getDataset({ id: datasetToUpdate.id }, repository, user);
};

const deleteDataset = async (
  _: any,
  args: MutationDeleteDatasetArgs,
  { repository, user }: Context
): Promise<DbDataset> => {
  const datasetToDelete = await getDataset(args.where, repository, user);

  const imagesOfDataset = await repository.image.list({
    datasetId: args.where.id,
    user,
  });
  await Promise.all(
    imagesOfDataset.map(
      async (image) => await repository.upload.delete(image.url)
    )
  );
  await repository.dataset.delete({ id: datasetToDelete.id }, user);
  return datasetToDelete;
};

export default {
  Query: {
    dataset,
    datasets,
    datasetExists,
  },

  Mutation: {
    createDataset,
    updateDataset,
    deleteDataset,
  },

  Dataset: {
    images,
    labels,
    labelClasses,
    workspace,
  },
};

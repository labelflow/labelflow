import {
  throwIfResolvesToNil,
  Repository,
  DbDataset,
  getSlug,
} from "@labelflow/common-resolvers";
import { getDatabase } from "../database";
import { addIdIfNil } from "./utils/add-id-if-nil";
import { list } from "./utils/list";

export const getDataset: Repository["dataset"]["get"] = async (where) => {
  if (
    (where.id == null && where.slugs == null) ||
    (where.id != null && where.slugs != null)
  ) {
    throw new Error(
      "You should either specify the id or the slugs when looking for a dataset"
    );
  }
  if (where.id != null) {
    return await (await getDatabase()).dataset.get(where.id);
  }
  return await (await getDatabase()).dataset.get({ slug: where.slugs?.slug });
};

export const deleteDataset: Repository["dataset"]["delete"] = async (where) => {
  const datasetToDelete = await throwIfResolvesToNil(
    `Cannot find dataset with ${JSON.stringify(where)}`,
    getDataset
  )(where);

  const imagesToDelete = await (
    await getDatabase()
  ).image
    .where({
      datasetId: datasetToDelete.id,
    })
    .primaryKeys();

  const labelsToDeleteIds = await (await getDatabase()).label
    .filter((label) => imagesToDelete.includes(label.imageId))
    .primaryKeys();

  await (await getDatabase()).label.bulkDelete(labelsToDeleteIds);
  await (await getDatabase()).labelClass
    .where({ datasetId: datasetToDelete.id })
    .delete();
  await (await getDatabase()).image
    .where({ datasetId: datasetToDelete.id })
    .delete();
  await (await getDatabase()).dataset.delete(datasetToDelete.id);
};

export const updateDataset: Repository["dataset"]["update"] = async (
  where,
  changes
) => {
  const datasetToUpdate = await throwIfResolvesToNil(
    `Cannot find dataset with ${JSON.stringify(where)}`,
    getDataset
  )(where);

  return (
    (await (
      await getDatabase()
    ).dataset.update(datasetToUpdate.id, changes)) === 1
  );
};

export const addDataset: Repository["dataset"]["add"] = async (dataset) => {
  const db = await getDatabase();
  const createdAt = new Date().toISOString();
  return await db.dataset.add(
    addIdIfNil({
      ...dataset,
      slug: getSlug(dataset.name),
      createdAt,
      updatedAt: createdAt,
    })
  );
};

export const listDataset: Repository["dataset"]["list"] = (_, skip, first) =>
  list<DbDataset>(async () => (await getDatabase()).dataset)(null, skip, first);

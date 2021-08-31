import {
  throwIfResolvesToNil,
  Repository,
  DbDataset,
} from "@labelflow/common-resolvers";

import { getDatabase } from "../database";

export const deleteDataset: Repository["dataset"]["delete"] = async (id) => {
  const datasetToDelete = await throwIfResolvesToNil<
    [string],
    DbDataset | undefined
  >(`Cannot find dataset with id "${id}" to delete`, async (idToGet) => {
    return await (await getDatabase()).dataset.get(idToGet);
  })(id);

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

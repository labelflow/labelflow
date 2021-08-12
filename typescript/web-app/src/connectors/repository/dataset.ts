import {
  throwIfResolvesToNil,
  Repository,
  DbDataset,
} from "@labelflow/common-resolvers";

import { db } from "../database";

export const deleteDataset: Repository["dataset"]["delete"] = async (id) => {
  const datasetToDelete = await throwIfResolvesToNil<
    [string],
    DbDataset | undefined
  >("Cannot find dataset to delete", (idToGet) => db.dataset.get(idToGet))(id);

  const imagesToDelete = await db.image
    .where({
      datasetId: datasetToDelete.id,
    })
    .primaryKeys();

  const labelsToDeleteIds = await db.label
    .filter((label) => imagesToDelete.includes(label.imageId))
    .primaryKeys();

  await db.label.bulkDelete(labelsToDeleteIds);
  await db.labelClass.where({ datasetId: datasetToDelete.id }).delete();
  await db.image.where({ datasetId: datasetToDelete.id }).delete();
  await db.dataset.delete(datasetToDelete.id);
};

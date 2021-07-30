import {
  throwIfResolvesToNil,
  Repository,
  DbProject,
} from "@labelflow/common-resolvers";

import { db } from "../database";

export const deleteProject: Repository["project"]["delete"] = async (id) => {
  const projectToDelete = await throwIfResolvesToNil<
    [string],
    DbProject | undefined
  >("Cannot find project to delete", (idToGet) => db.project.get(idToGet))(id);

  const imagesToDelete = await db.image
    .where({
      projectId: projectToDelete.id,
    })
    .primaryKeys();

  const labelsToDeleteIds = await db.label
    .filter((label) => imagesToDelete.includes(label.imageId))
    .primaryKeys();

  await db.label.bulkDelete(labelsToDeleteIds);
  await db.labelClass.where({ projectId: projectToDelete.id }).delete();
  await db.image.where({ projectId: projectToDelete.id }).delete();
  await db.project.delete(projectToDelete.id);
};

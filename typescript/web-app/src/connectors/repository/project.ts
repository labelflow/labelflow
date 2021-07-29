import { db, DbProject } from "../database";

import { Repository } from "./types";
import { throwIfResolvesToNil } from "../resolvers/utils/throw-if-resolves-to-nil";

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

  // @ts-ignore
  await db.label.bulkDelete(labelsToDeleteIds);
  await db.labelClass.where({ projectId: projectToDelete.id }).delete();
  await db.image.where({ projectId: projectToDelete.id }).delete();
  await db.project.delete(projectToDelete.id);
};

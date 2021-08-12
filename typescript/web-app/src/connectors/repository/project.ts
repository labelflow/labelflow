import {
  throwIfResolvesToNil,
  Repository,
  DbProject,
} from "@labelflow/common-resolvers";

import { getDatabase } from "../database";

export const deleteProject: Repository["project"]["delete"] = async (id) => {
  const projectToDelete = await throwIfResolvesToNil<
    [string],
    DbProject | undefined
  >(`Cannot find project with id "${id}" to delete`, (idToGet) =>
    getDatabase().project.get(idToGet)
  )(id);

  const imagesToDelete = await getDatabase()
    .image.where({
      projectId: projectToDelete.id,
    })
    .primaryKeys();

  const labelsToDeleteIds = await getDatabase()
    .label.filter((label) => imagesToDelete.includes(label.imageId))
    .primaryKeys();

  await getDatabase().label.bulkDelete(labelsToDeleteIds);
  await getDatabase()
    .labelClass.where({ projectId: projectToDelete.id })
    .delete();
  await getDatabase().image.where({ projectId: projectToDelete.id }).delete();
  await getDatabase().project.delete(projectToDelete.id);
};

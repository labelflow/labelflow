import { db, DbProject } from "../database";

import { Repository } from "./types";
import { throwIfResolvesToNil } from "../resolvers/utils/throw-if-resolves-to-nil";

export const deleteProject: Repository["project"]["delete"] = async (id) => {
  const projectToDelete = await throwIfResolvesToNil<
    [string],
    DbProject | undefined
  >(
    "Cannot find project to delete",
    db.project.get
  )(id);

  const labelsToDeleteIds = await db.label
    .where({ projectId: projectToDelete.id })
    .primaryKeys();

  await db.label.bulkDelete(labelsToDeleteIds);
  await db.labelClass.where({ projectId: projectToDelete.id }).delete();
  await db.image.where({ projectId: projectToDelete.id }).delete();
  await db.project.delete(projectToDelete.id);
};

import { db } from "../database";
import { list } from "./utils/list";
import { countLabels, listLabels } from "./label";
import { deleteProject } from "./project";

import { Repository } from "./types";
import { deleteLabelClass } from "./label-class";

export const repository: Repository = {
  image: {
    add: (image) => db.image.add(image),
    count: (where) =>
      where ? db.image.where(where).count() : db.image.count(),
    getById: (id) => db.image.get(id),
    list: list(db.image),
  },
  label: {
    add: (label) => db.label.add(label),
    count: countLabels,
    delete: (id) => db.label.delete(id),
    getById: (id) => db.label.get(id),
    list: listLabels,
    update: async (id, changes) => (await db.label.update(id, changes)) === 1,
  },
  labelClass: {
    add: (labelClass) => db.labelClass.add(labelClass),
    count: (where?) =>
      where ? db.labelClass.where(where).count() : db.labelClass.count(),
    delete: deleteLabelClass,
    getById: (id) => db.labelClass.get(id),
    list: list(db.labelClass),
    update: async (id, changes) =>
      (await db.labelClass.update(id, changes)) === 1,
  },
  project: {
    add: (project) => db.project.add(project),
    delete: deleteProject,
    getById: (id) => db.project.get(id),
    getByName: (name) => db.project.get({ name }),
    list: list(db.project),
    update: async (id, changes) => (await db.project.update(id, changes)) === 1,
  },
};

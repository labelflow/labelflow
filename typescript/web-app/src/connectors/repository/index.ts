import { Repository } from "@labelflow/common-resolvers";
import { getDatabase } from "../database";
import { list } from "./utils/list";
import { countLabels, listLabels } from "./label";
import { deleteProject } from "./project";
import { deleteLabelClass } from "./label-class";
import {
  getUploadTarget,
  getUploadTargetHttp,
  getFromStorage,
  putInStorage,
} from "./upload";

export const repository: Repository = {
  image: {
    add: (image) => getDatabase().image.add(image),
    count: (where) =>
      where
        ? getDatabase().image.where(where).count()
        : getDatabase().image.count(),
    getById: (id) => getDatabase().image.get(id),
    list: list(getDatabase().image),
  },
  label: {
    add: (label) => getDatabase().label.add(label),
    count: countLabels,
    delete: (id) => getDatabase().label.delete(id),
    getById: (id) => getDatabase().label.get(id),
    list: listLabels,
    update: async (id, changes) =>
      (await getDatabase().label.update(id, changes)) === 1,
  },
  labelClass: {
    add: (labelClass) => getDatabase().labelClass.add(labelClass),
    count: (where?) =>
      where
        ? getDatabase().labelClass.where(where).count()
        : getDatabase().labelClass.count(),
    delete: deleteLabelClass,
    getById: (id) => getDatabase().labelClass.get(id),
    list: list(getDatabase().labelClass),
    update: async (id, changes) =>
      (await getDatabase().labelClass.update(id, changes)) === 1,
  },
  project: {
    add: (project) => getDatabase().project.add(project),
    delete: deleteProject,
    getById: (id) => getDatabase().project.get(id),
    getByName: (name) => getDatabase().project.get({ name }),
    list: list(getDatabase().project),
    update: async (id, changes) =>
      (await getDatabase().project.update(id, changes)) === 1,
  },
  upload: {
    getUploadTarget,
    getUploadTargetHttp,
    put: putInStorage,
    get: getFromStorage,
  },
};

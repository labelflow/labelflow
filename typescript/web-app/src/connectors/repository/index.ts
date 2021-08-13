import { Repository } from "@labelflow/common-resolvers";
import { getDatabase } from "../database";
import { list } from "./utils/list";
import { countLabels, listLabels } from "./label";
import { deleteDataset } from "./dataset";
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
  dataset: {
    add: (dataset) => getDatabase().dataset.add(dataset),
    delete: deleteDataset,
    getById: (id) => getDatabase().dataset.get(id),
    getByName: (name) => getDatabase().dataset.get({ name }),
    getBySlug: (slug) => db.dataset.get({ slug }),
    list: list(getDatabase().dataset),
    update: async (id, changes) =>
      (await getDatabase().dataset.update(id, changes)) === 1,
  },
  upload: {
    getUploadTarget,
    getUploadTargetHttp,
    put: putInStorage,
    get: getFromStorage,
  },
};

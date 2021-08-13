import { Repository } from "@labelflow/common-resolvers";
import { db } from "../database";
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
  dataset: {
    add: (dataset) => db.dataset.add(dataset),
    delete: deleteDataset,
    getById: (id) => db.dataset.get(id),
    getByName: (name) => db.dataset.get({ name }),
    list: list(db.dataset),
    update: async (id, changes) => (await db.dataset.update(id, changes)) === 1,
  },
  upload: {
    getUploadTarget,
    getUploadTargetHttp,
    put: putInStorage,
    get: getFromStorage,
  },
};

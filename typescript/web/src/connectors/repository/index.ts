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
  deleteFromStorage,
} from "./upload";

export const repository: Repository = {
  image: {
    add: async (image) => {
      return await getDatabase().image.add(image);
    },
    count: async (where) => {
      return where
        ? await getDatabase().image.where(where).count()
        : await getDatabase().image.count();
    },
    getById: async (id) => {
      return await getDatabase().image.get(id);
    },
    list: list(getDatabase().image),
  },
  label: {
    add: async (label) => {
      return await getDatabase().label.add(label);
    },
    count: countLabels,
    delete: async (id) => {
      return await getDatabase().label.delete(id);
    },
    getById: async (id) => {
      return await getDatabase().label.get(id);
    },
    list: listLabels,
    update: async (id, changes) => {
      return (await getDatabase().label.update(id, changes)) === 1;
    },
  },
  labelClass: {
    add: async (labelClass) => {
      return await getDatabase().labelClass.add(labelClass);
    },
    count: async (where?) => {
      return where
        ? await getDatabase().labelClass.where(where).count()
        : await getDatabase().labelClass.count();
    },
    delete: deleteLabelClass,
    getById: async (id) => {
      return await getDatabase().labelClass.get(id);
    },
    list: list(getDatabase().labelClass),
    update: async (id, changes) => {
      return (await getDatabase().labelClass.update(id, changes)) === 1;
    },
  },
  dataset: {
    add: async (dataset) => {
      return await getDatabase().dataset.add(dataset);
    },
    delete: deleteDataset,
    getById: async (id) => {
      return await getDatabase().dataset.get(id);
    },
    getByName: async (name) => {
      return await getDatabase().dataset.get({ name });
    },
    getBySlug: async (slug) => {
      return await getDatabase().dataset.get({ slug });
    },
    list: list(getDatabase().dataset),
    update: async (id, changes) => {
      return (await getDatabase().dataset.update(id, changes)) === 1;
    },
  },
  upload: {
    getUploadTarget,
    getUploadTargetHttp,
    put: putInStorage,
    get: getFromStorage,
    delete: deleteFromStorage,
  },
};

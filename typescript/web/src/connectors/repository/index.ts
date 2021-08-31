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
      return await (await getDatabase()).image.add(image);
    },
    count: async (where) => {
      return where
        ? await (await getDatabase()).image.where(where).count()
        : await (await getDatabase()).image.count();
    },
    getById: async (id) => {
      return await (await getDatabase()).image.get(id);
    },
    list: list(async () => (await getDatabase()).image),
  },
  label: {
    add: async (label) => {
      return await (await getDatabase()).label.add(label);
    },
    count: countLabels,
    delete: async (id) => {
      return await (await getDatabase()).label.delete(id);
    },
    getById: async (id) => {
      return await (await getDatabase()).label.get(id);
    },
    list: listLabels,
    update: async (id, changes) => {
      return (await (await getDatabase()).label.update(id, changes)) === 1;
    },
  },
  labelClass: {
    add: async (labelClass) => {
      return await (await getDatabase()).labelClass.add(labelClass);
    },
    count: async (where?) => {
      return where
        ? await (await getDatabase()).labelClass.where(where).count()
        : await (await getDatabase()).labelClass.count();
    },
    delete: deleteLabelClass,
    getById: async (id) => {
      return await (await getDatabase()).labelClass.get(id);
    },
    list: list(async () => (await getDatabase()).labelClass, "index"),
    update: async (id, changes) => {
      return (await (await getDatabase()).labelClass.update(id, changes)) === 1;
    },
  },
  dataset: {
    add: async (dataset) => {
      return await (await getDatabase()).dataset.add(dataset);
    },
    delete: deleteDataset,
    getById: async (id) => {
      return await (await getDatabase()).dataset.get(id);
    },
    getByName: async (name) => {
      return await (await getDatabase()).dataset.get({ name });
    },
    getBySlug: async (slug) => {
      return await (await getDatabase()).dataset.get({ slug });
    },
    list: list(async () => (await getDatabase()).dataset),
    update: async (id, changes) => {
      return (await (await getDatabase()).dataset.update(id, changes)) === 1;
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

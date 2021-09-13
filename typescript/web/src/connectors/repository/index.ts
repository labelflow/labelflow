import { DbImageCreateInput, Repository } from "@labelflow/common-resolvers";
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
import { addIdIfNil } from "./utils/add-id-if-nil";

export const repository: Repository = {
  image: {
    add: async (image: DbImageCreateInput) => {
      return await (await getDatabase()).image.add(addIdIfNil(image));
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
      return await (await getDatabase()).label.add(addIdIfNil(label));
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
      return await (await getDatabase()).labelClass.add(addIdIfNil(labelClass));
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
      return await (await getDatabase()).dataset.add(addIdIfNil(dataset));
    },
    delete: deleteDataset,
    getById: async (id) => {
      return await (await getDatabase()).dataset.get(id);
    },
    getByWorkspaceSlugAndDatasetSlug: async ({ datasetSlug }) => {
      return await (await getDatabase()).dataset.get({ slug: datasetSlug });
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

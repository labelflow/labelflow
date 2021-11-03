import {
  DbImage,
  DbImageCreateInput,
  DbLabelClass,
  Repository,
} from "@labelflow/common-resolvers";
import {
  ImageWhereInput,
  LabelClassWhereInput,
} from "@labelflow/graphql-types";
import { getDatabase } from "../database";
import { list } from "./utils/list";
import { countLabels, listLabels } from "./label";
import {
  addDataset,
  deleteDataset,
  getDataset,
  listDataset,
  updateDataset,
} from "./dataset";
import { deleteLabelClass } from "./label-class";
import {
  getUploadTarget,
  getUploadTargetHttp,
  getFromStorage,
  putInStorage,
  deleteFromStorage,
} from "./upload";
import { addIdIfNil } from "./utils/add-id-if-nil";
import {
  addWorkspace,
  getWorkspace,
  listWorkspaces,
  updateWorkspace,
} from "./workspace";
import { probeImage } from "./probe-image";
import { removeUserFromWhere } from "./utils/remove-user-from-where";

export const repository: Repository = {
  image: {
    add: async (image: DbImageCreateInput) => {
      return await (await getDatabase()).image.add(addIdIfNil(image));
    },
    count: async (whereWithUser) => {
      const where = removeUserFromWhere(whereWithUser);
      return where
        ? await (await getDatabase()).image.where(where).count()
        : await (await getDatabase()).image.count();
    },
    get: async ({ id }) => {
      return await (await getDatabase()).image.get(id);
    },
    list: (whereWithUser, skip, first) => {
      return list<DbImage, ImageWhereInput>(
        async () => (await getDatabase()).image
      )(removeUserFromWhere(whereWithUser), skip, first);
    },
    delete: async ({ id }) => {
      return await (await getDatabase()).image.delete(id);
    },
  },
  label: {
    add: async (label) => {
      return await (await getDatabase()).label.add(addIdIfNil(label));
    },
    count: countLabels,
    delete: async ({ id }) => {
      return await (await getDatabase()).label.delete(id);
    },
    get: async ({ id }) => {
      return await (await getDatabase()).label.get(id);
    },
    list: listLabels,
    update: async ({ id }, changes) => {
      return (await (await getDatabase()).label.update(id, changes)) === 1;
    },
  },
  labelClass: {
    add: async (labelClass) => {
      return await (await getDatabase()).labelClass.add(addIdIfNil(labelClass));
    },
    count: async (whereWithUser) => {
      const where = removeUserFromWhere(whereWithUser);
      return where
        ? await (await getDatabase()).labelClass.where(where).count()
        : await (await getDatabase()).labelClass.count();
    },
    delete: deleteLabelClass,
    get: async ({ id }) => {
      return await (await getDatabase()).labelClass.get(id);
    },
    list: (whereWithUser, skip, first) => {
      return list<DbLabelClass, LabelClassWhereInput>(
        async () => (await getDatabase()).labelClass,
        "index"
      )(removeUserFromWhere(whereWithUser), skip, first);
    },
    update: async ({ id }, changes) => {
      return (await (await getDatabase()).labelClass.update(id, changes)) === 1;
    },
  },
  dataset: {
    add: addDataset,
    delete: deleteDataset,
    get: getDataset,
    list: listDataset,
    update: updateDataset,
  },
  workspace: {
    add: addWorkspace,
    get: getWorkspace,
    list: listWorkspaces,
    update: updateWorkspace,
  },
  upload: {
    getUploadTarget,
    getUploadTargetHttp,
    put: putInStorage,
    get: getFromStorage,
    delete: deleteFromStorage,
  },
  imageProcessing: {
    probeImage,
  },
};

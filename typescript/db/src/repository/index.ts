import { PrismaClient } from "@prisma/client";

import { DbLabel, Repository } from "@labelflow/common-resolvers";
import {
  getUploadTargetHttp,
  getFromStorage,
  putInStorage,
  deleteFromStorage,
} from "./upload";
import { countLabels, listLabels } from "./label";

const prisma = new PrismaClient();

export const repository: Repository = {
  image: {
    add: async (image) => {
      const createdImage = await prisma.image.create({ data: image });
      return createdImage.id;
    },
    count: (where) => prisma.image.count({ where }),
    getById: (id) =>
      prisma.image.findUnique({
        where: { id },
      }),

    list: (where, skip = undefined, first = undefined) =>
      prisma.image.findMany({
        where,
        orderBy: { createdAt: "asc" },
        skip,
        take: first,
      }),
  },
  label: {
    add: async (label) => {
      const createdLabel = await prisma.label.create({ data: label });
      return createdLabel.id;
    },
    count: countLabels,
    delete: async (id) => {
      await prisma.label.delete({ where: { id } });
    },
    /* Needs to be casted as Prisma doesn't let us specify
     * the type for geometry */
    getById: (id) =>
      prisma.label.findUnique({
        where: { id },
      }) as unknown as Promise<DbLabel>,
    update: async (id, label) => {
      try {
        await prisma.label.update({ where: { id }, data: label });
        return true;
      } catch (e) {
        return false;
      }
    },
    list: listLabels,
  },
  labelClass: {
    add: async (labelClass) => {
      const createdLabelClass = await prisma.labelClass.create({
        data: labelClass,
      });
      return createdLabelClass.id;
    },
    count: (where) => prisma.labelClass.count({ where }),
    delete: async (id) => {
      await prisma.labelClass.delete({ where: { id } });
    },
    getById: (id) =>
      prisma.labelClass.findUnique({
        where: { id },
      }),
    list: (where, skip = undefined, first = undefined) =>
      prisma.labelClass.findMany({
        where,
        orderBy: { index: "asc" },
        skip,
        take: first,
      }),
    update: async (id, labelClass) => {
      try {
        await prisma.labelClass.update({ where: { id }, data: labelClass });
        return true;
      } catch (e) {
        return false;
      }
    },
  },
  dataset: {
    add: async (dataset) => {
      const createdDataset = await prisma.dataset.create({ data: dataset });
      return createdDataset.id;
    },
    delete: async (id) => {
      await prisma.dataset.delete({ where: { id } });
    },
    getById: (id) => {
      return prisma.dataset.findUnique({ where: { id } });
    },
    getByName: (name) => {
      return prisma.dataset.findUnique({ where: { name } });
    },
    getBySlug: (slug) => {
      return prisma.dataset.findUnique({ where: { slug } });
    },
    update: async (id, dataset) => {
      try {
        await prisma.dataset.update({ where: { id }, data: dataset });
        return true;
      } catch (e) {
        return false;
      }
    },
    list: (_where, skip = undefined, first = undefined) =>
      prisma.dataset.findMany({
        orderBy: { createdAt: "asc" },
        skip,
        take: first,
      }),
  },
  upload: {
    delete: deleteFromStorage,
    get: getFromStorage,
    getUploadTarget: getUploadTargetHttp,
    getUploadTargetHttp,
    put: putInStorage,
  },
};

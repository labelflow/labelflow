import { PrismaClient } from "@prisma/client";

import { DbLabel, Repository } from "@labelflow/common-resolvers";
import { getUploadTargetHttp, getFromStorage, putInStorage } from "./upload";
import { countLabels } from "./label";

const prisma = new PrismaClient();

export const repository: Repository = {
  image: {
    add: async (image) => {
      const createdImage = await prisma.image.create({ data: image });
      return createdImage.id;
    },
    count: async (where) => prisma.image.count({ where }),
    getById: (id) =>
      prisma.image.findUnique({
        where: { id },
      }),

    list: (where, skip = undefined, first = undefined) => {
      return prisma.image.findMany({
        where,
        orderBy: { createdAt: "asc" },
        skip,
        take: first,
      });
    },
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
    /* Needs to be casted as Prisma doesn't let us specify
     * the type for geometry */
    list: (where, skip = undefined, first = undefined) =>
      prisma.label.findMany({
        where,
        orderBy: { createdAt: "asc" },
        skip,
        take: first,
      }) as unknown as Promise<DbLabel[]>,
  },
  labelClass: {
    add: async (labelClass) => {
      const createdLabelClass = await prisma.labelClass.create({
        data: labelClass,
      });
      return createdLabelClass.id;
    },
    count: async (where) => prisma.labelClass.count({ where }),
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
        orderBy: { createdAt: "asc" },
        skip,
        take: first,
      }),
  },
  project: {
    add: async (project) => {
      const createdProject = await prisma.project.create({ data: project });
      return createdProject.id;
    },
    delete: async (id) => {
      await prisma.project.delete({ where: { id } });
    },
    getById: (id) => {
      return prisma.project.findUnique({ where: { id } });
    },
    getByName: (name) => {
      return prisma.project.findUnique({ where: { name } });
    },
    update: async (id, project) => {
      try {
        await prisma.project.update({ where: { id }, data: project });
        return true;
      } catch (e) {
        return false;
      }
    },
    list: (_where, skip = undefined, first = undefined) =>
      prisma.project.findMany({
        orderBy: { createdAt: "asc" },
        skip,
        take: first,
      }),
  },
  upload: {
    get: getFromStorage,
    getUploadTarget: getUploadTargetHttp,
    getUploadTargetHttp,
    put: putInStorage,
  },
};

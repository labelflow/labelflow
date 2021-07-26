import { PrismaClient } from "@prisma/client";

import { Repository } from "../../../web-app/src/connectors/repository/types";

const prisma = new PrismaClient();

// @ts-ignore
export const repository: Repository = {
  //   image: {
  //     add: (image) => prisma.image.create({ data:  }),
  //   },
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
};

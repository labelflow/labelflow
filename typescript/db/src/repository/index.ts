import { PrismaClient, Prisma } from "@prisma/client";

import { DbLabel, Repository } from "@labelflow/common-resolvers";
import { Image } from "@labelflow/graphql-types";
import slugify from "slugify";
import {
  getUploadTargetHttp,
  getFromStorage,
  putInStorage,
  deleteFromStorage,
} from "./upload-supabase";
import { countLabels, listLabels } from "./label";
import { castObjectNullsToUndefined } from "./utils";
import { getWorkspace } from "../resolvers/workspace";

export const prisma = new PrismaClient();

export const repository: Repository = {
  image: {
    add: async (image) => {
      const createdImage = await prisma.image.create({
        data: castObjectNullsToUndefined(image),
      });
      return createdImage.id;
    },
    count: (where) =>
      prisma.image.count({
        where: castObjectNullsToUndefined(where),
      }),
    get: async (where) =>
      (await prisma.image.findUnique({
        where,
      })) as unknown as Image,

    list: (where, skip = undefined, first = undefined) =>
      prisma.image.findMany(
        castObjectNullsToUndefined({
          where: castObjectNullsToUndefined(where),
          orderBy: { createdAt: Prisma.SortOrder.asc },
          skip,
          take: first,
        })
      ),
  },
  label: {
    add: async (label) => {
      const createdLabel = await prisma.label.create({ data: label });
      return createdLabel.id;
    },
    count: countLabels,
    delete: async ({ id }) => {
      await prisma.label.delete({ where: { id } });
    },
    /* Needs to be casted as Prisma doesn't let us specify
     * the type for geometry */
    get: (where) =>
      prisma.label.findUnique({
        where,
      }) as unknown as Promise<DbLabel>,
    update: async (where, label) => {
      try {
        if (label) {
          await prisma.label.update({
            where,
            data: castObjectNullsToUndefined(label),
          });
        }
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
        data: castObjectNullsToUndefined(labelClass),
      });
      return createdLabelClass.id;
    },
    count: async (where) =>
      await prisma.labelClass.count({
        where: castObjectNullsToUndefined(where),
      }),
    delete: async ({ id }) => {
      await prisma.labelClass.delete({ where: { id } });
    },
    get: (where) =>
      prisma.labelClass.findUnique({
        where,
      }),
    list: (where, skip = undefined, first = undefined) =>
      prisma.labelClass.findMany(
        castObjectNullsToUndefined({
          where: castObjectNullsToUndefined(where),
          orderBy: { index: Prisma.SortOrder.asc },
          skip,
          take: first,
        })
      ),
    update: async ({ id }, labelClass) => {
      try {
        await prisma.labelClass.update({
          where: { id },
          data: castObjectNullsToUndefined(labelClass),
        });
        return true;
      } catch (e) {
        return false;
      }
    },
  },
  dataset: {
    add: async ({ workspaceSlug, ...dataset }) => {
      const slug = slugify(dataset.name, { lower: true });
      const createdDataset = await prisma.dataset.create({
        data: castObjectNullsToUndefined({
          ...dataset,
          slug,
          workspace: {
            connect: { slug: workspaceSlug },
          },
        }),
      });
      return createdDataset.id;
    },
    delete: async (where) => {
      if (
        (where.id == null && where.slugs == null) ||
        (where.id != null && where.slugs != null)
      ) {
        throw new Error(
          "You should either specify the id or the slugs when deleting a dataset"
        );
      }

      await prisma.dataset.delete({
        where: castObjectNullsToUndefined(where),
      });
    },
    get: async (where, user) => {
      if (
        (where.id == null && where.slugs == null) ||
        (where.id != null && where.slugs != null)
      ) {
        throw new Error(
          "You should either specify the id or the slugs when looking for a dataset"
        );
      }

      const dataset = await prisma.dataset.findUnique({
        where: castObjectNullsToUndefined(where),
      });
      const result = await getWorkspace({ slug: dataset?.workspaceSlug }, user);
      return dataset;
    },
    update: async (where, dataset) => {
      if (
        (where.id == null && where.slugs == null) ||
        (where.id != null && where.slugs != null)
      ) {
        throw new Error(
          "You should either specify the id or the slugs when updating a dataset"
        );
      }
      try {
        await prisma.dataset.update({
          where: castObjectNullsToUndefined(where),
          data: castObjectNullsToUndefined(dataset),
        });
        return true;
      } catch (e) {
        return false;
      }
    },
    list: (where, skip = undefined, first = undefined) =>
      prisma.dataset.findMany(
        castObjectNullsToUndefined({
          orderBy: { createdAt: Prisma.SortOrder.asc },
          skip,
          where: {
            workspace: { memberships: { some: { userId: where?.user?.id } } },
          },
        })
      ),
  },
  upload: {
    delete: deleteFromStorage,
    get: getFromStorage,
    getUploadTarget: getUploadTargetHttp,
    getUploadTargetHttp,
    put: putInStorage,
  },
};

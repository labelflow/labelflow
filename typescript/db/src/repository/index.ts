import { Prisma } from "@prisma/client";
import { DbLabel, Repository } from "@labelflow/common-resolvers";
import { Image } from "@labelflow/graphql-types";
import slugify from "slugify";
import { prisma } from "./prisma-client";
import {
  getUploadTargetHttp,
  getFromStorage,
  putInStorage,
  deleteFromStorage,
} from "./upload-supabase";
import {
  addWorkspace,
  getWorkspace,
  listWorkspace,
  updateWorkspace,
} from "./workspace";
import { listLabels, countLabels } from "./label";
import { castObjectNullsToUndefined } from "./utils";
import {
  checkUserAccessToDataset,
  checkUserAccessToImage,
  checkUserAccessToLabel,
  checkUserAccessToLabelClass,
  checkUserAccessToWorkspace,
} from "./access-control";

export const repository: Repository = {
  image: {
    add: async (image, user) => {
      await checkUserAccessToDataset({ where: { id: image.datasetId }, user });
      const createdImage = await prisma.image.create({
        data: castObjectNullsToUndefined(image),
      });
      return createdImage.id;
    },
    count: async (whereWithUser) => {
      const { user, ...where } = whereWithUser ?? { user: undefined };
      return await prisma.image.count({
        where: castObjectNullsToUndefined({
          ...where,
          dataset: {
            workspace: { memberships: { some: { userId: user?.id } } },
          },
        }),
      });
    },
    get: async (where, user) => {
      await checkUserAccessToImage({ where, user });
      return (await prisma.image.findUnique({
        where,
      })) as unknown as Image;
    },
    list: async (whereWithUser, skip = undefined, first = undefined) => {
      const { user, ...where } = whereWithUser ?? { user: undefined };
      return await prisma.image.findMany(
        castObjectNullsToUndefined({
          where: castObjectNullsToUndefined({
            ...where,
            dataset: {
              workspace: { memberships: { some: { userId: user?.id } } },
            },
          }),
          orderBy: { createdAt: Prisma.SortOrder.asc },
          skip,
          take: first,
        })
      );
    },
    delete: async (where, user) => {
      await checkUserAccessToImage({ where, user });
      await prisma.image.delete({ where });
    },
  },
  label: {
    add: async (label, user) => {
      await checkUserAccessToImage({ where: { id: label.imageId }, user });
      const createdLabel = await prisma.label.create({ data: label });
      return createdLabel.id;
    },
    count: countLabels,
    delete: async ({ id }, user) => {
      await checkUserAccessToLabel({ where: { id }, user });
      await prisma.label.delete({ where: { id } });
    },
    /* Needs to be casted as Prisma doesn't let us specify
     * the type for geometry */
    get: async (where, user) => {
      await checkUserAccessToLabel({ where, user });
      return (await prisma.label.findUnique({
        where,
      })) as unknown as DbLabel;
    },
    update: async (where, label, user) => {
      await checkUserAccessToLabel({ where, user });
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
    add: async (labelClass, user) => {
      await checkUserAccessToDataset({
        where: { id: labelClass.datasetId },
        user,
      });
      const createdLabelClass = await prisma.labelClass.create({
        data: castObjectNullsToUndefined(labelClass),
      });
      return createdLabelClass.id;
    },
    count: async (whereWithUser) => {
      const { user, ...where } = whereWithUser ?? { user: undefined };
      return await prisma.labelClass.count({
        where: castObjectNullsToUndefined({
          ...where,
          dataset: {
            workspace: { memberships: { some: { userId: user?.id } } },
          },
        }),
      });
    },
    delete: async ({ id }, user) => {
      await checkUserAccessToLabelClass({ where: { id }, user });
      await prisma.labelClass.delete({ where: { id } });
    },
    get: async (where, user) => {
      await checkUserAccessToLabelClass({ where, user });
      return await prisma.labelClass.findUnique({
        where,
      });
    },
    list: async (whereWithUser, skip = undefined, first = undefined) => {
      const { user, ...where } = whereWithUser ?? { user: undefined };
      return await prisma.labelClass.findMany(
        castObjectNullsToUndefined({
          where: castObjectNullsToUndefined({
            ...where,
            dataset: {
              workspace: { memberships: { some: { userId: user?.id } } },
            },
          }),
          orderBy: { index: Prisma.SortOrder.asc },
          skip,
          take: first,
        })
      );
    },
    update: async ({ id }, labelClass, user) => {
      try {
        await checkUserAccessToLabelClass({ where: { id }, user });
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
    add: async ({ workspaceSlug, ...dataset }, user) => {
      await checkUserAccessToWorkspace({
        where: { slug: workspaceSlug },
        user,
      });
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
    delete: async (where, user) => {
      if (
        (where.id == null && where.slugs == null) ||
        (where.id != null && where.slugs != null)
      ) {
        throw new Error(
          "You should either specify the id or the slugs when deleting a dataset"
        );
      }
      await checkUserAccessToDataset({ where, user });
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
      await checkUserAccessToDataset({ where, user });
      const dataset = await prisma.dataset.findUnique({
        where: castObjectNullsToUndefined(where),
      });
      return dataset;
    },
    update: async (where, dataset, user) => {
      if (
        (where.id == null && where.slugs == null) ||
        (where.id != null && where.slugs != null)
      ) {
        throw new Error(
          "You should either specify the id or the slugs when updating a dataset"
        );
      }
      await checkUserAccessToDataset({ where, user });
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
          take: first,
          where: {
            workspace: {
              slug: where?.workspaceSlug,
              memberships: { some: { userId: where?.user?.id } },
            },
          },
        })
      ),
  },
  workspace: {
    add: addWorkspace,
    get: getWorkspace,
    list: listWorkspace,
    update: updateWorkspace,
  },
  upload: {
    delete: deleteFromStorage,
    get: getFromStorage,
    getUploadTarget: getUploadTargetHttp,
    getUploadTargetHttp,
    put: putInStorage,
  },
};

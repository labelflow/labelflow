import { DbLabel, getSlug, Repository } from "@labelflow/common-resolvers";
import { Image } from "@labelflow/graphql-types";
import { Prisma } from "@prisma/client";
import { getPrismaClient } from "../prisma-client";
import {
  checkUserAccessToDataset,
  checkUserAccessToImage,
  checkUserAccessToLabel,
  checkUserAccessToLabelClass,
  checkUserAccessToWorkspace,
} from "./access-control";
import { processImage } from "./image-processing";
import { countLabels, listLabels } from "./label";
import {
  deleteFromStorage,
  getFromStorage,
  getUploadTargetHttp,
  putInStorage,
} from "./upload-s3";
import { castObjectNullsToUndefined } from "./utils";
import {
  addWorkspace,
  deleteWorkspace,
  getWorkspace,
  listWorkspace,
  updateWorkspace,
} from "./workspace";

const getWorkspaceFilter = (
  userId: string | undefined,
  extraFilter?: Prisma.WorkspaceWhereInput
): { workspace: Prisma.WorkspaceWhereInput } => ({
  workspace: {
    memberships: { some: { userId } },
    deletedAt: { equals: null },
    ...extraFilter,
  },
});

export const repository: Repository = {
  image: {
    add: async (image, user) => {
      await checkUserAccessToDataset({ where: { id: image.datasetId }, user });
      const createdImage = await (
        await getPrismaClient()
      ).image.create({
        data: castObjectNullsToUndefined(image),
      });
      return createdImage.id;
    },
    addMany: async ({ images, datasetId }, user) => {
      await checkUserAccessToDataset({ where: { id: datasetId }, user });
      const prisma = await getPrismaClient();
      await prisma.image.createMany({ data: images });
      return images.map((image) => image.id);
    },
    count: async (whereWithUser) => {
      const { user, ...where } = whereWithUser ?? { user: undefined };
      if (user?.id == null) {
        return 0;
      }
      return await (
        await getPrismaClient()
      ).image.count({
        where: castObjectNullsToUndefined({
          ...where,
          dataset: getWorkspaceFilter(user?.id),
        }),
      });
    },
    get: async (where, user) => {
      await checkUserAccessToImage({ where, user });
      return (await (
        await getPrismaClient()
      ).image.findUnique({
        where,
      })) as unknown as Image;
    },
    update: async (where, image, user) => {
      await checkUserAccessToImage({ where, user });
      try {
        if (image) {
          await (
            await getPrismaClient()
          ).image.update({
            where,
            data: castObjectNullsToUndefined(image),
          });
        }
        return true;
      } catch (e) {
        return false;
      }
    },
    list: async (whereWithUser, skip = undefined, first = undefined) => {
      const { user, ...where } = whereWithUser ?? { user: undefined };
      if (user?.id == null) {
        return [];
      }
      return await (
        await getPrismaClient()
      ).image.findMany(
        castObjectNullsToUndefined({
          where: castObjectNullsToUndefined({
            ...where,
            dataset: getWorkspaceFilter(user?.id),
          }),
          orderBy: { createdAt: Prisma.SortOrder.asc },
          skip,
          take: first,
        })
      );
    },
    delete: async (where, user) => {
      await checkUserAccessToImage({ where, user });
      await (await getPrismaClient()).image.delete({ where });
    },
  },
  label: {
    add: async (label, user) => {
      await checkUserAccessToImage({ where: { id: label.imageId }, user });
      const createdLabel = await (
        await getPrismaClient()
      ).label.create({ data: label });
      return createdLabel.id;
    },
    addMany: async ({ labels, imageId }, user) => {
      await checkUserAccessToImage({ where: { id: imageId }, user });
      const prisma = await getPrismaClient();
      await prisma.label.createMany({ data: labels });
      return labels.map((label) => label.id);
    },
    count: countLabels,
    delete: async ({ id }, user) => {
      await checkUserAccessToLabel({ where: { id }, user });
      await (await getPrismaClient()).label.delete({ where: { id } });
    },
    /* Needs to be casted as Prisma doesn't let us specify
     * the type for geometry */
    get: async (where, user) => {
      await checkUserAccessToLabel({ where, user });
      return (await (
        await getPrismaClient()
      ).label.findUnique({
        where,
      })) as unknown as DbLabel;
    },
    update: async (where, label, user) => {
      await checkUserAccessToLabel({ where, user });
      try {
        if (label) {
          await (
            await getPrismaClient()
          ).label.update({
            where,
            data: {
              ...castObjectNullsToUndefined(label),
              labelClassId: label.labelClassId,
            },
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
      const createdLabelClass = await (
        await getPrismaClient()
      ).labelClass.create({
        data: castObjectNullsToUndefined(labelClass),
      });
      return createdLabelClass.id;
    },
    count: async (whereWithUser) => {
      const { user, ...where } = whereWithUser ?? { user: undefined };
      if (user?.id == null) {
        return 0;
      }
      return await (
        await getPrismaClient()
      ).labelClass.count({
        where: castObjectNullsToUndefined({
          ...where,
          dataset: getWorkspaceFilter(user?.id),
        }),
      });
    },
    delete: async ({ id }, user) => {
      await checkUserAccessToLabelClass({ where: { id }, user });
      await (await getPrismaClient()).labelClass.delete({ where: { id } });
    },
    get: async (where, user) => {
      await checkUserAccessToLabelClass({ where, user });
      return await (
        await getPrismaClient()
      ).labelClass.findUnique({
        where,
      });
    },
    list: async (whereWithUser, skip = undefined, first = undefined) => {
      const { user, ...where } = whereWithUser ?? { user: undefined };
      if (user?.id == null) {
        return [];
      }
      return await (
        await getPrismaClient()
      ).labelClass.findMany(
        castObjectNullsToUndefined({
          where: castObjectNullsToUndefined({
            ...where,
            dataset: getWorkspaceFilter(user?.id),
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
        await (
          await getPrismaClient()
        ).labelClass.update({
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
      const db = await getPrismaClient();
      const createdDataset = await db.dataset.create({
        data: castObjectNullsToUndefined({
          ...dataset,
          slug: getSlug(dataset.name),
          workspace: { connect: { slug: workspaceSlug } },
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
      await (
        await getPrismaClient()
      ).dataset.delete({
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
      const dataset = await (
        await getPrismaClient()
      ).dataset.findUnique({
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
        const db = await getPrismaClient();
        await db.dataset.update({
          where: castObjectNullsToUndefined(where),
          data: {
            ...castObjectNullsToUndefined(dataset),
            updatedAt: new Date().toISOString(),
          },
        });
        return true;
      } catch (e) {
        return false;
      }
    },
    list: async (where, skip = undefined, first = undefined) => {
      if (where?.user?.id == null) {
        return [];
      }
      return await (
        await getPrismaClient()
      ).dataset.findMany(
        castObjectNullsToUndefined({
          orderBy: { createdAt: Prisma.SortOrder.asc },
          skip,
          take: first,
          where: getWorkspaceFilter(where?.user?.id, {
            slug: where?.workspaceSlug,
          }),
        })
      );
    },
  },
  workspace: {
    add: addWorkspace,
    get: getWorkspace,
    list: listWorkspace,
    update: updateWorkspace,
    delete: deleteWorkspace,
  },
  upload: {
    delete: deleteFromStorage,
    get: getFromStorage,
    getUploadTarget: getUploadTargetHttp,
    getUploadTargetHttp,
    put: putInStorage,
  },
  imageProcessing: {
    processImage,
  },
};

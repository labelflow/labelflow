import { DbLabel, getSlug, Repository } from "@labelflow/common-resolvers";
import { Prisma } from "@prisma/client";
import { uniq } from "lodash/fp";
import { getPrismaClient } from "../prisma-client";
import {
  checkUserAccessToDataset,
  checkUserAccessToImage,
  checkUserAccessToLabel,
  checkUserAccessToLabelClass,
  checkUserAccessToWorkspace,
} from "./access-control";
import { imageRepository } from "./image";
import { processImage } from "./image-processing";
import { countLabels, deleteManyLabels, listLabels } from "./label";
import {
  deleteFromStorage,
  getFromStorage,
  getSignedDownloadUrl,
  getUploadTargetHttp,
  putInStorage,
} from "./upload-s3";
import { castObjectNullsToUndefined, getWorkspaceFilter } from "./utils";
import {
  addWorkspace,
  deleteWorkspace,
  getWorkspace,
  listWorkspace,
  updateWorkspace,
  countImages as countWorkspaceImages,
} from "./workspace";

export const repository: Repository = {
  image: imageRepository,
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
      const labelsToCreate = labels.map((label) => ({
        ...label,
        imageId,
      }));
      const prisma = await getPrismaClient();
      await prisma.label.createMany({ data: labelsToCreate });
      return labels.map((label) => label.id);
    },
    count: countLabels,
    delete: async ({ id }, user) => {
      await checkUserAccessToLabel({ where: { id }, user });
      await (await getPrismaClient()).label.delete({ where: { id } });
    },
    deleteMany: deleteManyLabels,
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
      const db = await getPrismaClient();
      const createdLabelClass = await db.labelClass.create({
        data: castObjectNullsToUndefined(labelClass),
      });
      return createdLabelClass.id;
    },
    addMany: async ({ labelClasses }, user) => {
      const datasetIds = uniq(
        labelClasses.map((labelClass) => labelClass.datasetId)
      );
      await Promise.all(
        datasetIds.map((datasetId) =>
          checkUserAccessToDataset({ where: { id: datasetId }, user })
        )
      );
      const db = await getPrismaClient();
      await db.labelClass.createMany({ data: labelClasses });
      return labelClasses.map((labelClass) => labelClass.id);
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
          orderBy: { createdAt: Prisma.SortOrder.desc },
          skip,
          take: first,
          where: getWorkspaceFilter(where?.user?.id, {
            extraWorkspaceFilter: { slug: where?.workspaceSlug ?? undefined },
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
    countImages: countWorkspaceImages,
  },
  upload: {
    delete: deleteFromStorage,
    get: getFromStorage,
    getSignedDownloadUrl,
    getUploadTarget: getUploadTargetHttp,
    getUploadTargetHttp,
    put: putInStorage,
  },
  imageProcessing: {
    processImage,
  },
};

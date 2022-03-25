import { Repository } from "@labelflow/common-resolvers";
import { ImageWhereInput } from "@labelflow/graphql-types";
import { Prisma } from "@prisma/client";
import { isEmpty, isNil } from "lodash/fp";
import { getPrismaClient } from "../prisma-client";
import {
  checkUserAccessToDataset,
  checkUserAccessToImage,
} from "./access-control";
import { AuthorizationError } from "./authorization-error";
import {
  castObjectNullsToUndefined,
  getDatasetFilter,
  sanitizeWhereIn,
} from "./utils";

type WhereWithUser =
  | (ImageWhereInput & { user?: { id: string } })
  | undefined
  | null;

const sanitizeWhereInput = (
  whereWithUser: WhereWithUser
): Prisma.ImageWhereInput | undefined => {
  if (isNil(whereWithUser)) return undefined;
  const { user, id, datasetId, ...where } = whereWithUser;
  if (isNil(user) || isEmpty(user?.id)) return undefined;
  return castObjectNullsToUndefined({
    ...where,
    ...sanitizeWhereIn("id", id),
    ...getDatasetFilter(user.id, datasetId),
  });
};

const add: Repository["image"]["add"] = async (image, user) => {
  await checkUserAccessToDataset({ where: { id: image.datasetId }, user });
  const db = await getPrismaClient();
  const createdImage = await db.image.create({
    data: castObjectNullsToUndefined(image),
  });
  return createdImage.id;
};

const addMany: Repository["image"]["addMany"] = async (
  { images, datasetId },
  user
) => {
  await checkUserAccessToDataset({ where: { id: datasetId }, user });
  const db = await getPrismaClient();
  await db.image.createMany({ data: images });
  return images.map((image) => image.id);
};

const count: Repository["image"]["count"] = async (whereWithUser) => {
  const where = sanitizeWhereInput(whereWithUser);
  if (isNil(where)) return 0;
  const db = await getPrismaClient();
  return await db.image.count({ where });
};

const get: Repository["image"]["get"] = async (where, user) => {
  await checkUserAccessToImage({ where, user });
  const db = await getPrismaClient();
  return await db.image.findUnique({ where });
};

const update: Repository["image"]["update"] = async (where, image, user) => {
  await checkUserAccessToImage({ where, user });
  try {
    if (image) {
      const db = await getPrismaClient();
      await db.image.update({
        where,
        data: castObjectNullsToUndefined(image),
      });
    }
    return true;
  } catch (e) {
    return false;
  }
};

const list: Repository["image"]["list"] = async (
  whereWithUser,
  skip,
  first
) => {
  const where = sanitizeWhereInput(whereWithUser);
  if (isNil(where)) return [];
  const db = await getPrismaClient();
  return await db.image.findMany(
    castObjectNullsToUndefined({
      where,
      orderBy: { createdAt: Prisma.SortOrder.asc },
      skip,
      take: first,
    })
  );
};

const deleteImage: Repository["image"]["delete"] = async (where, user) => {
  await checkUserAccessToImage({ where, user });
  const db = await getPrismaClient();
  await db.image.delete({ where });
};

const deleteMany: Repository["image"]["deleteMany"] = async (
  whereInput,
  user
) => {
  const where = sanitizeWhereInput({ ...whereInput, user });
  if (isNil(where)) {
    throw new AuthorizationError("deleteManyLabels");
  }
  const db = await getPrismaClient();
  const { count: deletedCount } = await db.image.deleteMany({ where });
  return deletedCount;
};

export const imageRepository: Repository["image"] = {
  add,
  addMany,
  count,
  get,
  update,
  list,
  delete: deleteImage,
  deleteMany,
};

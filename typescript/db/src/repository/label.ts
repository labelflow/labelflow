import { PrismaClient, Prisma } from "@prisma/client";
import { Repository, DbLabel } from "@labelflow/common-resolvers";

import { castObjectNullsToUndefined } from "./utils";
import { checkUserAccessToDataset } from "./access-control";

const prisma = new PrismaClient();

export const countLabels: Repository["label"]["count"] = async (
  whereWithUser
) => {
  if (!whereWithUser) {
    return 0;
  }
  const { user, ...where } = whereWithUser;
  if ("datasetId" in where) {
    checkUserAccessToDataset({ where: { id: where.datasetId }, user });
    return await prisma.label.count({
      where: { image: { datasetId: where.datasetId ?? undefined } },
    });
  }
  return await prisma.label.count({
    where: castObjectNullsToUndefined({
      ...where,
      image: {
        dataset: {
          workspace: { memberships: { some: { userId: user?.id } } },
        },
      },
    }),
  });
};

export const listLabels: Repository["label"]["list"] = async (
  whereWithUser,
  skip = undefined,
  first = undefined
) => {
  if (!whereWithUser) {
    return [];
  }
  const { user = undefined, ...where } = whereWithUser;
  if ("datasetId" in where) {
    await checkUserAccessToDataset({ where: { id: where.datasetId }, user });
    return prisma.label.findMany({
      where: {
        image: { datasetId: where.datasetId ?? undefined },
      },
      orderBy: { createdAt: Prisma.SortOrder.asc },
      skip: skip ?? undefined,
      take: first ?? undefined,
    }) as unknown as DbLabel[];
  }
  return prisma.label.findMany(
    castObjectNullsToUndefined({
      where: castObjectNullsToUndefined({
        ...where,
        image: {
          dataset: {
            workspace: { memberships: { some: { userId: user?.id } } },
          },
        },
      }),
      orderBy: { createdAt: Prisma.SortOrder.asc },
      skip,
      take: first,
    })
  ) as unknown as DbLabel[];
};

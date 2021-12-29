import { DbLabel, Repository } from "@labelflow/common-resolvers";
import { getPrismaClient } from "../prisma-client";
import { Prisma } from "../__generated__";
import { checkUserAccessToDataset } from "./access-control";
import { castObjectNullsToUndefined } from "./utils";

export const countLabels: Repository["label"]["count"] = async (
  whereWithUser
) => {
  if (!whereWithUser) {
    return 0;
  }
  const { user, ...where } = whereWithUser;
  if (user?.id == null) {
    return 0;
  }
  if ("datasetId" in where) {
    checkUserAccessToDataset({ where: { id: where.datasetId }, user });
    return await (
      await getPrismaClient()
    ).label.count({
      where: { image: { datasetId: where.datasetId ?? undefined } },
    });
  }
  return await (
    await getPrismaClient()
  ).label.count({
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
  if (user?.id == null) {
    return [];
  }
  if ("datasetId" in where) {
    await checkUserAccessToDataset({ where: { id: where.datasetId }, user });
    return (await getPrismaClient()).label.findMany({
      where: {
        image: { datasetId: where.datasetId ?? undefined },
      },
      orderBy: { createdAt: Prisma.SortOrder.asc },
      skip: skip ?? undefined,
      take: first ?? undefined,
    }) as unknown as DbLabel[];
  }
  return (await getPrismaClient()).label.findMany(
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

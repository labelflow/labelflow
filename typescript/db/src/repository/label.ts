import { PrismaClient, Prisma } from "@prisma/client";
import { Repository, DbLabel } from "@labelflow/common-resolvers";

import { castObjectNullsToUndefined } from "./utils";

const prisma = new PrismaClient();

export const countLabels: Repository["label"]["count"] = async (where) => {
  if (!where) {
    return 0;
  }
  if ("datasetId" in where) {
    return prisma.label.count({
      where: { image: { datasetId: where.datasetId ?? undefined } },
    });
  }
  return prisma.label.count({ where: castObjectNullsToUndefined(where) });
};

export const listLabels: Repository["label"]["list"] = async (
  where,
  skip = undefined,
  first = undefined
) => {
  if (!where) {
    return [];
  }
  if ("datasetId" in where) {
    return prisma.label.findMany(
      castObjectNullsToUndefined({
        where: { image: { datasetId: where.datasetId } },
        orderBy: { createdAt: "asc" },
        skip,
        take: first,
      }) as unknown as Promise<DbLabel[]>
    );
  }

  return prisma.label.findMany(
    castObjectNullsToUndefined({
      where: castObjectNullsToUndefined(where),
      orderBy: { createdAt: Prisma.SortOrder.asc },
      skip,
      take: first,
    })
  ) as unknown as Promise<DbLabel[]>;
};

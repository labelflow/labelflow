import { PrismaClient } from "@prisma/client";
import { Repository, DbLabel } from "@labelflow/common-resolvers";

import { castObjectNullsToUndefined } from "./utils";

const prisma = new PrismaClient();

export const countLabels: Repository["label"]["count"] = async (where) => {
  if (!where) {
    return 0;
  }
  if ("projectId" in where) {
    return prisma.label.count({
      where: { image: { projectId: where.projectId ?? undefined } },
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
  if ("projectId" in where) {
    return prisma.label.findMany(
      castObjectNullsToUndefined({
        where: { image: { projectId: where.projectId ?? undefined } },
        orderBy: { createdAt: "asc" },
        skip,
        take: first,
      }) as { [key: string]: never }
    ) as unknown as Promise<DbLabel[]>;
  }

  return prisma.label.findMany(
    castObjectNullsToUndefined({
      where: castObjectNullsToUndefined(where),
      orderBy: { createdAt: "asc" },
      skip,
      take: first,
    }) as { [key: string]: never }
  ) as unknown as Promise<DbLabel[]>;
};

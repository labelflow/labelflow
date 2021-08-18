import { PrismaClient } from "@prisma/client";
import { Repository, DbLabel } from "@labelflow/common-resolvers";

const prisma = new PrismaClient();

export const countLabels: Repository["label"]["count"] = (where) => {
  if ("datasetId" in where) {
    return prisma.label.count({
      where: { image: { datasetId: where.datasetId } },
    });
  }
  return prisma.label.count({ where });
};

export const listLabels: Repository["label"]["list"] = (
  where,
  skip = undefined,
  first = undefined
) => {
  if ("datasetId" in where) {
    return prisma.label.findMany({
      where: { image: { datasetId: where.datasetId } },
      orderBy: { createdAt: "asc" },
      skip,
      take: first,
    }) as unknown as Promise<DbLabel[]>;
  }

  return prisma.label.findMany({
    where,
    orderBy: { createdAt: "asc" },
    skip,
    take: first,
  }) as unknown as Promise<DbLabel[]>;
};

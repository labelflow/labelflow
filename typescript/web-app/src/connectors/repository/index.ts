import { db } from "../database";

import type { Maybe, ImageWhereInput } from "../../graphql-types.generated";

export const getPaginatedImages = async (
  where?: Maybe<ImageWhereInput>,
  skip?: Maybe<number>,
  first?: Maybe<number>
): Promise<any[]> => {
  const query = db.image.orderBy("createdAt");

  if (where?.projectId) {
    query.filter((image) => image.projectId === where.projectId);
  }

  if (skip) {
    query.offset(skip);
  }
  if (first) {
    return query.limit(first).toArray();
  }

  return query.toArray();
};
export const repository = {
  image: {
    list: getPaginatedImages,
    getById: async (id: string) => db.image.get(id),
    add: db.image.add,
    delete: db.image.delete,
    update: db.image.update,
    count: db.image.count,
  },
};

export type Repository = typeof repository;

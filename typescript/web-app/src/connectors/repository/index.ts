import { db, DbImage } from "../database";

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
    getById: (id: string) => db.image.get(id),
    add: (image: DbImage) => db.image.add(image),
    delete: (id: string) => db.image.delete(id),
    update: (id: string, changes: Partial<DbImage>) =>
      db.image.update(id, changes),
    count: (where?: { [key: string]: string }) =>
      where ? db.image.where(where).count() : db.image.count(),
  },
};

export type Repository = typeof repository;

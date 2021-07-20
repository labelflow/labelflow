import { db } from "../database";

const getPaginatedImages = async (
  skip?: number | null,
  first?: number | null
): Promise<any[]> => {
  const query = db.image.orderBy("createdAt").offset(skip ?? 0);

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

import { db, DbImage, DbLabel } from "../database";

import { list } from "./utils/list";

import type {
  ImageWhereInput,
  LabelWhereInput,
} from "../../graphql-types.generated";

export const repository = {
  image: {
    list: list<DbImage, ImageWhereInput>(db.image),
    getById: (id: string) => db.image.get(id),
    add: (image: DbImage) => db.image.add(image),
    count: (where?: { [key: string]: string }) =>
      where ? db.image.where(where).count() : db.image.count(),
  },
  label: {
    list: list<DbLabel, LabelWhereInput>(db.label),
  },
  project: { getById: (id: string) => db.project.get(id) },
};

export type Repository = typeof repository;

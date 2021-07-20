import { db, DbImage, DbLabel, DbLabelClass } from "../database";

import { list } from "./utils/list";

import type {
  ImageWhereInput,
  LabelClassWhereInput,
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
    add: (label: DbLabel) => db.label.add(label),
  },
  labelClass: {
    getById: (id: string) => db.labelClass.get(id),
    list: list<DbLabelClass, LabelClassWhereInput>(db.labelClass),
    add: (labelClass: DbLabelClass) => db.labelClass.add(labelClass),
    delete: (id: string) => db.labelClass.delete(id),
    count: (where?: { [key: string]: string }) =>
      where ? db.labelClass.where(where).count() : db.labelClass.count(),
  },
  project: { getById: (id: string) => db.project.get(id) },
};

export type Repository = typeof repository;

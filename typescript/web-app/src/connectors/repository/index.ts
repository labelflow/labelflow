import { db, DbImage, DbLabel, DbLabelClass, DbProject } from "../database";

import { list } from "./utils/list";

import { countLabels, listLabels } from "./label";

import type {
  ImageWhereInput,
  LabelClassWhereInput,
} from "../../graphql-types.generated";

type PartialWithNullAllowed<T> = { [P in keyof T]?: T[P] | undefined | null };

export const repository = {
  image: {
    add: (image: DbImage) => db.image.add(image),
    count: (where?: ImageWhereInput) =>
      where ? db.image.where(where).count() : db.image.count(),
    getById: (id: string) => db.image.get(id),
    list: list<DbImage, ImageWhereInput>(db.image),
  },
  label: {
    add: (label: DbLabel) => db.label.add(label),
    count: countLabels,
    delete: (id: string) => db.label.delete(id),
    getById: (id: string) => db.label.get(id),
    list: listLabels,
    update: (id: string, changes: PartialWithNullAllowed<DbLabel>) =>
      db.label.update(id, changes),
  },
  labelClass: {
    add: (labelClass: DbLabelClass) => db.labelClass.add(labelClass),
    count: (where?: LabelClassWhereInput) =>
      where ? db.labelClass.where(where).count() : db.labelClass.count(),
    delete: (id: string) => db.labelClass.delete(id),
    getById: (id: string) => db.labelClass.get(id),
    list: list<DbLabelClass, LabelClassWhereInput>(db.labelClass),
  },
  project: {
    add: (project: DbProject) => db.project.add(project),
    delete: (id: string) => db.project.delete(id),
    getById: (id: string) => db.project.get(id),
    getByName: (name: string) => db.project.get({ name }),
    list: list<DbProject>(db.project),
    update: (id: string, changes: PartialWithNullAllowed<DbProject>) =>
      db.project.update(id, changes),
  },
};

export type Repository = typeof repository;

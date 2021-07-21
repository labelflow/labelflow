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
    list: list<DbImage, ImageWhereInput>(db.image),
    getById: (id: string) => db.image.get(id),
    add: (image: DbImage) => db.image.add(image),
    count: (where?: ImageWhereInput) =>
      where ? db.image.where(where).count() : db.image.count(),
  },
  label: {
    getById: (id: string) => db.label.get(id),
    list: listLabels,
    add: (label: DbLabel) => db.label.add(label),
    delete: (id: string) => db.label.delete(id),
    update: (id: string, changes: PartialWithNullAllowed<DbLabel>) =>
      db.label.update(id, changes),
    count: countLabels,
  },
  labelClass: {
    getById: (id: string) => db.labelClass.get(id),
    list: list<DbLabelClass, LabelClassWhereInput>(db.labelClass),
    add: (labelClass: DbLabelClass) => db.labelClass.add(labelClass),
    delete: (id: string) => db.labelClass.delete(id),
    count: (where?: LabelClassWhereInput) =>
      where ? db.labelClass.where(where).count() : db.labelClass.count(),
  },
  project: {
    list: list<DbProject, null>(db.project),
    add: (project: DbProject) => db.project.add(project),
    getById: (id: string) => db.project.get(id),
    getByName: (name: string) => db.project.get({ name }),
    update: (id: string, changes: PartialWithNullAllowed<DbProject>) =>
      db.project.update(id, changes),
    delete: (id: string) => db.project.delete(id),
  },
};

export type Repository = typeof repository;

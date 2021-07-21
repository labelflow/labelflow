import { db, DbImage, DbLabel, DbLabelClass } from "../database";

import { list } from "./utils/list";

import type {
  ImageWhereInput,
  LabelClassWhereInput,
  LabelWhereInput,
  Maybe,
} from "../../graphql-types.generated";

type PartialWithNullAllowed<T> = { [P in keyof T]?: T[P] | undefined | null };

const labelCount = async (
  where?: LabelWhereInput | { projectId?: Maybe<string> | undefined }
) => {
  if (where) {
    if ("projectId" in where) {
      const imagesOfProject = await db.image
        .where({
          projectId: where.projectId,
        })
        .toArray();

      return db.label
        .filter((currentLabel) =>
          imagesOfProject.some((image) => currentLabel.imageId === image.id)
        )
        .count();
    }

    return db.label.where(where).count();
  }

  return db.label.count();
};

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
    list: list<DbLabel, LabelWhereInput>(db.label),
    add: (label: DbLabel) => db.label.add(label),
    delete: (id: string) => db.label.delete(id),
    update: (id: string, changes: PartialWithNullAllowed<DbLabel>) =>
      db.label.update(id, changes),
    count: labelCount,
  },
  labelClass: {
    getById: (id: string) => db.labelClass.get(id),
    list: list<DbLabelClass, LabelClassWhereInput>(db.labelClass),
    add: (labelClass: DbLabelClass) => db.labelClass.add(labelClass),
    delete: (id: string) => db.labelClass.delete(id),
    count: (where?: LabelClassWhereInput) =>
      where ? db.labelClass.where(where).count() : db.labelClass.count(),
  },
  project: { getById: (id: string) => db.project.get(id) },
};

export type Repository = typeof repository;

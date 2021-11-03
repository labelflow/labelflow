import Dexie from "dexie";

import type {
  DbImage,
  DbLabel,
  DbLabelClass,
  DbExample,
  DbDataset,
} from "@labelflow/common-resolvers";

export interface Database extends Dexie {
  example: Dexie.Table<DbExample, string>;
  image: Dexie.Table<DbImage, string>;
  label: Dexie.Table<DbLabel, string>;
  labelClass: Dexie.Table<DbLabelClass, string>;
  dataset: Dexie.Table<DbDataset, string>;
}

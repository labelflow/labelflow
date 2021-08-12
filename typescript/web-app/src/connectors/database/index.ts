import Dexie from "dexie";
import {
  DbExample,
  DbImage,
  DbLabel,
  DbLabelClass,
  DbProject,
} from "@labelflow/common-resolvers";

import versions from "./versions";

export interface Database extends Dexie {
  example: Dexie.Table<DbExample, string>;
  image: Dexie.Table<DbImage, string>;
  label: Dexie.Table<DbLabel, string>;
  labelClass: Dexie.Table<DbLabelClass, string>;
  project: Dexie.Table<DbProject, string>;
}

// eslint-disable-next-line import/no-mutable-exports
export let db: Database;

export const resetDatabase = () => {
  console.log("Initializing database");
  if (db) {
    try {
      db.close();
    } catch (e) {
      console.log("Could not close existing database");
    }
  }
  db = new Dexie("labelflow_local") as Database;
  versions.map(({ version, stores }) => db.version(version).stores(stores));
};

resetDatabase();

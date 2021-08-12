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

declare module globalThis {
  let database: Database;
}

export const resetDatabase = (): Database => {
  console.log("Initializing database");
  if (globalThis.database) {
    try {
      globalThis.database.close();
    } catch (error) {
      console.log("Could not close existing database", error);
    }
  }
  globalThis.database = new Dexie("labelflow_local") as Database;
  versions.map(({ version, stores }) =>
    globalThis.database.version(version).stores(stores)
  );
  return globalThis.database;
};

export const getDatabase = (): Database => {
  if (globalThis.database) {
    return globalThis.database;
  }
  return resetDatabase();
};

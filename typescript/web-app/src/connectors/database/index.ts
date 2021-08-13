import Dexie from "dexie";

import versions from "./versions";

import { Database } from "./types";

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
  versions.map(({ version, stores, upgrade = () => {} }) =>
    globalThis.database.version(version).stores(stores).upgrade(upgrade)
  );
  return globalThis.database;
};

export const getDatabase = (): Database => {
  if (globalThis.database) {
    return globalThis.database;
  }
  return resetDatabase();
};

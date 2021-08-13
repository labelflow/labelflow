import Dexie from "dexie";

import { Database } from "./types";

import versions from "./versions";

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
  versions.map(({ version, stores, upgrade = () => {} }) =>
    db.version(version).stores(stores).upgrade(upgrade)
  );
};

resetDatabase();

import Dexie from "dexie";

import versions from "./versions";

import { Database } from "./types";

declare module globalThis {
  let database: Database;
}

export const resetDatabase = async (): Promise<Database> => {
  console.log("Initializing database");
  if (globalThis.database) {
    try {
      globalThis.database.close();
    } catch (error) {
      console.log("Could not close existing database", error);
    }
  }
  globalThis.database = new Dexie("labelflow_local", {
    autoOpen: false,
  }) as Database;
  versions.map(({ version, stores, upgrade = () => {} }) =>
    globalThis.database.version(version).stores(stores).upgrade(upgrade)
  );
  await globalThis.database.open();
  await new Promise((resolve) => {
    globalThis.database.on("ready", resolve as () => any);
  });
  return globalThis.database;
};

export const getDatabase = async (): Promise<Database> => {
  if (globalThis.database) {
    if (!globalThis.database.isOpen()) {
      await new Promise((resolve) => {
        globalThis.database.on("ready", resolve as () => any);
      });
    }

    return globalThis.database;
  }
  return await resetDatabase();
};

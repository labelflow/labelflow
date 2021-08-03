import Dexie from "dexie";
import { v4 as uuidv4 } from "uuid";
import {
  DbExample,
  DbImage,
  DbLabel,
  DbLabelClass,
  DbProject,
  getImageEntityFromMutationArgs,
} from "@labelflow/common-resolvers";
import versions from "./versions";
import sampleImages from "../../utils/image-sample-collection";

export type { DbExample, DbImage, DbLabel, DbLabelClass, DbProject };

interface Database extends Dexie {
  example: Dexie.Table<DbExample, string>;
  image: Dexie.Table<DbImage, string>;
  label: Dexie.Table<DbLabel, string>;
  labelClass: Dexie.Table<DbLabelClass, string>;
  project: Dexie.Table<DbProject, string>;
}

// eslint-disable-next-line import/no-mutable-exports
export let db: Database;
let shouldPopulateDb = false;

const demoImageUrls = sampleImages.slice(0, 5);

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
  const currentDate = new Date().toISOString();

  // Create Demo project with sample images if this is the first time the user visits labelflow
  db.on("populate", () => {
    // Get if we are running tests with Jest, in this case we do not want to populate the DB to avoid breaking the tests https://stackoverflow.com/a/52231746/10266299
    const isRunningJestTests = process.env.JEST_WORKER_ID != null;
    if (!isRunningJestTests) {
      shouldPopulateDb = true;
    }
  });
  db.on("ready", async () => {
    if (shouldPopulateDb) {
      const projectId = uuidv4();
      db.project.add({
        name: "Demo project",
        id: projectId,
        createdAt: currentDate,
        updatedAt: currentDate,
      });
      await Promise.all(
        demoImageUrls.map(async (url) => {
          const imageEntity = await getImageEntityFromMutationArgs({
            projectId,
            url,
          });
          db.image.add(imageEntity);
        })
      );
    }
  });
};

resetDatabase();

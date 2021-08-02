import Dexie from "dexie";
import { v4 as uuidv4 } from "uuid";
import versions from "./versions";
import sampleImages from "../../utils/image-sample-collection";
import type {
  Scalars,
  Example as GeneratedExample,
  Image as GeneratedImage,
  Label as GeneratedLabel,
  LabelClass as GeneratedLabelClass,
  Project as GeneratedProject,
} from "../../graphql-types.generated";
import { getImageEntityFromMutationArgs } from "../resolvers/image";

export type DbImage =
  | (Omit<GeneratedImage, "url" | "labels"> & {
      fileId: Scalars["ID"];
    })
  | Omit<GeneratedImage, "labels">;

export type DbLabel = Omit<GeneratedLabel, "labelClass"> & {
  labelClassId: Scalars["ID"] | undefined | null;
};

export type DbLabelClass = Omit<GeneratedLabelClass, "labels">;

export type DbExample = GeneratedExample;

export type DbProject = Omit<
  GeneratedProject,
  | "images"
  | "imagesAggregates"
  | "labels"
  | "labelsAggregates"
  | "labelClasses"
  | "labelClassesAggregates"
>;

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
    shouldPopulateDb = true;
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

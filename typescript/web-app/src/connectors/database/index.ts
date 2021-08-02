import Dexie from "dexie";
import { v4 as uuidv4 } from "uuid";
import versions from "./versions";
import type {
  Scalars,
  Example as GeneratedExample,
  Image as GeneratedImage,
  Label as GeneratedLabel,
  LabelClass as GeneratedLabelClass,
  Project as GeneratedProject,
} from "../../graphql-types.generated";

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
  db.on("populate", () => {
    db.project.add({
      name: "Demo project",
      id: uuidv4(),
      createdAt: currentDate,
      updatedAt: currentDate,
    });
  });
};

resetDatabase();

import Dexie from "dexie";
import versions from "./versions";
import type {
  Scalars,
  Example as GeneratedExample,
  Image as GeneratedImage,
  Label as GeneratedLabel,
  LabelClass as GeneratedLabelClass,
} from "../../graphql-types.generated";

export type DbFile = {
  id: string;
  blob: Blob;
};

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

interface Database extends Dexie {
  example: Dexie.Table<DbExample, string>;
  image: Dexie.Table<DbImage, string>;
  file: Dexie.Table<DbFile, string>;
  label: Dexie.Table<DbLabel, string>;
  labelClass: Dexie.Table<DbLabelClass, string>;
}

// eslint-disable-next-line import/no-mutable-exports
export let db: Database;

export const resetDatabase = () => {
  console.log("Initializing database");
  db = new Dexie("labelflow_local") as Database;
  versions.map(({ version, stores }) => db.version(version).stores(stores));
};

resetDatabase();

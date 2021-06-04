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
  id?: string;
  imageId: string;
  blob: File;
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

export const databaseWithoutTables = new Dexie("labelflow_local");

versions.map(({ version, stores }) =>
  databaseWithoutTables.version(version).stores(stores)
);

export const db = databaseWithoutTables as Database;

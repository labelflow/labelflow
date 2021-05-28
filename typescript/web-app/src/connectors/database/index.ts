import Dexie from "dexie";
import versions from "./versions";
import type {
  Example,
  Image as GeneratedImageType,
  Label,
  Scalars,
  LabelClass as GeneratedLabelClass,
} from "../../types.generated";

export interface File {
  id?: string;
  imageId: string;
  blob: File;
}

interface Image extends Omit<GeneratedImageType, "url" | "labels"> {
  fileId: Scalars["ID"];
}

type LabelClass = Omit<GeneratedLabelClass, "labels">;

interface Database extends Dexie {
  example: Dexie.Table<Example, string>;
  image: Dexie.Table<Image, string>;
  file: Dexie.Table<File, string>;
  label: Dexie.Table<Label, string>;
  labelClass: Dexie.Table<LabelClass, string>;
}

export const databaseWithoutTables = new Dexie("labelflow_local");

versions.map(({ version, stores }) =>
  databaseWithoutTables.version(version).stores(stores)
);

export const db = databaseWithoutTables as Database;

import Dexie from "dexie";
import type {
  Example,
  Image as GeneratedImageType,
  Scalars,
} from "../../types.generated";

export interface File {
  id?: string;
  imageId: string;
  blob: File;
}

interface Image extends Omit<GeneratedImageType, "url"> {
  fileId: Scalars["ID"];
}

interface Database extends Dexie {
  example: Dexie.Table<Example, string>;
  image: Dexie.Table<Image, string>;
  file: Dexie.Table<File, string>;
}

export const databaseWithoutTables = new Dexie("database");

databaseWithoutTables.version(1).stores({
  example: "id,createdAt,updatedAt,name",
  image: "id,createdAt,updatedAt,name,width,height,fileId",
  file: "id,imageId,blob",
});

export const db = databaseWithoutTables as Database;

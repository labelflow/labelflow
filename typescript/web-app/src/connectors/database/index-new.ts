import Dexie from "dexie";
import introspection from "../../../../../data/__generated__/introspection.json";

const getFieldsFromInstanceName = (nameInstance: string): string[] =>
  // eslint-disable-next-line no-underscore-dangle
  introspection.__schema.types
    .find((o) => o.name === nameInstance)
    ?.fields?.map((o: any) => o.name) as string[];

export interface ImageEntity {
  id?: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  width: number;
  height: number;
  fileId: string;
}

export interface FileEntity {
  id?: string;
  imageId: string;
  blob: File;
}

interface Database extends Dexie {
  images: Dexie.Table<ImageEntity, string>;

  files: Dexie.Table<FileEntity, string>;
}

export const databaseWithoutTables = new Dexie("database");

const fieldsImage = getFieldsFromInstanceName("Image");
console.log("fieldsImage: ", fieldsImage);

databaseWithoutTables.version(1).stores({
  images: "id,createdAt,updatedAt,name,width,height,fileId",
  files: "id,imageId,blob",
});

export const db: Database = databaseWithoutTables as Database;

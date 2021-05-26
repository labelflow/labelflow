import Dexie from "dexie";

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

databaseWithoutTables.version(1).stores({
  images: "id,createdAt,updatedAt,name,width,height,fileId",
  files: "id,imageId,blob",
});

export const db: Database = databaseWithoutTables as Database;

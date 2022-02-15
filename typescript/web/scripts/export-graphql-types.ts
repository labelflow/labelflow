import { Dirent } from "fs";
import { readdir, writeFile } from "fs-extra";
import { join as joinPath } from "path";

const GRAPHQL_TYPES_DIR = joinPath(__dirname, "..", "src", "graphql-types");

const INDEX_FILE = joinPath(GRAPHQL_TYPES_DIR, "index.ts");

const isValidFile = (entry: Dirent) =>
  entry.isFile() && entry.name.endsWith(".ts") && entry.name !== "index.ts";

const getFiles = async () => {
  const entries = await readdir(GRAPHQL_TYPES_DIR, { withFileTypes: true });
  return entries.filter(isValidFile).map(({ name }) => name);
};

const getExportLine = (fileName: string) => {
  const nameWithoutExt = fileName.substring(0, fileName.length - 3);
  return `export * from "./${nameWithoutExt}";`;
};

const getExports = async () => {
  const files = await getFiles();
  return files.map(getExportLine);
};

const writeIndex = async () => {
  const exports = await getExports();
  const data = [...exports, ""].join("\n");
  await writeFile(INDEX_FILE, data, "utf8");
};

writeIndex();

import { ImportOptionsCoco, ImportStatus } from "@labelflow/graphql-types";
import { Context } from "../types";

export type ImportFunction = (
  zipBlob: Blob,
  datasetId: string,
  context: Context,
  options?: ImportOptionsCoco
) => Promise<ImportStatus>;

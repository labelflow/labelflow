import { ImportOptionsCoco } from "@labelflow/graphql-types";
import { Context } from "../types";

export type ImportFunction = (
  zipBlob: Blob,
  datasetId: string,
  options: ImportOptionsCoco,
  context: Context
) => void;

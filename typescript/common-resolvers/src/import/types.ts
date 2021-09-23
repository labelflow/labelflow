import { ImportOptionsCoco } from "@labelflow/graphql-types";
import { Context } from "../types";

export type ImportFunction = (
  zipBlob: Blob,
  datasetId: string,
  context: Context,
  options?: ImportOptionsCoco
) => void;

import { Context } from "../types";

export type ImportFunction = (
  zipBlob: Blob,
  datasetId: string,
  context: Context
) => void;

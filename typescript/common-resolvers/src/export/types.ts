import { ExportOptions } from "@labelflow/graphql-types";
import { Context } from "../types";

export type ExportFunction = (
  datasetId: string,
  options: ExportOptions,
  context: Context
) => Promise<Blob>;

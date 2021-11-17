import { ExportOptionsCoco, ExportOptionsYolo } from "@labelflow/graphql-types";
import { Context } from "../types";

export type ExportFunction = (
  datasetId: string,
  options: ExportOptionsCoco | ExportOptionsYolo,
  context: Context,
  user?: { id: string }
) => Promise<Blob>;

import {
  ExportOptionsCoco,
  ExportOptionsYolo,
  ExportOptionsCsv,
} from "@labelflow/graphql-types";
import { Context } from "../types";

export type ExportFunction<
  TOptions extends ExportOptionsCoco | ExportOptionsYolo | ExportOptionsCsv
> = (
  datasetId: string,
  options: TOptions,
  context: Context,
  user?: { id: string }
) => Promise<Blob>;

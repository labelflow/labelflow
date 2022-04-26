import { mergeResolvers } from "@graphql-tools/merge";
import exportResolvers from "./export";
import importResolvers from "./import";
import imageResolvers from "./image";
import labelResolvers from "./label";
import labelClassResolvers from "./label-class";
import datasetResolvers from "./dataset";
import scalarsResolvers from "./scalars";
import uploadResolvers from "./upload";
import iogResolvers from "./iog-inference";

export const commonResolvers = mergeResolvers([
  exportResolvers,
  importResolvers,
  imageResolvers,
  labelResolvers,
  labelClassResolvers,
  datasetResolvers,
  scalarsResolvers,
  uploadResolvers,
  iogResolvers,
]);

// We maybe should extract those functions in a dedicated package, feel free to discuss this
export { getBoundedGeometryFromImage } from "./utils/get-bounded-geometry-from-image";
export { throwIfResolvesToNil } from "./utils/throw-if-resolves-to-nil";

export { initialCocoDataset } from "./export/format-coco/coco-core/converters";
export {
  jsonToDataUri,
  dataUriToJson,
} from "./export/format-coco/json-to-data-uri";
export { importAndProcessImage } from "./image/import-and-process-image";

export * from "./types";
export * from "./export/format-coco/coco-core/types";

export * from "./constants";
export * from "./utils";
export * from "./ai-assistant";

export { downloadUrlToDataUrl, fetchIogServer } from "./iog-inference";

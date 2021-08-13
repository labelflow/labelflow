import { mergeResolvers } from "@graphql-tools/merge";
import formatCocoResolvers from "./format-coco";
import imageResolvers from "./image";
import labelResolvers from "./label";
import labelClassResolvers from "./label-class";
import datasetResolvers from "./dataset";
import scalarsResolvers from "./scalars";
import uploadResolvers from "./upload";

export const commonResolvers = mergeResolvers([
  formatCocoResolvers,
  imageResolvers,
  labelResolvers,
  labelClassResolvers,
  datasetResolvers,
  scalarsResolvers,
  uploadResolvers,
]);

// We maybe should extract those functions in a dedicated package, feel free to discuss this
export { getBoundedGeometryFromImage } from "./utils/get-bounded-geometry-from-image";
export { throwIfResolvesToNil } from "./utils/throw-if-resolves-to-nil";

export { initialCocoDataset } from "./format-coco/coco-core/converters";
export { jsonToDataUri, dataUriToJson } from "./format-coco/json-to-data-uri";
export { getImageEntityFromMutationArgs } from "./image";

export * from "./types";
export * from "./format-coco/coco-core/types";

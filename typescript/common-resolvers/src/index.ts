import { mergeResolvers } from "@graphql-tools/merge";
import formatCocoResolvers from "./format-coco";
// import imageResolvers from "./image";
import labelResolvers from "./label";
import labelClassResolvers from "./label-class";
import projectResolvers from "./project";
import scalarsResolvers from "./scalars";

export const commonResolvers = mergeResolvers([
  formatCocoResolvers,
  // imageResolvers,
  labelResolvers,
  labelClassResolvers,
  projectResolvers,
  scalarsResolvers,
]);

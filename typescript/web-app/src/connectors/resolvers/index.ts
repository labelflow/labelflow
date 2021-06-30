import { mergeResolvers } from "@graphql-tools/merge";
import exampleResolvers from "./example";
import exportToCocoResolvers from "./export-to-coco";
import imageResolvers from "./image";
import labelResolvers from "./label";
import labelClassResolvers from "./label-class";
import projectResolvers from "./project";
import uploadResolvers from "./upload";
import scalarsResolvers from "./scalars";
import debugResolvers from "./debug";

export const resolvers = mergeResolvers([
  exampleResolvers,
  exportToCocoResolvers,
  imageResolvers,
  labelResolvers,
  labelClassResolvers,
  projectResolvers,
  uploadResolvers,
  scalarsResolvers,
  debugResolvers,
]);

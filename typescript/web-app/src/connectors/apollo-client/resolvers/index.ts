import { mergeResolvers } from "@graphql-tools/merge";
import exampleResolvers from "./example";
import exportToCocoResolvers from "./export-to-coco";
import imageResolvers from "./image";
import labelResolvers from "./label";
import labelClassResolvers from "./label-class";
import uploadResolvers from "./upload";

export const resolvers = mergeResolvers([
  exampleResolvers,
  exportToCocoResolvers,
  imageResolvers,
  labelResolvers,
  labelClassResolvers,
  uploadResolvers,
]);

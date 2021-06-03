import { mergeResolvers } from "@graphql-tools/merge";
import exampleResolvers from "./example";
import imageResolvers from "./image";
import labelResolvers from "./label";
import labelClassResolvers from "./label-class";

export const resolvers = mergeResolvers([
  exampleResolvers,
  imageResolvers,
  labelResolvers,
  labelClassResolvers,
]);

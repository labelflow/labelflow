import { mergeResolvers } from "@graphql-tools/merge";
import exampleResolvers from "./example";
import imageResolvers from "./image";
import labelResolvers from "./label";

export const resolvers = mergeResolvers([
  exampleResolvers,
  imageResolvers,
  labelResolvers,
]);

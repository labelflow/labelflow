import { mergeResolvers } from "@graphql-tools/merge";
import exampleResolvers from "./example";
import imageResolvers from "./image";

export const resolvers = mergeResolvers([exampleResolvers, imageResolvers]);

import { mergeResolvers } from "@graphql-tools/merge";
import exampleResolvers from "./example";

export const resolvers = mergeResolvers([exampleResolvers]);

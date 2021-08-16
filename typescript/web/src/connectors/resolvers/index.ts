import { mergeResolvers } from "@graphql-tools/merge";
import { commonResolvers } from "@labelflow/common-resolvers";
import exampleResolvers from "./example";

import debugResolvers from "./debug";

export const resolvers = mergeResolvers([
  exampleResolvers,
  commonResolvers,
  debugResolvers,
]);

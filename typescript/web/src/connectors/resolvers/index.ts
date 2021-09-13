import { mergeResolvers } from "@graphql-tools/merge";
import { commonResolvers } from "@labelflow/common-resolvers";
import exampleResolvers from "./example";

import debugResolvers from "./debug";
import localWorkspaceResolvers from "./workspace";

export const resolvers = mergeResolvers([
  exampleResolvers,
  commonResolvers,
  debugResolvers,
  localWorkspaceResolvers,
]);

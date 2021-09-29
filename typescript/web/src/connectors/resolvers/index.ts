import { mergeResolvers } from "@graphql-tools/merge";
import { commonResolvers } from "@labelflow/common-resolvers";
import exampleResolvers from "./example";
import debugResolvers from "./debug";
import localMembershipResolvers from "./membership";
import localUserResolvers from "./user";
import localWorkspaceResolvers from "./workspace";

export const resolvers = mergeResolvers([
  exampleResolvers,
  commonResolvers,
  debugResolvers,
  localMembershipResolvers,
  localUserResolvers,
  localWorkspaceResolvers,
]);

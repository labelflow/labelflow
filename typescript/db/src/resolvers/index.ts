import { mergeResolvers } from "@graphql-tools/merge";
import { commonResolvers } from "@labelflow/common-resolvers";
import workspaceResolvers from "./workspace";

export const resolvers = mergeResolvers([commonResolvers, workspaceResolvers]);

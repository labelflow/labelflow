import { mergeResolvers } from "@graphql-tools/merge";
import { commonResolvers } from "@labelflow/common-resolvers";

export const resolvers = mergeResolvers([commonResolvers]);

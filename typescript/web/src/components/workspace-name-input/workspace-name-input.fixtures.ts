import { MockedResponse as ApolloResponse } from "@apollo/client/testing";
import { Mutation, Query } from "@labelflow/graphql-types";
import { WORKSPACE_EXISTS_QUERY } from "./workspace-exists.query";

export const GRAPHQL_MOCKS: ApolloResponse<Partial<Query | Mutation>>[] = [
  {
    request: {
      query: WORKSPACE_EXISTS_QUERY,
      variables: { slug: "already-taken-name" },
    },
    result: { data: { workspaceExists: true } },
  },
  {
    request: { query: WORKSPACE_EXISTS_QUERY },
    result: { data: { workspaceExists: false } },
  },
];

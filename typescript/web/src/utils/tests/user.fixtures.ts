import { DocumentNode } from "@apollo/client";
import { WorkspacePlan } from "../../graphql-types/globalTypes";
import { UserQuery_user } from "../../graphql-types/UserQuery";
import { UserWithWorkspacesQuery_user } from "../../graphql-types/UserWithWorkspacesQuery";
import {
  MinimalUserTuple,
  UserTupleTypes,
  WithWorkspacesUserTuple,
} from "../../hooks";
import {
  USER_QUERY,
  USER_WITH_WORKSPACES_QUERY,
} from "../../shared-queries/user.query";
import { ApolloMockResponse } from "./apollo-mock";

export const USER_QUERY_DATA: UserQuery_user = {
  id: "e66e5aff-86f2-4543-bb51-7b414f5f6774",
  name: "minimal-user",
  createdAt: new Date(),
  email: null,
  image: null,
};

export const WORKSPACE_DATA = {
  id: "d0dbc712-8fb8-4b27-bad9-85de7cea5c86",
  slug: "full-user-workspace",
  name: "Full user workspace",
  plan: WorkspacePlan.Community,
  image: "https://labelflow.ai/static/icon-512x512.png",
};

export const USER_WITH_WORKSPACES_DATA: UserWithWorkspacesQuery_user = {
  ...USER_QUERY_DATA,
  name: "full-user",
  createdAt: new Date(),
  email: "full.user@localhost",
  image: null,
  memberships: [{ workspace: WORKSPACE_DATA }],
};

export const mockUserQuery = <TTypes extends UserTupleTypes>(
  query: DocumentNode,
  user: TTypes[2]
): ApolloMockResponse<TTypes[0], TTypes[1]> => ({
  request: { query, variables: { id: user.id } },
  result: { data: { user } },
});

export const USER_QUERY_MOCK = mockUserQuery<MinimalUserTuple>(
  USER_QUERY,
  USER_QUERY_DATA
);

export const USER_WITH_WORKSPACES_QUERY_MOCK =
  mockUserQuery<WithWorkspacesUserTuple>(
    USER_WITH_WORKSPACES_QUERY,
    USER_WITH_WORKSPACES_DATA
  );

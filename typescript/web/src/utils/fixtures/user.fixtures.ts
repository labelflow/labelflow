import { DocumentNode } from "@apollo/client";
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
import { ApolloMockResponse } from "../tests/apollo-mock";
import { UNPAID_WORKSPACE_DATA, WORKSPACE_DATA } from "./workspace.fixtures";

export const USER_QUERY_DATA: UserQuery_user = {
  id: "e66e5aff-86f2-4543-bb51-7b414f5f6774",
  name: "minimal-user",
  createdAt: new Date(),
  email: null,
  image: null,
};

export const USER_WITH_WORKSPACES_DATA: UserWithWorkspacesQuery_user = {
  ...USER_QUERY_DATA,
  name: "full-user",
  createdAt: new Date(),
  email: "full.user@localhost",
  image: null,
  memberships: [
    { workspace: WORKSPACE_DATA },
    { workspace: UNPAID_WORKSPACE_DATA },
  ],
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

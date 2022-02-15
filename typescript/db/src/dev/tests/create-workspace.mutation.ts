import { gql } from "@apollo/client";
import {
  MutationCreateWorkspaceArgs,
  Workspace,
} from "@labelflow/graphql-types";
import { USER_WITH_WORKSPACES_QUERY } from "../../../../web/src/shared-queries/user.query";
import { client } from "../apollo-client";

export const CREATE_WORKSPACE_MUTATION = gql`
  mutation createWorkspace($data: WorkspaceCreateInput!) {
    createWorkspace(data: $data) {
      id
      name
      slug
      plan
      type
      memberships {
        user {
          id
        }
        role
      }
    }
  }
`;

export const createWorkspace = (
  data?: Partial<MutationCreateWorkspaceArgs["data"]>
) =>
  client.mutate<{
    createWorkspace: Pick<
      Workspace,
      "id" | "name" | "slug" | "plan" | "type" | "memberships"
    >;
  }>({
    mutation: CREATE_WORKSPACE_MUTATION,
    variables: {
      data: { ...data, name: data?.name === undefined ? "test" : data.name },
    },
    refetchQueries: [USER_WITH_WORKSPACES_QUERY],
  });

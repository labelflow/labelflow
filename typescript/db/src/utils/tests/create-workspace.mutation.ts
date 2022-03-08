import { gql } from "@apollo/client";
import { DEFAULT_WORKSPACE_PLAN } from "@labelflow/common-resolvers";
import {
  MutationCreateWorkspaceArgs,
  Workspace,
} from "@labelflow/graphql-types";
import { USER_WITH_WORKSPACES_QUERY } from "../../../../web/src/shared-queries/user.query";
import { client } from "../../dev/apollo-client";

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

export const createWorkspace = ({
  name = "test",
  plan = DEFAULT_WORKSPACE_PLAN,
  ...data
}: Partial<MutationCreateWorkspaceArgs["data"]> = {}) =>
  client.mutate<{
    createWorkspace: Pick<
      Workspace,
      "id" | "name" | "slug" | "plan" | "type" | "memberships"
    >;
  }>({
    mutation: CREATE_WORKSPACE_MUTATION,
    variables: {
      data: { ...data, name, plan },
    },
    refetchQueries: [USER_WITH_WORKSPACES_QUERY],
  });

import { gql } from "@apollo/client";
import {
  MutationCreateWorkspaceArgs,
  Workspace,
} from "@labelflow/graphql-types";
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
  });

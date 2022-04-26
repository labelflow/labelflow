import { gql } from "@apollo/client";

/**
 * Fetches minimal information about the current user.
 * @remarks
 * This query is used across the whole app if:
 * - the user menu is shown
 * - the current page does not belongs to a workspace
 */
export const USER_QUERY = gql`
  query UserQuery($id: ID!) {
    user(where: { id: $id }) {
      id
      createdAt
      name
      email
      image
    }
  }
`;

/**
 * This query is used across the whole app as long as:
 * - user menu is shown
 * - we're in a workspace
 */
export const USER_WITH_WORKSPACES_QUERY = gql`
  query UserWithWorkspacesQuery($id: ID!) {
    user(where: { id: $id }) {
      id
      createdAt
      name
      email
      image
      memberships {
        workspace {
          id
          name
          slug
          image
          plan
          status
        }
      }
    }
  }
`;

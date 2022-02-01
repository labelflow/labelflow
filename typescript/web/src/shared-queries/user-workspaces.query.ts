import { gql } from "@apollo/client";

/** Data used in every pages of a workspace because of the workspace switcher */
export const USER_WORKSPACES_QUERY = gql`
  query UserWorkspacesQuery {
    workspaces {
      id
      name
      slug
    }
  }
`;

import { gql } from "@apollo/client";

/** Data used in all pages of a workspace */
export const CURRENT_WORKSPACE_QUERY = gql`
  query CurrentWorkspaceQuery($workspaceSlug: String) {
    workspace(where: { slug: $workspaceSlug }) {
      id
      name
    }
  }
`;

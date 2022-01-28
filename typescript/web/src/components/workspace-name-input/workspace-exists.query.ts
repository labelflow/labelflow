import { gql, QueryHookOptions, useQuery } from "@apollo/client";
import {
  WorkspaceExistsQuery,
  WorkspaceExistsQueryVariables,
} from "../../graphql-types/WorkspaceExistsQuery";

export const WORKSPACE_EXISTS_QUERY = gql`
  query WorkspaceExistsQuery($slug: String!) {
    workspaceExists(where: { slug: $slug })
  }
`;

export type UseWorkspaceExistsOptions = Partial<
  QueryHookOptions<WorkspaceExistsQuery, WorkspaceExistsQueryVariables>
>;

export const useWorkspaceExistsQuery = (
  slug: string,
  options?: UseWorkspaceExistsOptions
) =>
  useQuery<WorkspaceExistsQuery, WorkspaceExistsQueryVariables>(
    WORKSPACE_EXISTS_QUERY,
    {
      skip: slug.length === 0,
      variables: { slug },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
      ...options,
    }
  );

import { gql, QueryHookOptions, QueryResult, useQuery } from "@apollo/client";
import { Query, WorkspaceWhereInput } from "@labelflow/graphql-types";

export const WORKSPACE_EXISTS_QUERY = gql`
  query workspaceExists($slug: String!) {
    workspaceExists(where: { slug: $slug })
  }
`;

export type WorkspaceExistsResult = Pick<Query, "workspaceExists">;

export type UseWorkspaceExistsOptions = Partial<
  QueryHookOptions<WorkspaceExistsResult, WorkspaceWhereInput>
>;

export function useWorkspaceExistsQuery(
  slug: string,
  options?: UseWorkspaceExistsOptions
): QueryResult<WorkspaceExistsResult, WorkspaceWhereInput> {
  return useQuery<WorkspaceExistsResult, WorkspaceWhereInput>(
    WORKSPACE_EXISTS_QUERY,
    {
      skip: slug.length === 0,
      variables: { slug },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
      ...options,
    }
  );
}

import { ApolloError, gql, useQuery } from "@apollo/client";
import { Query, WorkspaceWhereInput } from "@labelflow/graphql-types";

export const workspaceExistsQuery = gql`
  query workspaceExists($slug: String!) {
    workspaceExists(where: { slug: $slug })
  }
`;

/**
 * Determines whether the given workspace name slug already exists in the db or
 * not by querying our GraphQL server.
 * @param slug - Workspace name slug (kebab-case name)
 * @returns A tuple whose first value is the result (true if the workspace name
 * slug already exists, false otherwise and undefined if the query is loading)
 * and second value is an ApolloError object which is defined when an error
 * occurred.
 */
export function useWorkspaceExists(
  slug: string
): [boolean | undefined, ApolloError | undefined] {
  const { data, error } = useQuery<
    Pick<Query, "workspaceExists">,
    WorkspaceWhereInput
  >(workspaceExistsQuery, {
    skip: !slug,
    variables: { slug },
    fetchPolicy: "network-only",
  });
  return [data?.workspaceExists, error];
}

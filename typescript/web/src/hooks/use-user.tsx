import { DocumentNode, useQuery } from "@apollo/client";
import { isEmpty, isNil } from "lodash/fp";
import { useSession } from "next-auth/react";
import { PropsWithChildren, useMemo } from "react";
import {
  UserQuery,
  UserQueryVariables,
  UserQuery_user,
} from "../graphql-types/UserQuery";
import {
  UserWithWorkspacesQuery,
  UserWithWorkspacesQueryVariables,
  UserWithWorkspacesQuery_user,
  UserWithWorkspacesQuery_user_memberships_workspace,
} from "../graphql-types/UserWithWorkspacesQuery";
import {
  USER_QUERY,
  USER_WITH_WORKSPACES_QUERY,
} from "../shared-queries/user.query";
import { createOptionalContext } from "./use-optional-context";
import { useRouterQueryString } from "./use-router-query-string";

const useUserId = (): string | undefined => {
  const { data } = useSession({ required: false });
  return data?.user.id;
};

export type UserTuple<
  TQuery extends UserQuery,
  TVariables extends UserQueryVariables,
  TUser extends UserQuery_user
> = [TQuery, TVariables, TUser];

export type MinimalUserTuple = UserTuple<
  UserQuery,
  UserQueryVariables,
  UserQuery_user
>;

export type WithWorkspacesUserTuple = UserTuple<
  UserWithWorkspacesQuery,
  UserWithWorkspacesQueryVariables,
  UserWithWorkspacesQuery_user
>;

export type UserTupleTypes = MinimalUserTuple | WithWorkspacesUserTuple;

const useUserQuery = <TTypes extends UserTupleTypes>(
  query: DocumentNode
): TTypes[2] | undefined => {
  const id = useUserId() ?? "";
  const skip = isEmpty(id);
  const { data } = useQuery<TTypes[0], TTypes[1]>(query, {
    variables: { id },
    skip,
  });
  return skip ? undefined : data?.user;
};

export const [UserContextProvider, useOptionalUser, useUser] =
  createOptionalContext<UserQuery_user>();

export const [WorkspacesContextProvider, useOptionalWorkspaces, useWorkspaces] =
  createOptionalContext<UserWithWorkspacesQuery_user_memberships_workspace[]>();

export const [WorkspaceContextProvider, useOptionalWorkspace, useWorkspace] =
  createOptionalContext<UserWithWorkspacesQuery_user_memberships_workspace>();

const MinimalUserProvider = ({ children }: PropsWithChildren<{}>) => {
  const user = useUserQuery<MinimalUserTuple>(USER_QUERY);
  return <UserContextProvider value={user}>{children}</UserContextProvider>;
};

const useWorkspaceProvider = () => {
  const workspaces = useOptionalWorkspaces();
  const workspaceSlug = useRouterQueryString("workspaceSlug");
  const workspace = useMemo(
    () => workspaces?.find(({ slug }) => slug === workspaceSlug),
    [workspaceSlug, workspaces]
  );
  if (!isNil(workspaces) && !isEmpty(workspaceSlug) && isNil(workspace)) {
    const msg = `Could not find any workspace with slug ${workspaceSlug}`;
    throw new Error(msg);
  }
  return workspace;
};

const WorkspaceProvider = ({ children }: PropsWithChildren<{}>) => (
  <WorkspaceContextProvider value={useWorkspaceProvider()}>
    {children}
  </WorkspaceContextProvider>
);

const useWorkspacesProvider = (user?: UserWithWorkspacesQuery_user) =>
  useMemo(
    () => user?.memberships.map(({ workspace }) => workspace),
    [user?.memberships]
  );

type WorkspacesProviderProps = PropsWithChildren<{
  user?: UserWithWorkspacesQuery_user;
}>;

const WorkspacesProvider = ({ user, children }: WorkspacesProviderProps) => (
  <WorkspacesContextProvider value={useWorkspacesProvider(user)}>
    <WorkspaceProvider>{children}</WorkspaceProvider>
  </WorkspacesContextProvider>
);

const WithWorkspacesUserProvider = ({ children }: PropsWithChildren<{}>) => {
  const user = useUserQuery<WithWorkspacesUserTuple>(
    USER_WITH_WORKSPACES_QUERY
  );
  return (
    <UserContextProvider value={user}>
      <WorkspacesProvider user={user}>{children}</WorkspacesProvider>
    </UserContextProvider>
  );
};

export type UserProviderProps = PropsWithChildren<{ withWorkspaces?: boolean }>;

export const UserProvider = ({ withWorkspaces, children }: UserProviderProps) =>
  withWorkspaces ? (
    <WithWorkspacesUserProvider>{children}</WithWorkspacesUserProvider>
  ) : (
    <MinimalUserProvider>{children}</MinimalUserProvider>
  );

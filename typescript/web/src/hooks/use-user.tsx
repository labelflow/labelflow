import { DocumentNode, useQuery } from "@apollo/client";
import { isEmpty, isNil } from "lodash/fp";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect, useMemo } from "react";
import { useCookies } from "react-cookie";
import { LAST_WORKSPACE_ID_COOKIE_NAME } from "../constants";
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
import { getApolloErrorMessage } from "../utils/get-apollo-error-message";
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
  const { data, error } = useQuery<TTypes[0], TTypes[1]>(query, {
    variables: { id },
    skip,
  });

  if (
    error &&
    getApolloErrorMessage(error).match(/Couldn't find an user with id/)
  ) {
    signOut({ callbackUrl: "/" });
  }
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

const useUpdateLastWorkspaceId = (): void => {
  const workspace = useOptionalWorkspace();
  const [{ lastWorkspaceId }, setLastWorkspaceId] = useCookies([
    LAST_WORKSPACE_ID_COOKIE_NAME,
  ]);
  useEffect(() => {
    const workspaceId = workspace?.id;
    if (!isEmpty(workspaceId) && lastWorkspaceId !== workspaceId) {
      setLastWorkspaceId(LAST_WORKSPACE_ID_COOKIE_NAME, workspaceId);
    }
  }, [workspace?.id, lastWorkspaceId, setLastWorkspaceId]);
};

const LastWorkspaceIdObserver = () => {
  useUpdateLastWorkspaceId();
  return <></>;
};

export const useLastWorkspaceId = (): string | undefined => {
  const [{ lastWorkspaceId }] = useCookies([LAST_WORKSPACE_ID_COOKIE_NAME]);
  return lastWorkspaceId;
};

const useWorkspaceProvider = () => {
  const workspaces = useOptionalWorkspaces();
  const workspaceSlug = useRouterQueryString("workspaceSlug");
  const workspace = useMemo(
    () => workspaces?.find(({ slug }) => slug === workspaceSlug),
    [workspaceSlug, workspaces]
  );
  const router = useRouter();
  if (!isNil(workspaces) && !isEmpty(workspaceSlug) && isNil(workspace)) {
    router.push("/404");
  }
  return workspace;
};

const WorkspaceProvider = ({ children }: PropsWithChildren<{}>) => (
  <WorkspaceContextProvider value={useWorkspaceProvider()}>
    <LastWorkspaceIdObserver />
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

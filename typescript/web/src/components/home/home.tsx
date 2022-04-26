import { isEmpty, isNil } from "lodash/fp";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useLastWorkspaceId, useOptionalWorkspaces } from "../../hooks";
import { LayoutSpinner } from "../core";
import { Workspaces } from "../workspaces";

const useLastWorkspaceIdUrl = (): string | undefined => {
  const workspaces = useOptionalWorkspaces();
  const lastWorkspaceId = useLastWorkspaceId();
  if (isNil(workspaces) || isEmpty(lastWorkspaceId)) return undefined;
  const lastWorkspace = workspaces.find(({ id }) => lastWorkspaceId === id);
  return lastWorkspace?.slug;
};

const useRedirectTo = (redirectTo: string | undefined) => {
  const router = useRouter();
  useEffect(() => {
    if (!router.isReady || isNil(redirectTo)) return;
    router.push(redirectTo);
  }, [redirectTo, router]);
};

export const Home = () => {
  const redirectTo = useLastWorkspaceIdUrl();
  useRedirectTo(redirectTo);
  return <>{isNil(redirectTo) ? <Workspaces /> : <LayoutSpinner />}</>;
};

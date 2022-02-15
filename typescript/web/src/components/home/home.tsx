import { useBoolean } from "@chakra-ui/react";
import { isEmpty, isNil } from "lodash/fp";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useLastWorkspaceId, useOptionalWorkspaces } from "../../hooks";
import { LayoutSpinner } from "../spinner";
import { CreateWorkspaceModal } from "../workspace-switcher/create-workspace-modal";
import { Workspaces } from "../workspaces";

const useLastWorkspaceUrl = (): string | undefined => {
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
  const redirectTo = useLastWorkspaceUrl();
  useRedirectTo(redirectTo);
  const [
    showCreateWorkspaceModal,
    { on: openCreateWorkspaceModal, off: closeCreateWorkspaceModal },
  ] = useBoolean(false);
  const workspaces = useOptionalWorkspaces();
  if (isNil(workspaces) || !isNil(redirectTo)) return <LayoutSpinner />;
  return (
    <>
      <Workspaces openCreateWorkspaceModal={openCreateWorkspaceModal} />
      <CreateWorkspaceModal
        isOpen={showCreateWorkspaceModal}
        onClose={closeCreateWorkspaceModal}
      />
    </>
  );
};

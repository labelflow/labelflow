import { useBoolean } from "@chakra-ui/react";
import { isNil } from "lodash/fp";
import { useOptionalWorkspaces } from "../../hooks";
import { LayoutSpinner } from "../spinner";
import { CreateWorkspaceModal } from "../workspace-switcher/create-workspace-modal";
import { Workspaces } from "../workspaces";

export const Home = () => {
  const [
    showCreateWorkspaceModal,
    { on: openCreateWorkspaceModal, off: closeCreateWorkspaceModal },
  ] = useBoolean(false);
  const workspaces = useOptionalWorkspaces();
  if (isNil(workspaces)) return <LayoutSpinner />;
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

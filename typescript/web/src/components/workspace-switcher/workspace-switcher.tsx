import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { StringParam, useQueryParams } from "use-query-params";
import { useWorkspaces } from "../../hooks";
import { BoolParam } from "../../utils/query-param-bool";
import { CreateWorkspaceModal } from "./create-workspace-modal";
import { WorkspaceMenu } from "./workspace-menu";
import { WorkspaceItem } from "./workspace-menu/workspace-selection-popover";

export const WorkspaceSwitcher = () => {
  const workspaces = useWorkspaces();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const [{ "modal-create-workspace": isCreationModalOpen }, setQueryParams] =
    useQueryParams({
      "modal-create-workspace": BoolParam,
      "workspace-name": StringParam,
    });

  const setSelectedWorkspace = useCallback(
    (workspace: WorkspaceItem) => {
      const slug = workspace?.slug;
      if (slug !== null) {
        router.push(`/${slug}`);
      }
    },
    [router]
  );

  const createNewWorkspace = useCallback(
    async (name: string) => {
      setQueryParams(
        { "modal-create-workspace": true, "workspace-name": name },
        "replaceIn"
      );
    },
    [setQueryParams]
  );

  if (workspaces == null) {
    return null;
  }

  return (
    <>
      <WorkspaceMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSelectedWorkspaceChange={setSelectedWorkspace}
        createNewWorkspace={createNewWorkspace}
      />
      <CreateWorkspaceModal
        isOpen={isCreationModalOpen}
        onClose={() => {
          setQueryParams(
            { "modal-create-workspace": false, "workspace-name": null },
            "replaceIn"
          );
        }}
      />
    </>
  );
};

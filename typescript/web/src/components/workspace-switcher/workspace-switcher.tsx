import { useState, useCallback } from "react";
import { WorkspaceMenu } from "./workspace-menu";

import { WorkspaceItem } from "./workspace-menu/workspace-selection-popover";

const workspaces: WorkspaceItem[] = [
  {
    id: "coaisndoiasndi1",
    slug: "labelflow",
    name: "LabelFlow",
    src: "https://labelflow.ai/static/icon-512x512.png",
  },
  {
    id: "coaisndoiasndi2",
    slug: "sterblue",
    name: "Sterblue",
    src: "https://labelflow.ai/static/img/sterblue-logo.png",
  },
];

export const WorkspaceSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceItem>(
    workspaces[0]
  );
  const createNewWorkspace = useCallback(() => {
    alert("Create workspace");
  }, []);
  return (
    <WorkspaceMenu
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      workspaces={workspaces}
      onSelectedWorkspaceChange={(workspace: WorkspaceItem) =>
        setSelectedWorkspace(workspace)
      }
      createNewWorkspace={createNewWorkspace}
      selectedWorkspace={selectedWorkspace}
    />
  );
};

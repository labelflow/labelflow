import { Button, useDisclosure } from "@chakra-ui/react";
import { WorkspaceSelectionPopover } from "../workspace-selection-popover";
import { chakraDecorator } from "../../../../../utils/chakra-decorator";

export default {
  title: "web/Workspace Switcher/Workspace selection popover",
  decorators: [chakraDecorator],
};

const workspaces = [
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

const createNewWorkspace = (name: string): void => {
  alert(`New workspace: ${name}`);
};

export const Default = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <WorkspaceSelectionPopover
        trigger={<Button onClick={onOpen}>Display</Button>}
        isOpen={isOpen}
        onClose={onClose}
        workspaces={workspaces}
        onSelectedWorkspaceChange={console.log}
        createNewWorkspace={createNewWorkspace}
      />
    </div>
  );
};

export const OpenedByDefault = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  return (
    <div>
      <WorkspaceSelectionPopover
        trigger={<Button onClick={onOpen}>Display</Button>}
        isOpen={isOpen}
        onClose={onClose}
        workspaces={workspaces}
        onSelectedWorkspaceChange={console.log}
        createNewWorkspace={createNewWorkspace}
      />
    </div>
  );
};

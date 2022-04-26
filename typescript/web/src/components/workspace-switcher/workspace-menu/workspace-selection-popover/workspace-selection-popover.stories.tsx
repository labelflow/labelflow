import { Button, useDisclosure } from "@chakra-ui/react";
import {
  USER_WITH_WORKSPACES_QUERY_MOCK,
  WORKSPACE_DATA,
} from "../../../../utils/fixtures";
import {
  createCommonDecorator,
  storybookTitle,
} from "../../../../utils/stories";
import { WorkspaceSelectionPopover } from "./workspace-selection-popover";

export default {
  title: storybookTitle(
    "Workspaces",
    "Workspace Switcher",
    WorkspaceSelectionPopover
  ),
  decorators: [
    createCommonDecorator({
      auth: { withWorkspaces: true },
      apollo: { extraMocks: [USER_WITH_WORKSPACES_QUERY_MOCK] },
      router: { query: { workspaceSlug: WORKSPACE_DATA.slug } },
    }),
  ],
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

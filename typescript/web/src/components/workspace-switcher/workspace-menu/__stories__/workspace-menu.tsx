import { useState, ComponentProps } from "react";

import { HStack, Button, Flex } from "@chakra-ui/react";
import { WorkspaceMenu } from "../workspace-menu";
import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { WorkspaceItem } from "../workspace-selection-popover";

export default {
  title: "web/Workspace menu",
  decorators: [chakraDecorator],
};

const Template = (args: ComponentProps<typeof WorkspaceMenu>) => (
  <HStack background="gray.100" padding={4} spacing={4}>
    <WorkspaceMenu {...args} />
    <Button variant="solid" background="white" color="gray.800">
      Button just to compare
    </Button>
    <Flex> </Flex>
  </HStack>
);

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

const createNewWorkspace = (name: string): void => {
  alert(`New label class created: ${name}`);
};

export const Default = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedLabel, setSelectedWorkspace] = useState<WorkspaceItem>(
    workspaces[0]
  );
  return (
    <Template
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      workspaces={workspaces}
      onSelectedWorkspaceChange={(workspace: WorkspaceItem) =>
        setSelectedWorkspace(workspace)
      }
      createNewWorkspace={createNewWorkspace}
      selectedWorkspace={selectedLabel}
    />
  );
};

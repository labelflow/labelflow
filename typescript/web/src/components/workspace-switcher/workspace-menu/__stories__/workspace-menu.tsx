import { BreadcrumbLink, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import { chakraDecorator, storybookTitle } from "../../../../utils/storybook";
import { ResponsiveBreadcrumbs } from "../../../layout/top-bar/breadcrumbs/responsive-breadcrumbs";
import { WorkspaceMenu } from "../workspace-menu";
import { WorkspaceItem } from "../workspace-selection-popover";

export default {
  title: storybookTitle("Workspace Switcher", WorkspaceMenu),
  decorators: [chakraDecorator],
};

const workspaces: (WorkspaceItem & { src: string })[] = [
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
  alert(`New label workspace created: ${name}`);
};

export const Normal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceItem>(
    workspaces[0]
  );
  return (
    <ResponsiveBreadcrumbs>
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

      <NextLink href="/test/datasets">
        <BreadcrumbLink>Datasets</BreadcrumbLink>
      </NextLink>

      <NextLink href="/test/datasets/xxx">
        <BreadcrumbLink>Hello</BreadcrumbLink>
      </NextLink>

      <NextLink href="/test/datasets/xxx/images">
        <BreadcrumbLink>Images</BreadcrumbLink>
      </NextLink>

      <Text>World</Text>
    </ResponsiveBreadcrumbs>
  );
};

import { useState } from "react";
import { BreadcrumbLink, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { WorkspaceMenu } from "../workspace-menu";
import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { WorkspaceItem } from "../workspace-selection-popover";
import { ResponsiveBreadcrumbs } from "../../../layout/top-bar/breadcrumbs/responsive-breadcrumbs";

export default {
  title: "web/Workspace Switcher/Workspace menu in breadcrumbs",
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

      <NextLink href="/local/datasets">
        <BreadcrumbLink>Datasets</BreadcrumbLink>
      </NextLink>

      <NextLink href="/local/datasets/xxx">
        <BreadcrumbLink>Hello</BreadcrumbLink>
      </NextLink>

      <NextLink href="/local/datasets/xxx/images">
        <BreadcrumbLink>Images</BreadcrumbLink>
      </NextLink>

      <Text>World</Text>
    </ResponsiveBreadcrumbs>
  );
};

import { BreadcrumbLink, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import { chakraDecorator, storybookTitle } from "../../../utils/stories";
import { ResponsiveBreadcrumbs } from "../../layout/top-bar/breadcrumbs/responsive-breadcrumbs";
import { WorkspaceMenu } from "./workspace-menu";

export default {
  title: storybookTitle("Workspace Switcher", WorkspaceMenu),
  decorators: [chakraDecorator],
};

const createNewWorkspace = (name: string): void => {
  alert(`New label workspace created: ${name}`);
};

export const Normal = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <ResponsiveBreadcrumbs>
      <WorkspaceMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSelectedWorkspaceChange={() => {}}
        createNewWorkspace={createNewWorkspace}
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

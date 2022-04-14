import { BreadcrumbLink, Skeleton, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { USER_WITH_WORKSPACES_QUERY_MOCK } from "../../../utils/fixtures/user.fixtures";
import { WORKSPACE_DATA } from "../../../utils/fixtures/workspace.fixtures";
import { createCommonDecorator, storybookTitle } from "../../../utils/stories";
import { NavLogo } from "../../logo/nav-logo";
import { WorkspaceMenu } from "../../workspace-switcher/workspace-menu/workspace-menu";
import { TopBar } from "./top-bar";

export default {
  title: storybookTitle("TopBar", TopBar),
  decorators: [
    createCommonDecorator({
      auth: { withWorkspaces: true },
      apollo: { extraMocks: [USER_WITH_WORKSPACES_QUERY_MOCK] },
      router: { query: { workspaceSlug: WORKSPACE_DATA.slug } },
    }),
  ],
};

export const Normal = () => (
  <TopBar
    breadcrumbs={[
      <NavLogo />,
      <BreadcrumbLink>Datasets</BreadcrumbLink>,
      <BreadcrumbLink>
        <Text>My dataset name</Text>
      </BreadcrumbLink>,
      <BreadcrumbLink>
        <Text>Images</Text>
      </BreadcrumbLink>,
      <Text>My image name</Text>,
    ]}
  />
);

export const Loading = () => (
  <TopBar
    breadcrumbs={[
      <NavLogo />,
      <BreadcrumbLink>Datasets</BreadcrumbLink>,
      <BreadcrumbLink>
        <Skeleton>My dataset name</Skeleton>
      </BreadcrumbLink>,
      <BreadcrumbLink>
        <Text>Images</Text>
      </BreadcrumbLink>,
      <Skeleton>My image name</Skeleton>,
    ]}
  />
);

export const LongNames = () => (
  <TopBar
    breadcrumbs={[
      <NavLogo />,
      <BreadcrumbLink>Datasets</BreadcrumbLink>,
      <BreadcrumbLink>
        <Text>
          My very long dataset name to see how responsive are the breadcrumbs
        </Text>
      </BreadcrumbLink>,
      <BreadcrumbLink>
        <Text>Images</Text>
      </BreadcrumbLink>,
      <Text>
        My very long image name to see how responsive are the breadcrumbs
      </Text>,
    ]}
  />
);

export const WithWorkspaceSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <TopBar
      breadcrumbs={[
        <NavLogo />,
        <WorkspaceMenu
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onSelectedWorkspaceChange={() => {}}
          createNewWorkspace={() => {}}
        />,
        <BreadcrumbLink>Datasets</BreadcrumbLink>,
        <BreadcrumbLink>
          <Text>My dataset name</Text>
        </BreadcrumbLink>,
        <BreadcrumbLink>
          <Text>Images</Text>
        </BreadcrumbLink>,
        <Text>My image name</Text>,
      ]}
    />
  );
};

export const WithWorkspaceSwitcherAndLoading = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <TopBar
      breadcrumbs={[
        <NavLogo />,
        <WorkspaceMenu
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onSelectedWorkspaceChange={() => {}}
          createNewWorkspace={() => {}}
        />,
        <BreadcrumbLink>Datasets</BreadcrumbLink>,
        <BreadcrumbLink>
          <Skeleton>My dataset name</Skeleton>
        </BreadcrumbLink>,
        <BreadcrumbLink>
          <Text>Images</Text>
        </BreadcrumbLink>,
        <Skeleton>My image name</Skeleton>,
      ]}
    />
  );
};

export const WithWorkspaceSwitcherAndLongNames = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <TopBar
      breadcrumbs={[
        <NavLogo />,
        <WorkspaceMenu
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onSelectedWorkspaceChange={() => {}}
          createNewWorkspace={() => {}}
        />,
        <BreadcrumbLink>Datasets</BreadcrumbLink>,
        <BreadcrumbLink>
          <Text>
            My very long dataset name to see how responsive are the breadcrumbs
          </Text>
        </BreadcrumbLink>,
        <BreadcrumbLink>
          <Text>Images</Text>
        </BreadcrumbLink>,
        <Text>
          My very long image name to see how responsive are the breadcrumbs
        </Text>,
      ]}
    />
  );
};

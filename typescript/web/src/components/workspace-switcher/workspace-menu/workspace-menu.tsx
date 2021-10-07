import React, { forwardRef } from "react";
import {
  Tooltip,
  Text,
  Button,
  Avatar,
  BreadcrumbLink,
  chakra,
  useBreakpointValue,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { HiSelector } from "react-icons/hi";
import { RiGroupFill } from "react-icons/ri";

import {
  WorkspaceSelectionPopover,
  WorkspaceItem,
} from "./workspace-selection-popover";

const TeamIcon = chakra(RiGroupFill);

const SelectorIcon = chakra(HiSelector);

const WorkspaceBreadcrumb = forwardRef<
  null,
  {
    selectedWorkspace: WorkspaceItem;
  }
>(({ selectedWorkspace }: { selectedWorkspace: WorkspaceItem }, ref) => {
  const avaterBorderColor = mode("gray.200", "gray.700");
  const avatarBackground = mode("white", "gray.700");

  const { name, slug } = selectedWorkspace;

  // eslint-disable-next-line no-prototype-builtins
  const src = selectedWorkspace.hasOwnProperty("src")
    ? (selectedWorkspace as { name: string; src?: string }).src
    : undefined;

  const largeBreadcrumb = (
    <NextLink href={`/${slug}`}>
      <BreadcrumbLink
        justifyContent="space-between"
        alignItems="center"
        flexDirection="row"
        display="flex"
        mr="2"
        ref={ref}
      >
        <Avatar
          borderWidth="1px"
          borderColor={avaterBorderColor}
          size="md"
          h="8"
          w="8"
          borderRadius="md"
          flexShrink={0}
          flexGrow={0}
          name={name}
          src={src}
          mr="2"
          bg={src != null ? avatarBackground : "gray.400"}
          icon={<TeamIcon color="white" fontSize="1rem" />}
        />
        <Text
          flexGrow={1}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {selectedWorkspace?.name ?? "Unnamed Workspace"}
        </Text>
      </BreadcrumbLink>
    </NextLink>
  );

  const smallBreadcrumb = (
    <BreadcrumbLink
      justifyContent="space-between"
      alignItems="center"
      flexDirection="row"
      display="flex"
      mr="2"
    >
      <Tooltip
        label={`Navigate to ${
          selectedWorkspace?.name ?? "Unnamed Workspace"
        } workspace`}
        placement="bottom"
        openDelay={1000}
      >
        <Avatar
          borderWidth="1px"
          borderColor={avaterBorderColor}
          size="md"
          h="8"
          w="8"
          borderRadius="md"
          flexShrink={0}
          flexGrow={0}
          name={name}
          src={src}
          bg={src != null ? avatarBackground : "gray.400"}
          icon={<TeamIcon color="white" fontSize="1rem" />}
        />
      </Tooltip>
    </BreadcrumbLink>
  );

  const result =
    useBreakpointValue({
      base: smallBreadcrumb,
      md: largeBreadcrumb,
    }) ?? largeBreadcrumb;
  return result;
});

const WorkspaceSelectionButton = forwardRef<
  null,
  {
    selectedWorkspace: WorkspaceItem;
    toggle: () => void;
  }
>(({ selectedWorkspace, toggle }, ref) => {
  return (
    <Tooltip
      label={`Change workspace (currently on ${
        selectedWorkspace?.name ?? "Unnamed Workspace"
      })`}
      placement="bottom"
      openDelay={1000}
    >
      <Button
        ref={ref}
        size="sm"
        minW="6"
        px="0"
        onClick={toggle}
        bg={mode("white", "gray.800")}
        aria-label="Open workspace selection popover"
      >
        <SelectorIcon fontSize="md" px="0" mx="0" />
      </Button>
    </Tooltip>
  );
});

export const WorkspaceMenu = ({
  isOpen,
  setIsOpen,
  workspaces,
  onSelectedWorkspaceChange,
  createNewWorkspace,
  selectedWorkspace,
}: {
  isOpen: boolean;
  setIsOpen: (b: boolean) => void;
  workspaces: WorkspaceItem[];
  onSelectedWorkspaceChange: (item: WorkspaceItem) => void;
  createNewWorkspace: (name: string) => void;
  selectedWorkspace: WorkspaceItem;
}) => {
  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  return (
    <>
      <WorkspaceSelectionPopover
        ariaLabel="Workspace selection menu popover"
        isOpen={isOpen}
        onClose={close}
        workspaces={workspaces}
        onSelectedWorkspaceChange={(item: WorkspaceItem) => {
          onSelectedWorkspaceChange(item);
          close();
        }}
        createNewWorkspace={(name: string) => {
          createNewWorkspace(name);
          close();
        }}
        selectedWorkspaceId={selectedWorkspace?.id ?? null}
        trigger={<WorkspaceBreadcrumb selectedWorkspace={selectedWorkspace} />}
      />
      <WorkspaceSelectionButton
        toggle={toggle}
        selectedWorkspace={selectedWorkspace}
      />
    </>
  );
};

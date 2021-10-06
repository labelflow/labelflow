import React from "react";
import {
  Tooltip,
  Text,
  Flex,
  Button,
  Avatar,
  IconButton,
  BreadcrumbLink,
  chakra,
  useBreakpointValue,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { HiSelector } from "react-icons/hi";
import { RiGroupFill } from "react-icons/ri";

import {
  WorkspaceSelectionPopover,
  WorkspaceItem,
} from "./workspace-selection-popover";

const TeamIcon = chakra(RiGroupFill);

const SelectorIcon = chakra(HiSelector);

const WorkspaceSelectionButton = React.forwardRef<
  null,
  {
    selectedWorkspace: WorkspaceItem;
    toggle: () => void;
  }
>(({ selectedWorkspace, toggle }, ref) => {
  return (
    <Button
      ref={ref}
      size="md"
      minW="8"
      px="0"
      onClick={toggle}
      bg={mode("white", "gray.800")}
      aria-label="Open workspace selection popover"
    >
      <Tooltip
        label={`Change workspace (currently on ${
          selectedWorkspace?.name ?? "Unnamed Workspace"
        })`}
        placement="bottom"
        openDelay={1000}
      >
        <SelectorIcon fontSize="md" px="0" mx="0" />
      </Tooltip>
    </Button>
  );
});

const WorkspaceBreadcrumb = React.forwardRef<
  null,
  {
    selectedWorkspace: WorkspaceItem;
  }
>(({ selectedWorkspace }, ref) => {
  const avaterBorderColor = mode("gray.200", "gray.700");
  const avatarBackground = mode("white", "gray.900");

  const { name } = selectedWorkspace;

  // eslint-disable-next-line no-prototype-builtins
  const src = selectedWorkspace.hasOwnProperty("src")
    ? (selectedWorkspace as { name: string; src?: string }).src
    : undefined;

  const largeBreadcrumb = (
    <BreadcrumbLink
      justifyContent="space-between"
      alignItems="center"
      flexDirection="row"
      display="flex"
      mr="2"
    >
      <Avatar
        borderWidth="1px"
        borderColor={avaterBorderColor}
        size="md"
        h="10"
        w="10"
        borderRadius="lg"
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
        label={`Change workspace (currently on ${
          selectedWorkspace?.name ?? "Unnamed Workspace"
        })`}
        placement="bottom"
        openDelay={1000}
      >
        <Avatar
          borderWidth="1px"
          borderColor={avaterBorderColor}
          size="md"
          h="10"
          w="10"
          borderRadius="lg"
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
      <WorkspaceBreadcrumb selectedWorkspace={selectedWorkspace} />
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
        trigger={
          <WorkspaceSelectionButton
            toggle={toggle}
            selectedWorkspace={selectedWorkspace}
          />
        }
      />
    </>
  );
};

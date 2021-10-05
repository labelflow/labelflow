import React from "react";
import {
  Tooltip,
  Text,
  Flex,
  Button,
  Avatar,
  IconButton,
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
  const avaterBorderColor = mode("gray.200", "gray.700");
  const avatarBackground = mode("white", "gray.900");

  const { name } = selectedWorkspace;

  // eslint-disable-next-line no-prototype-builtins
  const src = selectedWorkspace.hasOwnProperty("src")
    ? (selectedWorkspace as { name: string; src?: string }).src
    : undefined;

  const largeButton = (
    <Button
      rightIcon={<SelectorIcon fontSize="md" />}
      minW="60"
      justifyContent="space-between"
      ref={ref}
      onClick={toggle}
      bg={mode("white", "gray.800")}
      pointerEvents="initial"
      aria-label="Open workspace selection popover"
    >
      <Tooltip
        label={`Selected workspace (${selectedWorkspace?.name ?? "None"})`}
        placement="bottom"
        openDelay={1000}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Avatar
            borderWidth="1px"
            borderColor={avaterBorderColor}
            size="sm"
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
        </Flex>
      </Tooltip>
    </Button>
  );

  const smallButton = (
    <IconButton
      icon={
        <Avatar
          borderWidth="1px"
          borderColor={avaterBorderColor}
          size="sm"
          borderRadius="lg"
          flexShrink={0}
          flexGrow={0}
          name={name}
          src={src}
          ml="2"
          mr="2"
          bg={src != null ? avatarBackground : "gray.400"}
          icon={<TeamIcon color="white" fontSize="1rem" />}
        />
      }
      ref={ref}
      onClick={toggle}
      bg={mode("white", "gray.800")}
      pointerEvents="initial"
      aria-label="Open workspace selection popover"
    />
  );

  const result =
    useBreakpointValue({
      base: smallButton,
      md: largeButton,
    }) ?? largeButton;
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
  );
};

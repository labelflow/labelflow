import {
  Avatar,
  Box,
  BreadcrumbLink,
  Button,
  chakra,
  Text,
  Tooltip,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { isEmpty } from "lodash/fp";
import NextLink from "next/link";
import React, { forwardRef } from "react";
import { HiSelector } from "react-icons/hi";
import { RiGroupFill } from "react-icons/ri";
import { useWorkspace } from "../../../hooks";
import { randomBackgroundGradient } from "../../../utils/random-background-gradient";
import {
  WorkspaceItem,
  WorkspaceSelectionPopover,
} from "./workspace-selection-popover";

const TeamIcon = chakra(RiGroupFill);

const SelectorIcon = chakra(HiSelector);

const WorkspaceBreadcrumb = forwardRef<null, {}>((_noProps, ref) => {
  const avatarBorderColor = useColorModeValue("gray.200", "gray.700");
  const avatarBackgroundColor = useColorModeValue("white", "gray.700");

  const { slug, name, image } = useWorkspace();

  const avatarImage = image ?? undefined;
  const avatarBackground = isEmpty(image)
    ? randomBackgroundGradient(name)
    : avatarBackgroundColor;

  const largeBreadcrumb = (
    <NextLink href={`/${slug}`}>
      <BreadcrumbLink
        justifyContent="space-between"
        alignItems="center"
        flexDirection="row"
        display="flex"
        mr="1"
        ref={ref}
      >
        <Avatar
          borderWidth="1px"
          borderColor={avatarBorderColor}
          size="md"
          h="8"
          w="8"
          color="white"
          borderRadius="md"
          flexShrink={0}
          flexGrow={0}
          name={name}
          src={avatarImage}
          mr="2"
          bg={avatarBackground}
          icon={<TeamIcon color="white" fontSize="1rem" />}
        />
        <Text
          flexGrow={1}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {name}
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
      mr="1"
    >
      <Tooltip
        label={`Navigate to ${name} workspace`}
        placement="bottom"
        openDelay={1000}
      >
        <Avatar
          borderWidth="1px"
          borderColor={avatarBorderColor}
          size="md"
          h="8"
          w="8"
          color="white"
          borderRadius="md"
          flexShrink={0}
          flexGrow={0}
          name={name}
          src={avatarImage}
          bg={avatarBackground}
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
    toggle: () => void;
  }
>(({ toggle }, ref) => {
  return (
    <Button
      ref={ref}
      size="sm"
      minW="6"
      px="0"
      mr="-1"
      onClick={toggle}
      bg={useColorModeValue("white", "gray.800")}
      aria-label="Open workspace selection popover"
    >
      <SelectorIcon fontSize="md" px="0" mx="0" />
    </Button>
  );
});

export const WorkspaceMenu = ({
  isOpen,
  setIsOpen,
  onSelectedWorkspaceChange,
  createNewWorkspace,
}: {
  isOpen: boolean;
  setIsOpen: (b: boolean) => void;
  onSelectedWorkspaceChange: (item: WorkspaceItem) => void;
  createNewWorkspace: (name: string) => void;
}) => {
  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);
  return (
    <>
      <WorkspaceSelectionPopover
        ariaLabel="Workspace selection menu popover"
        isOpen={isOpen}
        onClose={close}
        onSelectedWorkspaceChange={(item: WorkspaceItem) => {
          onSelectedWorkspaceChange(item);
          close();
        }}
        createNewWorkspace={(name: string) => {
          createNewWorkspace(name);
          close();
        }}
        trigger={<Box width="0" height="8" />}
      />
      <WorkspaceBreadcrumb />
      <WorkspaceSelectionButton toggle={toggle} />
    </>
  );
};

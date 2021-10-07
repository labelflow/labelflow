import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  Box,
  Popover,
  useColorModeValue as mode,
  PopoverContent,
  PopoverBody,
  PopoverTrigger,
  Kbd,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  chakra,
  Text,
} from "@chakra-ui/react";
import { IoSearch } from "react-icons/io5";
import { RiCloseCircleFill } from "react-icons/ri";
import { useCombobox, UseComboboxStateChange } from "downshift";

import { Workspace } from "@labelflow/graphql-types";
import { WorkspaceListItem } from "./workspace-list-item";

type CreateWorkspaceInput = { name: string; type: string };

// The popover doesn't need all the attributes of the label workspace
export type WorkspaceItem = Pick<Workspace, "slug" | "name" | "id">;

const MagnifierIcon = chakra(IoSearch);
const CloseCircleIcon = chakra(RiCloseCircleFill);

const filterWorkspaces = ({
  workspaces,
  inputValueCombobox,
}: {
  workspaces: WorkspaceItem[];
  inputValueCombobox: string;
}): (WorkspaceItem | CreateWorkspaceInput)[] => {
  const createWorkspaceItem =
    workspaces.filter(
      (workspace: WorkspaceItem) => workspace.name === inputValueCombobox
    ).length === 0
      ? [{ name: inputValueCombobox, type: "CreateWorkspaceItem" }]
      : [];

  const filteredWorkspaces = workspaces.filter((workspace: WorkspaceItem) => {
    return workspace.name
      .toLowerCase()
      .startsWith((inputValueCombobox ?? "").toLowerCase());
  });

  return [...filteredWorkspaces, ...createWorkspaceItem];
};

export const WorkspaceSelectionPopover = ({
  isOpen,
  onClose = () => {},
  onSelectedWorkspaceChange,
  createNewWorkspace,
  workspaces,
  selectedWorkspaceId,
  trigger,
  ariaLabel = "Workspace selection popover",
}: {
  isOpen?: boolean;
  onClose?: () => void;
  onSelectedWorkspaceChange: (item: WorkspaceItem) => void;
  workspaces: WorkspaceItem[];
  createNewWorkspace: (name: string) => void;
  selectedWorkspaceId?: string | null;
  trigger?: React.ReactNode;
  ariaLabel?: string;
}) => {
  const [inputValueCombobox, setInputValueCombobox] = useState<string>("");

  const filteredWorkspaces = useMemo(
    () =>
      filterWorkspaces({
        workspaces,
        inputValueCombobox,
      }),
    [workspaces, inputValueCombobox]
  );

  const {
    reset,
    inputValue,
    getMenuProps,
    getInputProps,
    getLabelProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    itemToString: (item: { name: string } | null): string => item?.name ?? "",
    items: filteredWorkspaces,
    onInputValueChange: ({ inputValue: newInputValue }) => {
      return setInputValueCombobox(newInputValue ?? "");
    },
    onSelectedItemChange: ({
      selectedItem,
    }: UseComboboxStateChange<WorkspaceItem | CreateWorkspaceInput>): void => {
      if (
        selectedItem != null &&
        "type" in selectedItem &&
        selectedItem?.type === "CreateWorkspaceItem"
      ) {
        return createNewWorkspace(selectedItem.name);
      }

      if (selectedItem != null && "id" in selectedItem) {
        return onSelectedWorkspaceChange(selectedItem);
      }
      return undefined;
    },
    defaultHighlightedIndex: 0,
  });
  // We reset the combobox state when opening it because if we do it on close there is a flash visible due to the fact that the reset happens before the popover is closed
  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen]);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // useEffect(() => {
  //   console.log("isOpen", isOpen, searchInputRef.current);
  //   if (isOpen && searchInputRef.current != null) {
  //     console.log("Ok");
  //     searchInputRef.current.focus();
  //   }
  // }, [isOpen]);

  const closeCircleIconColor = mode("gray.300", "gray.500");
  const borderColor = mode("gray.200", "gray.600");
  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      placement="bottom-start"
      preventOverflow
      isLazy
      initialFocusRef={searchInputRef}
    >
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent
        borderColor={borderColor}
        cursor="default"
        pointerEvents="initial"
        aria-label={ariaLabel}
      >
        <PopoverBody pl="0" pr="0" pt="0">
          <Box>
            <Box {...getComboboxProps()} pl="3" pr="3" pt="3">
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <MagnifierIcon fontSize="2xl" />
                </InputLeftElement>
                {/* Visually hidden accessible label. See: https://www.w3.org/WAI/tutorials/forms/labels/#hiding-label-text */}
                <Text
                  as="label"
                  {...getLabelProps()}
                  border={0}
                  clip="rect(0 0 0 0)"
                  height="1px"
                  margin="-1px"
                  overflow="hidden"
                  padding={0}
                  position="absolute"
                  width="1px"
                >
                  Search in workspace selection popover
                </Text>
                <Input
                  {...getInputProps({ ref: searchInputRef })}
                  name="workspace-selection-search"
                  placeholder="Search..."
                  pr="4rem"
                />
                <InputRightElement
                  width="4rem"
                  justifyContent="flex-end"
                  pr="2"
                >
                  {inputValue && (
                    <>
                      <CloseCircleIcon
                        fontSize="2xl"
                        onClick={reset}
                        cursor="pointer"
                        color={closeCircleIconColor}
                      />
                      <Kbd fontSize="md">↩</Kbd>
                    </>
                  )}
                </InputRightElement>
              </InputGroup>
            </Box>
            <Box pt="1" {...getMenuProps()} overflowY="scroll" maxHeight="340">
              {filteredWorkspaces.map(
                (item: WorkspaceItem | CreateWorkspaceInput, index: number) => {
                  return (
                    <WorkspaceListItem
                      itemProps={getItemProps({ item, index })}
                      item={item}
                      highlight={highlightedIndex === index}
                      selected={"id" in item && item.id === selectedWorkspaceId}
                      isCreateWorkspaceItem={
                        "type" in item && item.type === "CreateWorkspaceItem"
                      }
                      index={index}
                      key={item.name}
                    />
                  );
                }
              )}
            </Box>
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

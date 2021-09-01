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
import { useHotkeys } from "react-hotkeys-hook";
import { LabelClass } from "@labelflow/graphql-types";
import { ClassListItem } from "./class-list-item";
import { noneClassColor } from "../../utils/class-color-generator";
import { keymap } from "../../keymap";

type CreateClassInput = { name: string; type: string };
type NoneClass = { name: string; color: string; type: string };
// The popover doesn't need all the attributes of the label class
export type LabelClassItem = Omit<LabelClass, "datasetId">;

const noneClass = {
  name: "None",
  type: "NoneClass",
  color: noneClassColor,
};

const MagnifierIcon = chakra(IoSearch);
const CloseCircleIcon = chakra(RiCloseCircleFill);

const filterLabelClasses = ({
  labelClasses,
  inputValueCombobox,
}: {
  labelClasses: LabelClassItem[];
  inputValueCombobox: string;
}): (LabelClassItem | CreateClassInput | NoneClass)[] => {
  const labelClassesWithNoneClass = [...labelClasses, noneClass];
  const createClassItem =
    inputValueCombobox &&
    labelClassesWithNoneClass.filter(
      (labelClass: LabelClassItem | NoneClass) =>
        labelClass.name === inputValueCombobox
    ).length === 0
      ? [{ name: inputValueCombobox, type: "CreateClassItem" }]
      : [];

  const filteredLabelClasses = labelClassesWithNoneClass.filter(
    (labelClass: LabelClassItem | NoneClass) => {
      return labelClass.name
        .toLowerCase()
        .startsWith((inputValueCombobox ?? "").toLowerCase());
    }
  );

  return [...filteredLabelClasses, ...createClassItem];
};

export const ClassSelectionPopover = ({
  isOpen,
  onClose = () => {},
  onSelectedClassChange,
  createNewClass,
  labelClasses,
  selectedLabelClassId,
  trigger,
  activateShortcuts,
  ariaLabel = "Class selection popover",
}: {
  isOpen?: boolean;
  onClose?: () => void;
  onSelectedClassChange: (item: LabelClassItem | null) => void;
  labelClasses: LabelClassItem[];
  createNewClass: (name: string) => void;
  selectedLabelClassId?: string | null;
  trigger?: React.ReactNode;
  activateShortcuts?: boolean;
  ariaLabel?: string;
}) => {
  const [inputValueCombobox, setInputValueCombobox] = useState<string>("");
  const labelClassesWithShortcut = useMemo(
    () =>
      labelClasses.map((labelClass, index) => {
        if (index > 9) {
          return labelClass;
        }
        return {
          ...labelClass,
          shortcut: `${(index + 1) % 10}`,
        };
      }),
    [labelClasses]
  );
  const filteredLabelClasses = useMemo(
    () =>
      filterLabelClasses({
        labelClasses: labelClassesWithShortcut,
        inputValueCombobox,
      }),
    [labelClasses, inputValueCombobox]
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
    items: filteredLabelClasses,
    onInputValueChange: ({ inputValue: newInputValue }) => {
      return setInputValueCombobox(newInputValue ?? "");
    },
    onSelectedItemChange: ({
      selectedItem,
    }: UseComboboxStateChange<
      LabelClassItem | CreateClassInput | NoneClass
    >): void => {
      if (
        selectedItem != null &&
        "type" in selectedItem &&
        selectedItem?.type === "CreateClassItem"
      ) {
        return createNewClass(selectedItem.name);
      }
      if (
        selectedItem != null &&
        "type" in selectedItem &&
        selectedItem?.type === "NoneClass"
      ) {
        return onSelectedClassChange(null);
      }
      if (selectedItem != null && "id" in selectedItem) {
        return onSelectedClassChange(selectedItem);
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

  useHotkeys(
    // "/" key doesn't seem to be recognized on AZERTY keyboards, so we use "*" to catch any input.
    "*",
    (keyboardEvent) => {
      if (
        // Manually checks if input is bound in keymap
        keymap.focusLabelClassSearch.key
          .split(",")
          .includes(keyboardEvent.key) &&
        activateShortcuts &&
        searchInputRef.current != null
      ) {
        searchInputRef.current.focus();
        keyboardEvent.preventDefault();
      }
    },
    {},
    [activateShortcuts]
  );
  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      placement="bottom-start"
      preventOverflow
    >
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent
        borderColor={mode("gray.200", "gray.600")}
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
                  Search in class selection popover
                </Text>
                <Input
                  {...getInputProps({ ref: searchInputRef })}
                  name="class-selection-search"
                  placeholder="Search or Add..."
                  pr="4rem"
                />
                <InputRightElement
                  width="4rem"
                  justifyContent="flex-end"
                  pr="2"
                >
                  {inputValue ? (
                    <>
                      <CloseCircleIcon
                        fontSize="2xl"
                        onClick={reset}
                        cursor="pointer"
                        color={mode("gray.300", "gray.500")}
                      />
                      <Kbd fontSize="md">↩</Kbd>
                    </>
                  ) : (
                    <Kbd>/</Kbd>
                  )}
                </InputRightElement>
              </InputGroup>
            </Box>
            <Box pt="1" {...getMenuProps()} overflowY="scroll" maxHeight="340">
              {filteredLabelClasses.map(
                (
                  item: LabelClassItem | CreateClassInput | NoneClass,
                  index: number
                ) => {
                  return (
                    <ClassListItem
                      itemProps={getItemProps({ item, index })}
                      item={item}
                      highlight={highlightedIndex === index}
                      selected={
                        ("id" in item && item.id === selectedLabelClassId) ||
                        (selectedLabelClassId === null &&
                          "type" in item &&
                          item.type === "NoneClass")
                      }
                      isCreateClassItem={
                        "type" in item && item.type === "CreateClassItem"
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

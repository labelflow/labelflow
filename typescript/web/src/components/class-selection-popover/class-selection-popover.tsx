import {
  Box,
  chakra,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Kbd,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useCombobox, UseComboboxStateChange } from "downshift";
import { isNil } from "lodash/fp";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { RiCloseCircleFill } from "react-icons/ri";
import { useVirtual } from "react-virtual";
import { GetLabelClassesOfDatasetQuery_dataset_labelClasses } from "../../graphql-types/GetLabelClassesOfDatasetQuery";
import { useSearchHotkeys } from "../../hooks";
import { noneClassColor } from "../../theme";
import { ClassListItem } from "./class-list-item";

type CreateClassInput = { name: string; type: string };
type NoneClass = { name: string; color: string; type: string };
export type LabelClassItem = GetLabelClassesOfDatasetQuery_dataset_labelClasses;

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
  includeNoneClass,
}: {
  labelClasses: LabelClassItem[];
  inputValueCombobox: string;
  includeNoneClass: boolean;
}): (LabelClassItem | CreateClassInput | NoneClass)[] => {
  const labelClassesWithNoneClass = includeNoneClass
    ? [...labelClasses, noneClass]
    : labelClasses;
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
  includeNoneClass = true,
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
  includeNoneClass?: boolean;
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
        includeNoneClass,
      }),
    [labelClasses, inputValueCombobox, includeNoneClass]
  );

  const listRef = useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtual({
    size: filteredLabelClasses.length,
    parentRef: listRef,
    estimateSize: React.useCallback(() => 32, []),
  });

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
  useSearchHotkeys(
    () => searchInputRef.current?.focus(),
    { enabled: isOpen && activateShortcuts && !isNil(searchInputRef.current) },
    [isOpen, activateShortcuts, searchInputRef.current]
  );
  const closeCircleIconColor = useColorModeValue("gray.300", "gray.500");
  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      placement="bottom-start"
      preventOverflow
    >
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent
        borderColor={useColorModeValue("gray.200", "gray.600")}
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
                        color={closeCircleIconColor}
                      />
                      <Kbd fontSize="md">↩</Kbd>
                    </>
                  ) : (
                    <Kbd>/</Kbd>
                  )}
                </InputRightElement>
              </InputGroup>
            </Box>
            <Box
              pt="1"
              {...getMenuProps({ ref: listRef })}
              overflowY="scroll"
              maxHeight="340"
            >
              <Box height={rowVirtualizer.totalSize} position="relative">
                {rowVirtualizer.virtualItems.map(({ index, size, start }) => {
                  const item = filteredLabelClasses[index];
                  return (
                    <Box
                      key={item.name}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${size}px`,
                        transform: `translateY(${start}px)`,
                      }}
                    >
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
                      />
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

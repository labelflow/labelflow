import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  Box,
  Popover,
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
import { ClassListItem } from "../class-list-item";
import { LabelClass } from "../../graphql-types.generated";
import { noneClassColor } from "../../utils/class-color-generator";

type CreateClassInput = { name: string; type: string };
type NoneClass = { name: string; color: string; type: string };

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
  labelClasses: LabelClass[];
  inputValueCombobox: string;
}): (LabelClass | CreateClassInput | NoneClass)[] => {
  const labelClassesWithNoneClass = [...labelClasses, noneClass];
  const createClassItem =
    inputValueCombobox &&
    labelClassesWithNoneClass.filter(
      (labelClass: LabelClass | NoneClass) =>
        labelClass.name === inputValueCombobox
    ).length === 0
      ? [{ name: inputValueCombobox, type: "CreateClassItem" }]
      : [];

  const filteredLabelClasses = labelClassesWithNoneClass.filter(
    (labelClass: LabelClass | NoneClass) => {
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
}: {
  isOpen?: boolean;
  onClose?: () => void;
  onSelectedClassChange: (item: LabelClass | null) => void;
  labelClasses: LabelClass[];
  createNewClass: (name: string) => void;
  selectedLabelClassId?: string | null;
  trigger?: React.ReactNode;
}) => {
  const [inputValueCombobox, setInputValueCombobox] = useState<string>("");
  const filteredLabelClasses = useMemo(
    () =>
      filterLabelClasses({
        labelClasses,
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
      LabelClass | CreateClassInput | NoneClass
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
  const initialFocusRef = useRef(null);
  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      initialFocusRef={initialFocusRef}
      placement="bottom-start"
      preventOverflow
    >
      {trigger && <PopoverTrigger>{trigger}</PopoverTrigger>}
      <PopoverContent
        borderColor="gray.200"
        pointerEvents="initial"
        aria-label="Class selection popover"
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
                  {...getInputProps({ ref: initialFocusRef })}
                  placeholder="Search..."
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
                        color="gray.300"
                      />
                      <Kbd fontSize="md">↩</Kbd>
                    </>
                  ) : (
                    <Kbd>/</Kbd>
                  )}
                </InputRightElement>
              </InputGroup>
            </Box>
            <Box pt="1" {...getMenuProps()}>
              {filteredLabelClasses.map(
                (
                  item: LabelClass | CreateClassInput | NoneClass,
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
                      key={`${item.name}${index}`}
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

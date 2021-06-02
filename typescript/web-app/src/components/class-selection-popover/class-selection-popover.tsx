import { useEffect, useState } from "react";
import {
  Box,
  Popover,
  PopoverContent,
  PopoverBody,
  Kbd,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { IoSearch } from "react-icons/io5";

import { RiCloseCircleFill } from "react-icons/ri";
import { useCombobox } from "downshift";
import { ClassListItem } from "../class-list-item";
import { LabelClass } from "../../types.generated";

type CreateClassInput = { name: string; type: string };

const ClassSelectionCombobox = (props: any) => {
  const { onSelectedClassChange, labelClasses, createNewClass, isOpen } = props;
  const [inputItems, setInputItems] = useState(labelClasses);
  const {
    reset,
    inputValue,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    itemToString: (item: LabelClass | CreateClassInput | null): string =>
      item?.name ?? "",
    items: inputItems,
    onInputValueChange: ({ inputValue: inputValueCombobox }) => {
      const createClassItem =
        inputValueCombobox &&
        labelClasses.filter(
          (labelClass: LabelClass) => labelClass.name === inputValueCombobox
        ).length === 0
          ? [{ name: inputValueCombobox, type: "CreateClassItem" }]
          : [];

      const filteredLabelClasses = labelClasses.filter(
        (labelClass: LabelClass) => {
          return labelClass.name
            .toLowerCase()
            .startsWith((inputValueCombobox ?? "").toLowerCase());
        }
      );
      return setInputItems([...filteredLabelClasses, ...createClassItem]);
    },
    onSelectedItemChange: ({ selectedItem }) => {
      const isItemOfCreateInput =
        selectedItem &&
        Object.keys(selectedItem).includes("type") &&
        (selectedItem as CreateClassInput).type === "CreateClassItem";

      return isItemOfCreateInput
        ? createNewClass(selectedItem?.name)
        : onSelectedClassChange(selectedItem);
    },
    defaultHighlightedIndex: 0,
  });

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen]);
  return (
    <Box>
      <Box {...getComboboxProps()}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <IoSearch />
          </InputLeftElement>
          <Input {...getInputProps()} placeholder="Search..." />
          <InputRightElement>
            {inputValue ? (
              <Flex marginRight="35px">
                <Box sx={{ color: "gray.300" }} marginRight="5px">
                  <RiCloseCircleFill size="25px" onClick={reset} />
                </Box>
                <Kbd fontSize="md">↩</Kbd>
              </Flex>
            ) : (
              <Kbd>/</Kbd>
            )}
          </InputRightElement>
        </InputGroup>
      </Box>
      <Box style={{ marginTop: "5px" }} {...getMenuProps()}>
        {inputItems.map(
          (item: LabelClass | CreateClassInput, index: number) => (
            <ClassListItem
              itemProps={getItemProps({ item, index })}
              item={item}
              highlight={highlightedIndex === index}
              index={index}
              key={`${item.name}`}
            />
          )
        )}
      </Box>
    </Box>
  );
};

export const ClassSelectionPopover = ({
  isOpen = false,
  onClose = () => {},
  onSelectedClassChange,
  createNewClass,
  labelClasses,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  onSelectedClassChange?: (item: LabelClass) => void;
  labelClasses: LabelClass[];
  createNewClass: (name: string) => void;
}) => {
  return (
    <Popover isOpen={isOpen} onClose={onClose}>
      <PopoverContent borderColor="gray.200">
        <PopoverBody>
          <ClassSelectionCombobox
            isOpen={isOpen}
            onSelectedClassChange={onSelectedClassChange}
            labelClasses={labelClasses}
            createNewClass={createNewClass}
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

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
  chakra,
} from "@chakra-ui/react";
import { IoSearch } from "react-icons/io5";

import { RiCloseCircleFill } from "react-icons/ri";
import { useCombobox, UseComboboxStateChange } from "downshift";
import { ClassListItem } from "../class-list-item";
import { LabelClass } from "../../types.generated";

type CreateClassInput = { name: string; type: string };

const MagnifierIcon = chakra(IoSearch);
const CloseCircleIcon = chakra(RiCloseCircleFill);

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
    itemToString: (item: { name: string } | null): string => item?.name ?? "",
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
    onSelectedItemChange: ({
      selectedItem,
    }: UseComboboxStateChange<{ name: string; type?: string }>): void => {
      const isItemOfCreateInput = selectedItem?.type === "CreateClassItem";

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
      <Box {...getComboboxProps()} pl="3" pr="3">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <MagnifierIcon fontSize="2xl" />
          </InputLeftElement>
          <Input {...getInputProps()} placeholder="Search..." />
          <InputRightElement>
            {inputValue ? (
              <Flex mr="5">
                <CloseCircleIcon
                  fontSize="2xl"
                  onClick={reset}
                  color="gray.300"
                />
                <Kbd fontSize="md">↩</Kbd>
              </Flex>
            ) : (
              <Kbd>/</Kbd>
            )}
          </InputRightElement>
        </InputGroup>
      </Box>
      <Box pt="1" {...getMenuProps()}>
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
        <PopoverBody pl="0" pr="0">
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

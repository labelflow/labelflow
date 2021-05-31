import { useState } from "react";
import {
  Box,
  Popover,
  PopoverContent,
  PopoverBody,
  Text,
  Kbd,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { IoSearch } from "react-icons/io5";

import { RiCheckboxBlankCircleFill, RiCloseCircleFill } from "react-icons/ri";
import { useCombobox } from "downshift";
import { LabelClass } from "../../types.generated";

export const ItemListClass = (props: any) => {
  const { color, shortcut, className, highlight, index, itemProps } = props;

  return (
    <Box
      style={{
        marginLeft: "-13px",
        marginRight: "-13px",
      }}
      bgColor={highlight ? "gray.100" : "transparent"}
      key={`${className}${index}`}
      {...itemProps}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        style={{ marginLeft: "25px", marginRight: "23px" }}
        height="35px"
      >
        <Flex alignItems="center">
          <RiCheckboxBlankCircleFill
            color={color}
            style={{ marginRight: 10 }}
            size="25px"
          />
          <Text>{className}</Text>
        </Flex>
        <Kbd style={{ justifyContent: "center" }}>{shortcut}</Kbd>
      </Flex>
    </Box>
  );
};

export const ClassSelectionCombobox = (props: any) => {
  const { onSelectedClassChange, labelClasses } = props;
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
    items: inputItems,
    onInputValueChange: ({ inputValue: inputValueCombobox }) => {
      setInputItems(
        labelClasses.filter((labelClass: LabelClass) =>
          labelClass.name
            .toLowerCase()
            .startsWith((inputValueCombobox ?? "").toLowerCase())
        )
      );
    },
    onSelectedItemChange: ({ selectedItem }) =>
      onSelectedClassChange(selectedItem),
  });
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
        {inputItems.map((item, index) => (
          <ItemListClass
            itemProps={getItemProps({ item, index })}
            color={item.color}
            shortcut={item.shortcut}
            className={item.name}
            highlight={highlightedIndex === index}
            index={index}
          />
        ))}
      </Box>
    </Box>
  );
};

export const RightClickPopover = ({
  isOpen = false,
  onClose = () => {},
  onSelectedClassChange,
  labelClasses,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  onSelectedClassChange?: (item: LabelClass) => void;
  labelClasses: LabelClass[];
}) => {
  return (
    <Popover
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
    >
      <PopoverContent borderColor="gray.200">
        <PopoverBody>
          <ClassSelectionCombobox
            onSelectedClassChange={onSelectedClassChange}
            labelClasses={labelClasses}
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

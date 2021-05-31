import { useCallback, useState, useEffect } from "react";
import {
  chakra,
  Box,
  Stack,
  Heading,
  IconButton,
  Editable,
  Popover,
  PopoverContent,
  PopoverBody,
  Table,
  Tbody,
  Tooltip,
  Tr,
  Td,
  Text,
  EditableInput,
  EditablePreview,
  Grid,
  GridItem,
  Kbd,
  HStack,
  Flex,
  Spacer,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Icon,
} from "@chakra-ui/react";
import { IoSearch } from "react-icons/io5";

import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import { useCombobox } from "downshift";

const items = [
  { name: "Person", color: "#7E5ACB", shortcut: "1" },
  { name: "Dog", color: "#4F5797 ", shortcut: "2" },
  { name: "Car", color: "#C0B55E", shortcut: "3" },
  { name: "Cycle", color: "#56FDCC", shortcut: "4" },
  { name: "Plane", color: "#0E6AD3", shortcut: "5" },
];

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
      >
        <Flex alignItems="center">
          <RiCheckboxBlankCircleFill
            color={color}
            style={{ marginRight: 10 }}
          />
          <Text>{className}</Text>
        </Flex>
        <Kbd style={{ justifyContent: "center" }}>{shortcut}</Kbd>
      </Flex>
    </Box>
  );
};

export const DropdownCombobox = () => {
  const [inputItems, setInputItems] = useState(items);
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: inputItems,
    onInputValueChange: ({ inputValue }) => {
      setInputItems(
        items.filter((item) =>
          item.name.toLowerCase().startsWith(inputValue.toLowerCase())
        )
      );
    },
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
            <Kbd>/</Kbd>
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
}: {
  isOpen?: boolean;
  onClose?: () => void;
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
          <DropdownCombobox />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

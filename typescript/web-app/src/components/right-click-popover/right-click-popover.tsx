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
  { name: "person", color: "#7E5ACB", shortcut: "1" },
  { name: "dog", color: "#4F5797 ", shortcut: "2" },
  { name: "car", color: "#C0B55E", shortcut: "3" },
  { name: "cycle", color: "#56FDCC", shortcut: "4" },
  { name: "plane", color: "#0E6AD3", shortcut: "5" },
];

export const ItemListClass = (props: any) => {
  const { color, shortcut, className, highlight } = props;

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      style={{ backgroundColor: highlight ? "#EDF2F7" : "transparent" }}
    >
      <Flex alignItems="center">
        <RiCheckboxBlankCircleFill color={color} style={{ marginRight: 10 }} />
        <Text>{className}</Text>
      </Flex>
      <Kbd style={{ justifyContent: "center" }}>{shortcut}</Kbd>
    </Flex>
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
      <Box
        style={{ marginLeft: "12px", marginRight: "10px" }}
        {...getMenuProps()}
      >
        {inputItems.map((item, index) => (
          <ItemListClass
            {...getItemProps({ item, index })}
            color={item.color}
            shortcut={item.shortcut}
            className={item.name}
            highlight={highlightedIndex === index}
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
      <PopoverContent>
        <PopoverBody>
          <DropdownCombobox />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

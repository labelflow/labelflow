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
} from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import { useCombobox } from "downshift";

const items = ["person", "dog", "car", "cycle", "plane"];

export const ItemListClass = (
  color: string,
  isEditable: boolean,
  name: string,
  shortcut: string,
  getInputProps
) => (
  <HStack spacing="24px">
    <RiCheckboxBlankCircleFill color={color} />
    {isEditable ? (
      <Editable defaultValue={name}>
        <EditablePreview />
        <EditableInput {...getInputProps()} />
      </Editable>
    ) : (
      <Text>Some text</Text>
    )}
    <Kbd>1</Kbd>
  </HStack>
);

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
          item.toLowerCase().startsWith(inputValue.toLowerCase())
        )
      );
    },
  });
  return (
    <Box>
      <Grid
        {...getComboboxProps()}
        templateColumns="6fr 1fr"
        justifyContent="center"
        alignItems="center"
        gap="3"
      >
        <GridItem colSpan={1}>
          <HStack spacing="24px">
            <RiCheckboxBlankCircleFill color="#ff0000" />
            <Editable defaultValue="No class selected">
              <EditablePreview />
              <EditableInput {...getInputProps()} />
            </Editable>
            <Kbd>1</Kbd>
          </HStack>
        </GridItem>
        <GridItem colSpan={1}>
          <IconButton
            type="button"
            {...getToggleButtonProps()}
            aria-label="toggle menu"
            icon={<BsChevronDown />}
            background="white"
          />
        </GridItem>
      </Grid>
      <ul {...getMenuProps()}>
        {isOpen &&
          inputItems.map((item, index) => (
            <li
              style={
                highlightedIndex === index ? { backgroundColor: "#bde4ff" } : {}
              }
              key={`${item}${index}`}
              {...getItemProps({ item, index })}
            >
              {item}
            </li>
          ))}
      </ul>
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
          {/* <Text fontSize="lg" fontWeight="medium">
            Implement combo box with downshift JS
          </Text> */}
          <DropdownCombobox />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

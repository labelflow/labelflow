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
} from "@chakra-ui/react";

import { BsChevronDown } from "react-icons/bs";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import { useCombobox } from "downshift";

const items = ["person", "dog", "car", "cycle", "plane"];

export const ItemListClass = (props: any) => {
  const { color, shortcut, children } = props;

  return (
    <Flex>
      <RiCheckboxBlankCircleFill color={color} />
      <Spacer />
      {children}
      <Spacer />
      <Kbd w="10%">{shortcut}</Kbd>
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
          <ItemListClass color="#ff0000" shortcut="1">
            <Editable defaultValue="No class selected">
              <EditablePreview />
              <EditableInput {...getInputProps()} />
            </Editable>
          </ItemListClass>
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

      <div {...getMenuProps()}>
        {isOpen &&
          inputItems.map((item, index) => (
            <ItemListClass
              {...getItemProps({ item, index })}
              color="#00FF00"
              shortcut={index}
            >
              <Text>{item}</Text>
            </ItemListClass>
          ))}
      </div>
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

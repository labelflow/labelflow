import { useCallback, useState, useEffect } from "react";
import {
  chakra,
  Box,
  Stack,
  Heading,
  IconButton,
  Editable,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
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
} from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import { useCombobox } from "downshift";

const items = ["person", "dog", "car", "cycle", "plane"];

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
        templateColumns="1fr 5fr 1fr"
        justifyContent="center"
        alignItems="center"
        gap={3}
      >
        <GridItem colSpan={1}>
          <Box alignItems="center" justifyContent="center" display="flex">
            <RiCheckboxBlankCircleFill color="#ff0000" />
          </Box>
        </GridItem>
        <GridItem colSpan={1}>
          <Editable defaultValue="No class selected">
            <EditablePreview />
            <EditableInput {...getInputProps()} />
          </Editable>
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

export const RightClickModal = ({
  isOpen = false,
  onClose = () => {},
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody
          display="flex"
          pt="0"
          pb="6"
          pr="6"
          pl="6"
          overflowY="hidden"
          flexDirection="column"
        >
          <Text fontSize="lg" fontWeight="medium">
            Implement combo box with downshift JS
          </Text>
          <DropdownCombobox />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

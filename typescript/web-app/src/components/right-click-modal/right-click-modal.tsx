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
  SimpleGrid
} from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
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
      <SimpleGrid {...getComboboxProps()} columns={2}>
        <Editable defaultValue="abcd" width="50%">
          <EditablePreview />
          <EditableInput {...getInputProps()} />
        </Editable>
        <IconButton
          type="button"
          {...getToggleButtonProps()}
          aria-label="toggle menu"
          icon={<BsChevronDown />}
          background="white"
        />
      </SimpleGrid>
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

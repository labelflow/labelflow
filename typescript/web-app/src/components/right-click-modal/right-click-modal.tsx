import { useCallback, useState, useEffect } from "react";
import {
  chakra,
  Box,
  Stack,
  Heading,
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
} from "@chakra-ui/react";
import Downshift from "downshift";

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
        <ModalHeader textAlign="center" padding="6">
          <Heading as="h2" size="lg" pb="2">
            TODO
          </Heading>
          <Text fontSize="lg" fontWeight="medium">
            Implement combo box with downshift JS
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          display="flex"
          pt="0"
          pb="6"
          pr="6"
          pl="6"
          overflowY="hidden"
          flexDirection="column"
        ></ModalBody>
      </ModalContent>
    </Modal>
  );
};

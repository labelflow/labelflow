import {
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  UseModalProps,
} from "@chakra-ui/react";

import {
  keymap as labelflowKeymap,
  Keymap as LabelflowKeymap,
} from "../../../../../keymap";
import { Keymap } from "./keymap";

export const KeymapModal = ({
  isOpen,
  onClose,
  keymap = labelflowKeymap,
}: {
  isOpen: UseModalProps["isOpen"];
  onClose: UseModalProps["onClose"];
  keymap?: LabelflowKeymap;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent height="80vh">
        <ModalHeader textAlign="center" padding="6">
          <Heading as="h2" size="lg" pb="2">
            Keyboard shortcuts
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          display="flex"
          pt="0"
          pb="6"
          pr="6"
          pl="6"
          overflowY="auto"
          flexDirection="column"
        >
          <Keymap keys={keymap} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

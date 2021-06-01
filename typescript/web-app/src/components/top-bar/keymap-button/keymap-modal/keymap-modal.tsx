import {
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  UseModalProps,
} from "@chakra-ui/react";
import { isEmpty } from "lodash/fp";
import { keymap } from "../../../../keymap";
import { Keys } from "./keys";

export const KeymapModal = ({
  isOpen,
  onClose,
}: {
  isOpen: UseModalProps["isOpen"];
  onClose: UseModalProps["onClose"];
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent height="80vh">
        <ModalHeader textAlign="center" padding="6">
          <Heading as="h2" size="lg" pb="2">
            Keyboard shortcuts
          </Heading>
          <Text fontSize="lg" fontWeight="medium">
            {" "}
          </Text>
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
          {!isEmpty(keymap) && <Keys keys={keymap} />}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

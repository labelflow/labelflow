import { useState } from "react";
import {
  Box,
  Button,
  HStack,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

import { ExportFormatCard } from "./export-format-card";

export const ExportModal = ({
  isOpen = false,
  onClose = () => {},
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) => {
  const [isCloseable, setCloseable] = useState(true);

  return (
    <Modal
      isOpen={isOpen}
      size="xl"
      onClose={() => {
        if (!isCloseable) return;
        onClose();
      }}
    >
      <ModalOverlay />
      <ModalContent height="80vh">
        <ModalHeader textAlign="center" padding="6">
          <Heading as="h2" size="lg" pb="2">
            Export Labels
          </Heading>
          <Text fontSize="lg" fontWeight="medium">
            Your project contains 11 labels. HARDCODED FOR NOW.
          </Text>
        </ModalHeader>

        <ModalBody
          display="flex"
          pt="0"
          pb="6"
          pr="6"
          pl="6"
          overflowY="hidden"
          flexDirection="column"
        >
          <HStack spacing="4">
            <ExportFormatCard
              colorScheme="brand"
              logoSrc="/assets/export-formats/coco.png"
              title="Export to COCO"
              tag="JSON"
              subtext="Annotation file used with Pytorch and Detectron 2"
            />
            <ExportFormatCard
              colorScheme="gray"
              logoSrc="/assets/export-formats/tensorflow-grey.png"
              title="Export to TensorFlow (soon)"
              tag="CSV"
              subtext="TF Object Detection file in its human readable format"
            />
          </HStack>
        </ModalBody>
        <ModalCloseButton disabled={!isCloseable} />
      </ModalContent>
    </Modal>
  );
};

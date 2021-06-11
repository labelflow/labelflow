import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  Button,
  Text,
  Heading,
  ModalBody,
  ModalHeader,
} from "@chakra-ui/react";

export const WelcomeModal = () => {
  const isOpen = true;

  const [hasUploaded, setHasUploaded] = useState(false);

  return (
    <Modal isOpen={isOpen} size="xl">
      <ModalOverlay />
      <ModalContent height="80vh" width="80vw">
        <ModalHeader textAlign="center" padding="6">
          <Heading as="h2" size="lg" pb="2">
            Import
          </Heading>
          <Text fontSize="lg" fontWeight="medium">
            Start working with your images. Stay in control of your data. Images
            are not uploaded on LabelFlow servers.{" "}
            <Button
              colorScheme="brand"
              variant="link"
              fontSize="lg"
              fontWeight="medium"
              onClick={() => setMode?.("urlList")}
            >
              Import from a list of URLs instead
            </Button>
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
          Ok
        </ModalBody>
        <ModalFooter visibility={hasUploaded ? "visible" : "hidden"}>
          <Button
            colorScheme="brand"
            onClick={() => {
              onClose();
              setHasUploaded(false);
            }}
          >
            Start labeling
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

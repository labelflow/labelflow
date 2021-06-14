import { useState } from "react";
import {
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

import { useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";

import { ExportFormatCard } from "./export-format-card";

const exportToCocoQuery = gql`
  query exportToCoco {
    exportToCoco
  }
`;

export const ExportModal = ({
  isOpen = false,
  onClose = () => {},
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) => {
  const [isCloseable, setCloseable] = useState(true);

  const [queryExportToCoco, { loading }] = useLazyQuery(exportToCocoQuery, {
    fetchPolicy: "network-only",
    onCompleted: ({ exportToCoco }) => {
      if (typeof exportToCoco !== "string") {
        throw new Error("");
      }

      const base64Export = exportToCoco.replace(
        "data:application/json;base64,",
        ""
      );
      console.log(JSON.parse(atob(base64Export)));

      // decode from base64 and start download
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      size="3xl"
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
          <HStack spacing="4" justifyContent="center">
            <ExportFormatCard
              loading={loading}
              onClick={queryExportToCoco}
              colorScheme="brand"
              logoSrc="/assets/export-formats/coco.png"
              title="Export to COCO"
              subtext="Annotation file used with Pytorch and Detectron 2"
            />
            <ExportFormatCard
              disabled
              colorScheme="gray"
              logoSrc="/assets/export-formats/tensorflow-grey.png"
              title="Export to TensorFlow (soon)"
              subtext="TF Object Detection file in its human readable format"
            />
          </HStack>
        </ModalBody>
        <ModalCloseButton disabled={!isCloseable} />
      </ModalContent>
    </Modal>
  );
};

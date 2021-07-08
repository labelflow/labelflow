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
  Skeleton,
} from "@chakra-ui/react";

import { useLazyQuery, useQuery } from "@apollo/client";
import gql from "graphql-tag";

import { ExportFormatCard } from "./export-format-card";

const exportToCocoQuery = gql`
  query exportToCoco {
    exportToCoco
  }
`;

const countLabelsQuery = gql`
  query countLabels {
    labelsAggregates {
      totalCount
    }
  }
`;

export const ExportModal = ({
  isOpen = false,
  onClose = () => {},
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) => {
  const { data } = useQuery(countLabelsQuery);
  const [queryExportToCoco, { loading }] = useLazyQuery(exportToCocoQuery, {
    fetchPolicy: "network-only",
    onCompleted: ({ exportToCoco }) => {
      if (typeof exportToCoco !== "string") {
        throw new Error("");
      }
      const dateObject = new Date();
      const date = `${dateObject
        .toLocaleDateString()
        .split("/")
        .reverse()
        .join("-")}T${String(dateObject.getHours()).padStart(2, "0")}${String(
        dateObject.getMinutes()
      ).padStart(2, "0")}${String(dateObject.getSeconds()).padStart(2, "0")}`;
      const projectName = `project-${date}-Coco.json`;
      const element = document.createElement("a");
      element.href = exportToCoco;
      element.download = projectName;
      element.click();
    },
  });

  return (
    <Modal isOpen={isOpen} size="3xl" onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent height="auto">
        <ModalHeader textAlign="center" padding="6">
          <Heading as="h2" size="lg" pb="2" color="gray.800">
            Export Labels
          </Heading>
          <Skeleton
            w="fit-content"
            m="auto"
            isLoaded={data?.labelsAggregates?.totalCount !== undefined}
          >
            <Text fontSize="lg" fontWeight="medium" color="gray.800">
              Your project contains {data?.labelsAggregates?.totalCount} labels.
            </Text>
          </Skeleton>
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
          <HStack
            spacing="4"
            justifyContent="center"
            pt="14"
            pb="10"
            pl="8"
            pr="8"
            flexWrap="wrap"
          >
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
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
};

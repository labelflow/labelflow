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
import { useRouter } from "next/router";
import { useLazyQuery, useQuery, gql } from "@apollo/client";
import { ExportFormatCard } from "./export-format-card";

const exportToCocoQuery = gql`
  query exportToCoco($projectId: ID!) {
    exportToCoco(where: { projectId: $projectId })
  }
`;

const countLabelsOfProjectQuery = gql`
  query countLabelsOfProject($projectId: ID!) {
    project(where: { id: $projectId }) {
      id
      labelsAggregates {
        totalCount
      }
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
  const router = useRouter();
  const { projectId } = router?.query;
  const { data } = useQuery(countLabelsOfProjectQuery, {
    variables: { projectId },
  });
  const [queryExportToCoco, { loading }] = useLazyQuery(exportToCocoQuery, {
    variables: { projectId },
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
    <Modal
      scrollBehavior="inside"
      isOpen={isOpen}
      size="3xl"
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent height="auto">
        <ModalHeader textAlign="center" padding="6">
          <Heading as="h2" size="lg" pb="2" color="gray.800">
            Export Labels
          </Heading>
          <Skeleton
            w="fit-content"
            m="auto"
            isLoaded={data?.project?.labelsAggregates?.totalCount !== undefined}
          >
            <Text fontSize="lg" fontWeight="medium" color="gray.800">
              Your project contains{" "}
              {data?.project?.labelsAggregates?.totalCount} labels.
            </Text>
          </Skeleton>
        </ModalHeader>

        <ModalBody
          display="flex"
          pt="0"
          pb="6"
          pr="6"
          pl="6"
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
              logoSrc="/static/export-formats/coco.png"
              title="Export to COCO"
              subtext="Annotation file used with Pytorch and Detectron 2"
            />
            <ExportFormatCard
              disabled
              colorScheme="gray"
              logoSrc="/static/export-formats/tensorflow-grey.png"
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

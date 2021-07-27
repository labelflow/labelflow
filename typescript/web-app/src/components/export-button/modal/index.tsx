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
import { useQuery, gql, useApolloClient, ApolloClient } from "@apollo/client";
import JSZip from "jszip";
import { Dispatch, SetStateAction, useState } from "react";
import mime from "mime-types";
import { ExportFormatCard } from "./export-format-card";
import { ExportOptionsModal, ExportOptions } from "./export-options-modal";

const getImagesQuery = gql`
  query getImages {
    images {
      id
      name
      url
      mimetype
    }
  }
`;

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

export const exportCocoDataset = async ({
  projectId,
  setIsExportRunning,
  client,
  options,
}: {
  projectId: string;
  setIsExportRunning: Dispatch<SetStateAction<boolean>>;
  client: ApolloClient<Object>;
  options: ExportOptions;
}) => {
  setIsExportRunning(true);
  const {
    data: { exportToCoco },
  } = await client.query({
    query: exportToCocoQuery,
    variables: { projectId },
  });
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
  const projectName = `project-${date}-Coco`;
  if (options.exportImages) {
    const {
      data: { images },
    } = await client.query({ query: getImagesQuery });
    const zip = new JSZip();
    zip.file(
      `${projectName}/annotations.json`,
      exportToCoco.substr(exportToCoco.indexOf(",") + 1),
      {
        base64: true,
      }
    );
    await Promise.all(
      images.map(
        async ({
          id,
          name,
          url,
          mimetype,
        }: {
          id: string;
          name: string;
          url: string;
          mimetype: string;
        }) => {
          const dataUrl = await (async (): Promise<string> => {
            const blob = await fetch(url).then((r) => r.blob());
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            });
          })();
          zip.file(
            `${projectName}/images/${name}_${id}.${mime.extension(mimetype)}`,
            dataUrl.substr(dataUrl.indexOf(",") + 1),
            {
              base64: true,
            }
          );
        }
      )
    );
    const blobZip = await zip.generateAsync({ type: "blob" });
    const url = window.URL.createObjectURL(blobZip);
    const element = document.createElement("a");
    element.href = url;
    element.download = `${projectName}.zip`;
    setIsExportRunning(false);
    element.click();
  } else {
    const element = document.createElement("a");
    element.href = exportToCoco;
    element.download = `${projectName}.json`;
    setIsExportRunning(false);
    element.click();
  }
};

export const ExportModal = ({
  isOpen = false,
  onClose = () => {},
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) => {
  const router = useRouter();
  const client = useApolloClient();
  const { projectId } = router?.query as { projectId: string };
  const { data } = useQuery(countLabelsOfProjectQuery, {
    variables: { projectId },
  });
  const [isExportRunning, setIsExportRunning] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  // const [options, setOptions] = useState<ExportOptions>({
  //   exportImages: false,
  // });
  const [exportFunction, setExportFunction] = useState<
    (options: ExportOptions) => void
  >(() => {});

  return (
    <>
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
              isLoaded={
                data?.project?.labelsAggregates?.totalCount !== undefined
              }
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
                loading={isExportRunning}
                onClick={() => {
                  setExportFunction(
                    () => (options: ExportOptions) =>
                      exportCocoDataset({
                        projectId,
                        setIsExportRunning,
                        client,
                        options,
                      })
                  );
                  setIsOptionsModalOpen(true);
                }}
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
      <ExportOptionsModal
        isOpen={isOptionsModalOpen}
        exportFunction={exportFunction}
        onClose={() => setIsOptionsModalOpen(false)}
        // options={options}
        // setOptions={setOptions}
      />
    </>
  );
};

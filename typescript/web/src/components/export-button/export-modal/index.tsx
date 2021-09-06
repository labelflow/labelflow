import { Dispatch, SetStateAction, useState, useCallback } from "react";
import {
  Stack,
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
import mime from "mime-types";
import { ExportFormatCard } from "./export-format-card";
import { ExportOptionsModal, ExportOptions } from "./export-options-modal";

const getImagesQuery = gql`
  query getImages($datasetId: ID!) {
    images(where: { datasetId: $datasetId }) {
      id
      name
      url
      mimetype
    }
  }
`;

const exportToCocoQuery = gql`
  query exportToCoco($datasetId: ID!) {
    exportToCoco(where: { datasetId: $datasetId })
  }
`;

const countLabelsOfDatasetQuery = gql`
  query countLabelsOfDataset($slug: String!) {
    dataset(where: { slug: $slug }) {
      id
      imagesAggregates {
        totalCount
      }
      labelsAggregates {
        totalCount
      }
    }
  }
`;

export const exportCocoDataset = async ({
  datasetId,
  setIsExportRunning,
  client,
  options,
}: {
  datasetId: string;
  setIsExportRunning: Dispatch<SetStateAction<boolean>>;
  client: ApolloClient<Object>;
  options: ExportOptions;
}) => {
  setIsExportRunning(true);
  const {
    data: { exportToCoco },
  } = await client.query({
    query: exportToCocoQuery,
    variables: { datasetId },
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
  const datasetName = `dataset-${date}-Coco`;
  if (options.exportImages) {
    const {
      data: { images },
    } = await client.query({ query: getImagesQuery, variables: { datasetId } });
    const zip = new JSZip();
    zip.file(
      `${datasetName}/annotations.json`,
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
            `${datasetName}/images/${name}_${id}.${mime.extension(mimetype)}`,
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
    element.download = `${datasetName}.zip`;
    setIsExportRunning(false);
    element.click();
  } else {
    const element = document.createElement("a");
    element.href = exportToCoco;
    element.download = `${datasetName}.json`;
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
  const { datasetSlug } = router?.query as { datasetSlug: string };
  const { data, loading } = useQuery(countLabelsOfDatasetQuery, {
    variables: { slug: datasetSlug },
    skip: !datasetSlug,
  });
  const datasetId = data?.dataset.id;

  const [isExportRunning, setIsExportRunning] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  // const [options, setOptions] = useState<ExportOptions>({
  //   exportImages: false,
  // });
  const [exportFunction, setExportFunction] = useState<
    (options: ExportOptions) => void
  >(() => {});

  const handleExportFunction = useCallback(
    () => (options: ExportOptions) =>
      exportCocoDataset({
        datasetId,
        setIsExportRunning,
        client,
        options,
      }),
    [datasetId]
  );

  if (loading) {
    return null;
  }

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
          <ModalHeader textAlign="center" p={{ base: "4", md: "6" }}>
            <Heading as="h2" size="lg" pb="2">
              Export Labels
            </Heading>
            <Skeleton
              w="fit-content"
              m="auto"
              isLoaded={
                data?.dataset?.labelsAggregates?.totalCount !== undefined
              }
            >
              <Text fontSize="lg" fontWeight="medium">
                Your dataset contains{" "}
                {data?.dataset?.imagesAggregates?.totalCount} images and{" "}
                {data?.dataset?.labelsAggregates?.totalCount} labels.
              </Text>
            </Skeleton>
          </ModalHeader>

          <ModalBody
            display="flex"
            p={{ base: "4", md: "6" }}
            flexDirection="column"
          >
            <Stack
              direction={{ base: "column", md: "row" }}
              spacing="4"
              justifyContent="center"
              p={{ base: "2", md: "8" }}
              flexWrap="wrap"
            >
              <ExportFormatCard
                loading={isExportRunning}
                onClick={() => {
                  setExportFunction(handleExportFunction);
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
            </Stack>
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

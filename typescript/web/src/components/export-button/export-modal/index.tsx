import {
  Dispatch,
  SetStateAction,
  useState,
  useCallback,
  useMemo,
} from "react";
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
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
} from "@chakra-ui/react";
import { ExportFormat, ExportOptions, Label } from "@labelflow/graphql-types";
import { useRouter } from "next/router";
import { useQuery, gql, useApolloClient, ApolloClient } from "@apollo/client";
import { ExportFormatCard } from "./export-format-card";
import { ExportOptionsModal } from "./export-options-modal";
import { formatMainInformation, Format } from "./formats";

const exportQuery = gql`
  query exportDatasetUrl(
    $datasetId: ID!
    $format: ExportFormat!
    $options: ExportOptions
  ) {
    exportDataset(
      where: { datasetId: $datasetId }
      format: $format
      options: $options
    )
  }
`;

export const countLabelsOfDatasetQuery = gql`
  query countLabelsOfDataset($slug: String!) {
    dataset(where: { slug: $slug }) {
      id
      imagesAggregates {
        totalCount
      }
      labelsAggregates {
        totalCount
      }
      labels {
        labelClass {
          id
        }
      }
    }
  }
`;

const exportDataset = async ({
  datasetId,
  setIsExportRunning,
  client,
  format,
  options,
}: {
  datasetId: string;
  setIsExportRunning: Dispatch<SetStateAction<boolean>>;
  client: ApolloClient<Object>;
  format: ExportFormat;
  options: ExportOptions;
}) => {
  setIsExportRunning(true);
  const dateObject = new Date();
  const date = `${dateObject
    .toLocaleDateString()
    .split("/")
    .reverse()
    .join("-")}T${String(dateObject.getHours()).padStart(2, "0")}${String(
    dateObject.getMinutes()
  ).padStart(2, "0")}${String(dateObject.getSeconds()).padStart(2, "0")}`;
  const datasetName = `dataset-${date}-${format.toLowerCase()}`;
  const {
    data: { exportDataset: exportDatasetUrl },
  } = await client.query({
    query: exportQuery,
    variables: {
      datasetId,
      format,
      options: {
        coco: { ...options.coco, name: datasetName },
        yolo: { ...options.yolo, name: datasetName },
      },
    },
  });
  const blobDataset = await (await fetch(exportDatasetUrl)).blob();
  const url = window.URL.createObjectURL(blobDataset);
  const element = document.createElement("a");
  element.href = url;
  element.download = datasetName;
  setIsExportRunning(false);
  element.click();
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
  const datasetHasUndefinedLabels = useMemo(() => {
    if (loading === false) {
      return data?.dataset?.labels?.reduce(
        (hasUndefinedLabels: boolean, label: Label) => {
          return hasUndefinedLabels || !label?.labelClass;
        },
        false
      );
    }
    return false;
  }, [data, loading]);

  const [isExportRunning, setIsExportRunning] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState(ExportFormat.Coco);
  const exportFunctionGenerator = useCallback(
    async (options: ExportOptions) =>
      await exportDataset({
        datasetId,
        setIsExportRunning,
        client,
        format: exportFormat,
        options,
      }),
    [datasetId, exportFormat]
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
            {/* <Skeleton
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
            </Skeleton> */}
            <Alert status="info" mt={2}>
              <AlertIcon />
              <AlertDescription fontSize="lg" fontWeight="medium">
                Your dataset contains{" "}
                {data?.dataset?.imagesAggregates?.totalCount} images and{" "}
                {data?.dataset?.labelsAggregates?.totalCount} labels.
              </AlertDescription>
            </Alert>
            {datasetHasUndefinedLabels && (
              <Alert status="warning" mt={2}>
                <AlertIcon />
                <AlertDescription fontSize="lg" fontWeight="medium">
                  It seems like your dataset contains some labels that don't
                  have any class
                </AlertDescription>
              </Alert>
            )}
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
              {Object.keys(formatMainInformation).map((formatKey) => {
                const formatInformation =
                  formatMainInformation[formatKey as Format];
                return (
                  <ExportFormatCard
                    key={formatKey}
                    loading={
                      isExportRunning &&
                      formatKey === exportFormat.toLowerCase()
                    }
                    onClick={() => {
                      setExportFormat(formatInformation.format);
                      setIsOptionsModalOpen(true);
                    }}
                    colorScheme="brand"
                    logoSrc={formatInformation.logoSrc}
                    title={formatInformation.title}
                    subtext={formatInformation.description}
                  />
                );
              })}
            </Stack>
          </ModalBody>
          <ModalCloseButton />
        </ModalContent>
      </Modal>
      <ExportOptionsModal
        isOpen={isOptionsModalOpen}
        exportFormat={exportFormat}
        exportFunction={exportFunctionGenerator}
        onClose={() => setIsOptionsModalOpen(false)}
      />
    </>
  );
};

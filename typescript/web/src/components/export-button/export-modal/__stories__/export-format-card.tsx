import { HStack } from "@chakra-ui/react";
import { ExportFormat } from "@labelflow/graphql-types";
import { apolloDecorator, chakraDecorator } from "../../../../utils/storybook";
import { ExportFormatCard } from "../export-format-card";
import { ExportModalContext, ExportModalState } from "../export-modal.context";

export default {
  title: "web/Export Button/export format card",
  decorators: [chakraDecorator, apolloDecorator],
};

const loadingValue: ExportModalState = {
  isOpen: false,
  onClose: () => {},
  exportFormat: ExportFormat.Coco,
  setExportFormat: () => {},
  loading: false,
  datasetId: "",
  numberUndefinedLabelsOfDataset: 0,
  datasetSlug: "",
  setIsExportRunning: () => {},
  isExportRunning: true,
  imagesNumber: 0,
  labelsNumber: 0,
  isOptionsModalOpen: true,
  setIsOptionsModalOpen: () => {},
};

export const COCO = () => {
  return <ExportFormatCard colorScheme="brand" formatKey="coco" />;
};

export const Loading = () => {
  return (
    <ExportModalContext.Provider value={loadingValue}>
      <ExportFormatCard colorScheme="brand" formatKey="coco" />
    </ExportModalContext.Provider>
  );
};

export const Disabled = () => {
  return <ExportFormatCard disabled colorScheme="gray" formatKey="yolo" />;
};

export const SideBySide = () => {
  return (
    <HStack spacing="4">
      <ExportFormatCard colorScheme="brand" formatKey="coco" />
      <ExportFormatCard colorScheme="gray" formatKey="yolo" />
    </HStack>
  );
};

export const SideBySideWithOneDisabled = () => {
  return (
    <HStack spacing="4">
      <ExportFormatCard colorScheme="brand" formatKey="coco" />
      <ExportFormatCard disabled colorScheme="gray" formatKey="yolo" />
    </HStack>
  );
};

export const SideBySideWithOneLoadingAndOneDisabled = () => {
  return (
    <HStack spacing="4">
      <ExportModalContext.Provider value={loadingValue}>
        <ExportFormatCard colorScheme="brand" formatKey="coco" />
      </ExportModalContext.Provider>
      <ExportFormatCard disabled colorScheme="gray" formatKey="yolo" />
    </HStack>
  );
};

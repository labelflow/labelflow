import { ExportFormat } from "@labelflow/graphql-types";
import { apolloDecorator } from "../../../../utils/apollo-decorator";
import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { ExportModalContext, ExportModalState } from "../export-modal.context";
import { ExportOptionsModal } from "../export-options-modal";

export default {
  title: "web/Export Button/Options Modal",
  decorators: [chakraDecorator, apolloDecorator],
};

const value: ExportModalState = {
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

export const Opened = () => {
  return (
    <ExportModalContext.Provider value={value}>
      <ExportOptionsModal />
    </ExportModalContext.Provider>
  );
};

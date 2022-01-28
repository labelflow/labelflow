import { ExportFormat } from "../../../../graphql-types/globalTypes";
import {
  apolloMockDecorator,
  chakraDecorator,
} from "../../../../utils/stories";
import { ExportModalContext, ExportModalState } from "../export-modal.context";
import { ExportOptionsModal } from "../export-options-modal";

export default {
  title: "web/Export Button/Options Modal",
  decorators: [chakraDecorator, apolloMockDecorator],
};

const value: ExportModalState = {
  isOpen: false,
  onClose: () => {},
  exportFormat: ExportFormat.COCO,
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

import { ChakraProvider } from "@chakra-ui/react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { ExportFormat } from "../../../../graphql-types/globalTypes";
import { theme } from "../../../../theme";
import { ExportFormatCard } from "../export-format-card";
import { ExportModalContext, ExportModalState } from "../export-modal.context";

const loadingValue: ExportModalState = {
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
const wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ChakraProvider theme={theme} resetCSS>
    {children}
  </ChakraProvider>
);

test("Nominal case should display card title", () => {
  render(<ExportFormatCard colorScheme="brand" formatKey="coco" />, {
    wrapper,
  });
  expect(screen.queryByText("Export to COCO")).toBeInTheDocument();
});

test("Loading case should display the spinner", () => {
  render(
    <ExportModalContext.Provider value={loadingValue}>
      <ExportFormatCard colorScheme="brand" formatKey="coco" />
    </ExportModalContext.Provider>,
    { wrapper }
  );
  expect(screen.queryByLabelText("loading")).toBeInTheDocument();
});

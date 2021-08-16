import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { ChakraProvider } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { ExportFormatCard } from "../export-format-card";
import { theme } from "../../../../theme";

const wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ChakraProvider theme={theme} resetCSS>
    {children}
  </ChakraProvider>
);

test("Nominal case should display card title", () => {
  render(
    <ExportFormatCard
      colorScheme="brand"
      logoSrc="/assets/export-formats/coco.png"
      title="Export to COCO"
      subtext="Annotation file used with Pytorch and Detectron 2"
    />,
    { wrapper }
  );
  expect(screen.queryByText("Export to COCO")).toBeInTheDocument();
});

test("Loading case should display the spinner", () => {
  render(
    <ExportFormatCard
      loading
      colorScheme="brand"
      logoSrc="/assets/export-formats/coco.png"
      title="Export to COCO"
      subtext="Annotation file used with Pytorch and Detectron 2"
    />,
    { wrapper }
  );
  expect(screen.queryByLabelText("loading")).toBeInTheDocument();
});

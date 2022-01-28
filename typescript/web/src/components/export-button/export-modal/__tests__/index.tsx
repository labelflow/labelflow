/* eslint-disable import/first */
import { render, screen, waitFor } from "@testing-library/react";
import { initMockedDate } from "@labelflow/dev-utils/mockdate";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { MockedProvider } from "@apollo/client/testing";
import { ChakraProvider } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { mockNextRouter } from "../../../../utils/router-mocks";
import { BASIC_DATASET_DATA } from "../../../../utils/tests/data.fixtures";

initMockedDate();

mockNextRouter({
  query: {
    datasetSlug: BASIC_DATASET_DATA.slug,
    workspaceSlug: BASIC_DATASET_DATA.workspace.slug,
  },
});

import { ExportModal } from "..";
import { getApolloMockLink } from "../../../../utils/tests/apollo-mock";
import { theme } from "../../../../theme";
import { APOLLO_MOCKS } from "../export-modal.fixtures";

const wrapper = ({ children }: PropsWithChildren<{}>) => (
  <MockedProvider link={getApolloMockLink(APOLLO_MOCKS)}>
    <ChakraProvider theme={theme} resetCSS>
      {children}
    </ChakraProvider>
  </MockedProvider>
);

test("File should be downloaded when user clicks on Export to COCO and Export", async () => {
  window.URL.createObjectURL = jest.fn();
  render(<ExportModal isOpen onClose={() => {}} />, {
    wrapper,
  });
  const anchorMocked = {
    href: "",
    click: jest.fn(),
  } as any;
  const createElementOriginal = document.createElement.bind(document);
  jest.spyOn(document, "createElement").mockImplementation((name, options) => {
    if (name === "a") {
      return anchorMocked;
    }
    return createElementOriginal(name, options);
  });

  await waitFor(() => {
    userEvent.click(screen.getByText("Export to COCO"));
    expect(screen.getByText("Export Options")).toBeDefined();
  });
  userEvent.click(screen.getByRole("button", { name: "Export" }));

  await waitFor(() => expect(anchorMocked.click).toHaveBeenCalledTimes(1));
  await waitFor(() =>
    expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1)
  );
}, 20000);

test("Export Modal should display the number of labels", async () => {
  render(<ExportModal isOpen onClose={() => {}} />, { wrapper });

  await waitFor(() =>
    expect(screen.getByRole("banner").textContent).toEqual(
      expect.stringContaining("1 images and 2 labels")
    )
  );
});

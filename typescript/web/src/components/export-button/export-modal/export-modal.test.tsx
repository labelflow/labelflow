import { waitFor } from "@testing-library/react";
import { initMockedDate } from "@labelflow/dev-utils/mockdate";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";

initMockedDate();

import { BASIC_DATASET_DATA } from "../../../dev/fixtures";
import { mockWorkspace } from "../../../dev/tests/mock-workspace";

mockWorkspace({ queryParams: { datasetSlug: BASIC_DATASET_DATA.slug } });

import { renderWithTestWrapper } from "../../../dev/tests";
import { ExportModal } from ".";
import { APOLLO_MOCKS } from "./export-modal.fixtures";

const renderTest = () =>
  renderWithTestWrapper(<ExportModal isOpen onClose={() => {}} />, {
    auth: { withWorkspaces: true },
    apollo: { extraMocks: APOLLO_MOCKS },
  });

describe(ExportModal, () => {
  it("downloads when user clicks on Export to COCO and Export", async () => {
    window.URL.createObjectURL = jest.fn();
    const { getByRole, getByText } = await renderTest();

    const anchorMocked = {
      href: "",
      click: jest.fn(),
    } as any;
    const createElementOriginal = document.createElement.bind(document);
    jest
      .spyOn(document, "createElement")
      .mockImplementation((name, options) => {
        if (name === "a") {
          return anchorMocked;
        }
        return createElementOriginal(name, options);
      });

    await waitFor(() => {
      userEvent.click(getByText("Export to COCO"));
      expect(getByText("Export Options")).toBeDefined();
    });
    userEvent.click(getByRole("button", { name: "Export" }));

    await waitFor(() => expect(anchorMocked.click).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1)
    );
  });

  it("displays the number of labels", async () => {
    const { getByRole } = await renderTest();
    await waitFor(() =>
      expect(getByRole("banner").textContent).toEqual(
        expect.stringContaining("1 images and 2 labels")
      )
    );
  });
});

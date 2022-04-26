import { act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { mockMatchMedia } from "../../utils/mock-window";

mockMatchMedia(jest);

import { BASIC_DATASET_DATA } from "../../utils/fixtures";
import { mockWorkspace } from "../../utils/tests/mock-workspace";

mockWorkspace({ queryParams: { datasetSlug: BASIC_DATASET_DATA.slug } });

import { renderWithTestWrapper } from "../../utils/tests";
import { ImportButton } from "./import-button";
import { IMPORT_BUTTON_MOCKS } from "./import-button.fixtures";

const files = [
  new File(["Hello"], "hello.png", { type: "image/png" }),
  new File(["World"], "world.png", { type: "image/png" }),
  new File(["Error"], "error.pdf", { type: "application/pdf" }),
];

describe(ImportButton, () => {
  it("clears the modal content when closed", async () => {
    const { apolloMockLink, getAllByLabelText, getByLabelText, queryByText } =
      await renderWithTestWrapper(<ImportButton />, {
        auth: { withWorkspaces: true },
        apollo: { extraMocks: IMPORT_BUTTON_MOCKS },
      });

    userEvent.click(getByLabelText("Add images"));

    const input = getByLabelText(
      /Drop images and annotations or click to browse/i
    );
    await waitFor(() => userEvent.upload(input, files));
    await act(() => apolloMockLink.waitForAllResponses());
    await waitFor(() =>
      expect(getAllByLabelText("Upload succeed")).toHaveLength(2)
    );

    userEvent.click(getByLabelText("Close"));
    await waitFor(() => expect(queryByText("Import")).not.toBeInTheDocument());

    userEvent.click(getByLabelText("Add images"));
    expect(
      getByLabelText(/Drop images and annotations or click to browse/i)
    ).toBeDefined();

    expect(queryByText(/Completed 2 of 2 items/i)).toBeNull();
  });
});

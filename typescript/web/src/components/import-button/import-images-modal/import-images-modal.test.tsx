import { waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";

import { BASIC_DATASET_DATA } from "../../../utils/fixtures";
import { mockWorkspace } from "../../../utils/tests/mock-workspace";

mockWorkspace({ queryParams: { datasetSlug: BASIC_DATASET_DATA.slug } });

import {
  renderWithTestWrapper,
  RenderWithWrapperResult,
} from "../../../utils/tests";
import { ERROR_MOCKS, IMPORT_BUTTON_MOCKS } from "../import-button.fixtures";
import {
  ImportImagesModal,
  ImportImagesModalProps,
} from "./import-images-modal";

const files = [
  new File(["Hello"], "hello.png", { type: "image/png" }),
  new File(["World"], "world.png", { type: "image/png" }),
  new File(["Error"], "error.pdf", { type: "application/pdf" }),
];

async function ensuresUploadsAreFinished(number = 2) {
  await waitFor(() =>
    expect(screen.getAllByLabelText("Upload succeed")).toHaveLength(number)
  );
}

const renderTest = async (
  props: ImportImagesModalProps = { isOpen: true },
  error = false
): Promise<RenderWithWrapperResult> => {
  const extraMocks = error ? ERROR_MOCKS : IMPORT_BUTTON_MOCKS;
  return await renderWithTestWrapper(
    <ImportImagesModal onClose={() => {}} {...props} />,
    { auth: { withWorkspaces: true }, apollo: { extraMocks } }
  );
};

const renderTestAndImport = async (
  filesToImport: File[] = files,
  props?: ImportImagesModalProps,
  error?: boolean
): Promise<RenderWithWrapperResult> => {
  const result = await renderTest(props, error);
  const { getByLabelText, getByTestId } = result;
  await waitFor(() =>
    expect(getByTestId("import-images-modal-content")).toBeDefined()
  );
  await waitFor(() =>
    userEvent.upload(
      getByLabelText(/Drop images and annotations or click to browse/i),
      filesToImport
    )
  );
  return result;
};

describe(ImportImagesModal, () => {
  it("displays the number of valid images", async () => {
    const { getByText, queryByLabelText } = await renderTestAndImport();
    await waitFor(() =>
      expect(getByText(/Completed 2 of 2 items/i)).toBeDefined()
    );
    expect(
      queryByLabelText(/Drop images and annotations or click to browse/i)
    ).not.toBeInTheDocument();
  });

  it("displays an indicator when upload succeeded", async () => {
    const { getByLabelText } = await renderTestAndImport(files.slice(0, 1));
    await waitFor(() => expect(getByLabelText("Upload succeed")).toBeDefined());
  });
  it("displays an indicator when upload failed", async () => {
    const { getAllByTestId } = await renderTestAndImport(
      files.slice(0, 1),
      { isOpen: true },
      true
    );
    await waitFor(() =>
      expect(
        getAllByTestId("import-progress-tooltip-icon")[0].getAttribute(
          "aria-label"
        )
      ).toBe("Error indicator")
    );
  });
  it("displays a loading indicator when a file is uploading", async () => {
    const { getByLabelText } = await renderTestAndImport(files.slice(0, 1));
    expect(getByLabelText("Loading indicator")).toBeDefined();
    await waitFor(() => expect(getByLabelText("Upload succeed")).toBeDefined());
  });

  it("only uploads the valid pictures when the user drags invalid formats", async () => {
    const { getAllByLabelText } = await renderTestAndImport();
    await waitFor(() =>
      expect(getAllByLabelText("Upload succeed")).toHaveLength(2)
    );
  });

  it("displays the images name", async () => {
    const { getByText } = await renderTestAndImport();
    expect(getByText(/hello.png/i)).toBeDefined();
    expect(getByText(/world.png/i)).toBeDefined();
    await ensuresUploadsAreFinished();
  });

  it("displays the rejected images name", async () => {
    const { getByText } = await renderTestAndImport(files.slice(2, 3));
    expect(getByText(/error.pdf/i)).toBeDefined();
    expect(getByText(/file type must be jpeg, png or bmp/i)).toBeDefined();
  });

  it("displays the error description when a file could not be imported", async () => {
    const { getByText } = await renderTestAndImport(files.slice(2, 3));
    expect(getByText(/file type must be jpeg, png or bmp/i)).toBeDefined();
    userEvent.hover(getByText(/file type must be jpeg, png or bmp/i));
    // We need to wait for the tooltip to be rendered before checking its content.
    await waitFor(() => expect(getByText(/File type must be/i)).toBeDefined());
  });

  it("do not displays the modal by default", async () => {
    const { queryByText } = await renderTest({});
    expect(queryByText(/Import/i)).not.toBeInTheDocument();
  });

  it("calls the onClose handler", async () => {
    const onClose = jest.fn();
    const { getByLabelText } = await renderTestAndImport([], {
      isOpen: true,
      onClose,
    });
    userEvent.click(getByLabelText("Close"));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("does not close the modal while files are uploading", async () => {
    const { getByLabelText } = await renderTestAndImport(files.slice(0, 1));
    expect(getByLabelText("Loading indicator")).toBeDefined();
    expect(getByLabelText("Close")).toBeDisabled();
    await ensuresUploadsAreFinished(1);
  });

  it("displays a start labeling button only when all the files are done", async () => {
    const { getByRole, queryByRole } = await renderTestAndImport(files);
    expect(
      queryByRole("button", { name: /Start labeling/ })
    ).not.toBeInTheDocument();
    await waitFor(() =>
      expect(getByRole("button", { name: /Start labeling/ })).toBeDefined()
    );
  });
});

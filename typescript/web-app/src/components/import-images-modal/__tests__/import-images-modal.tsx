import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";

import { ImportImagesModal } from "../import-images-modal";

const files = [
  new File(["Hello"], "hello.png", { type: "image/png" }),
  new File(["World"], "world.png", { type: "image/png" }),
  new File(["Error"], "error.pdf", { type: "application/pdf" }),
];

const onImportSucceed = jest.fn();

beforeEach(() => {
  onImportSucceed.mockClear();
});

function renderModalAndImport(filesToImport = files, props = {}) {
  render(
    <ImportImagesModal
      isOpen
      onClose={() => {}}
      onImportSucceed={onImportSucceed}
      {...props}
    />
  );
  const input = screen.getByLabelText(/drop folders or images/i);
  return waitFor(() => userEvent.upload(input, filesToImport));
}

test("should return the list of images the user picked", async () => {
  await renderModalAndImport();

  expect(onImportSucceed).toHaveBeenCalledWith(files.slice(0, 2));
});

test("should display the number of images", async () => {
  await renderModalAndImport();

  expect(screen.getByText(/uploading 3 items/i)).toBeDefined();
  expect(
    screen.queryByLabelText(/drop folders or images/i)
  ).not.toBeInTheDocument();
});

test("should display the images name", async () => {
  await renderModalAndImport();

  expect(screen.getByText(/hello.png/i)).toBeDefined();
  expect(screen.getByText(/world.png/i)).toBeDefined();
});

test("should display the rejected images name", async () => {
  await renderModalAndImport();

  expect(screen.getByText(/error.pdf/i)).toBeDefined();
  expect(screen.getByText(/errors/i)).toBeDefined();
});

test("should not display the rejected images name if everything is fine", async () => {
  await renderModalAndImport(files.slice(0, 2));

  expect(screen.queryByText(/items rejected/i)).not.toBeInTheDocument();
});

test("should display the amount of error when a file could not be imported", async () => {
  await renderModalAndImport(files.slice(2, 3));

  userEvent.hover(screen.getByText(/1 errors/i));

  expect(screen.getByText(/1 errors/i)).toBeDefined();
  // We need to wait for the tooltip to be rendered before checking its content.
  await waitFor(() =>
    expect(screen.getByText(/File type must be/i)).toBeDefined()
  );
});

test("should not display the modal by default", async () => {
  render(<ImportImagesModal onImportSucceed={onImportSucceed} />);

  expect(screen.queryByText(/Import/i)).not.toBeInTheDocument();
});

test("should call the onClose handler", async () => {
  const onClose = jest.fn();
  await renderModalAndImport([], { onClose });

  userEvent.click(screen.getByLabelText("Close"));

  expect(onClose).toHaveBeenCalled();
});

test("should clear the modal content when closed", async () => {
  await renderModalAndImport();

  userEvent.click(screen.getByLabelText("Close"));

  expect(screen.queryByText(/uploading 2 items/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/errors/i)).not.toBeInTheDocument();
});

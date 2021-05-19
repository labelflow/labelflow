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

function renderModalAndImport(filesToImport = files) {
  render(<ImportImagesModal onImportSucceed={onImportSucceed} />);
  const input = screen.getByLabelText(/drop folders or images/i);
  return waitFor(() => userEvent.upload(input, filesToImport));
}

test("should return the list of images the user picked", async () => {
  await renderModalAndImport();

  expect(onImportSucceed).toHaveBeenCalledWith(files.slice(0, 2));
});

test("should display the number of images", async () => {
  await renderModalAndImport();

  expect(screen.getByText(/uploading 2 items/i)).toBeDefined();
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

  expect(screen.getByText(/1 items rejected/i)).toBeDefined();
  expect(screen.getByText(/error.pdf/i)).toBeDefined();
});

test("should not display the rejected images name if everything is fine", async () => {
  await renderModalAndImport(files.slice(0, 2));

  expect(screen.queryByText(/items rejected/i)).not.toBeInTheDocument();
});

test("should display only rejected images name when all files are not valid", async () => {
  await renderModalAndImport(files.slice(2, 3));

  expect(screen.getByText(/1 items rejected/i)).toBeDefined();
  expect(screen.queryByText(/uploading/i)).not.toBeInTheDocument();
});

test("should display the amount of error when a file could not be imported", async () => {
  await renderModalAndImport(files.slice(2, 3));

  expect(screen.getByText(/1 errors/i)).toBeDefined();
  expect(screen.getByTitle(/File type must be/i)).toBeDefined();
});

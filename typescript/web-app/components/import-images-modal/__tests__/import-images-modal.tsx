import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";

import { ImportImagesModal } from "../import-images-modal";

const files = [
  new File(["Hello"], "hello.png", { type: "image/png" }),
  new File(["World"], "world.png", { type: "image/png" }),
];

const onImportSucceed = jest.fn();

beforeEach(() => {
  onImportSucceed.mockClear();

  render(<ImportImagesModal onImportSucceed={onImportSucceed} />);
  const input = screen.getByLabelText(/drop folders or images/i);
  return waitFor(() => userEvent.upload(input, files));
});

test("should return the list of images the user picked", async () => {
  expect(onImportSucceed).toHaveBeenCalledWith(files);
});

test("should display the number of images", async () => {
  expect(screen.getByText(/uploading 2 items/i)).toBeDefined();
  expect(
    screen.queryByLabelText(/drop folders or images/i)
  ).not.toBeInTheDocument();
});

test("should display the images name", async () => {
  expect(screen.getByText(/hello.png/i)).toBeDefined();
  expect(screen.getByText(/world.png/i)).toBeDefined();
});

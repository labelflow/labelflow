import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApolloProvider } from "@apollo/client";
import { PropsWithChildren } from "react";
import "@testing-library/jest-dom/extend-expect";

import { ImportImagesModal } from "../import-images-modal";
import { client } from "../../../../../connectors/apollo-client";

const files = [
  new File(["Hello"], "hello.png", { type: "image/png" }),
  new File(["World"], "world.png", { type: "image/png" }),
  new File(["Error"], "error.pdf", { type: "application/pdf" }),
];

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

// @ts-ignore
global.Image = class Image extends HTMLElement {
  width: number;

  height: number;

  constructor() {
    super();
    this.width = 42;
    this.height = 36;
    setTimeout(() => {
      this?.onload?.(new Event("onload")); // simulate success
    }, 100);
  }
};
// @ts-ignore
customElements.define("image-custom", global.Image);

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => "mockedUrl");
});

function renderModalAndImport(filesToImport = files, props = {}) {
  render(<ImportImagesModal isOpen onClose={() => {}} {...props} />, {
    wrapper: Wrapper,
  });
  const input = screen.getByLabelText(/drop folders or images/i);
  return waitFor(() => userEvent.upload(input, filesToImport));
}

test("should display the number of images", async () => {
  await renderModalAndImport();

  expect(screen.getByText(/uploading 3 items/i)).toBeDefined();
  expect(
    screen.queryByLabelText(/drop folders or images/i)
  ).not.toBeInTheDocument();
});

test("should display an indicator when upload succeed", async () => {
  await renderModalAndImport(files.slice(0, 1));

  await waitFor(() =>
    expect(screen.getByLabelText("Upload succeed")).toBeDefined()
  );
});

test("should display a loading indicator when file is uploading", async () => {
  await renderModalAndImport(files.slice(0, 1));

  await waitFor(() =>
    expect(screen.getByLabelText("Loading indicator")).toBeDefined()
  );
  await waitFor(() =>
    expect(screen.getByLabelText("Upload succeed")).toBeDefined()
  );
});

test("when the user drags invalid formats, only the valid pictures are uploaded", async () => {
  await renderModalAndImport();

  await waitFor(() =>
    expect(screen.getAllByLabelText("Upload succeed")).toHaveLength(2)
  );
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
  render(<ImportImagesModal />, {
    wrapper: Wrapper,
  });

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

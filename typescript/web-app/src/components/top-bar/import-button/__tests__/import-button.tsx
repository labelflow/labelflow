import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApolloProvider } from "@apollo/client";
import localforage from "localforage";

import { PropsWithChildren } from "react";

import { client } from "../../../../connectors/apollo-client";
import {
  createImage,
  clearGetUrlFromKeyMem,
} from "../../../../connectors/apollo-client/resolvers/image";
import { ImportButton } from "../import-button";

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => "mockedUrl");
});

beforeEach(async () => {
  clearGetUrlFromKeyMem();
  await localforage.clear();
  return jest.clearAllMocks();
});

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

const files = [
  new File(["Hello"], "hello.png", { type: "image/png" }),
  new File(["World"], "world.png", { type: "image/png" }),
];

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

const openModalAndDragFiles = async (filesToUpload: File[] | File = files) => {
  render(<ImportButton />, {
    wrapper: Wrapper,
  });

  userEvent.click(screen.getByRole("button"));

  const input = screen.getByLabelText(/drop folders or images/i);
  await waitFor(() => userEvent.upload(input, filesToUpload));
};

test("Open the modal when we click on the import button", async () => {
  render(<ImportButton />, {
    wrapper: Wrapper,
  });

  userEvent.click(screen.getByRole("button"));

  await waitFor(() => screen.getByLabelText(/drop folders or images/i));
});

test("1 file should be created when the user drops a single picture on the modal", async () => {
  await openModalAndDragFiles(files[0]);

  await waitFor(() =>
    expect(screen.getByLabelText("Upload succeed")).toBeDefined()
  );
});

test.skip("2 files should be created when the user drops 2 pictures on the modal", async () => {
  await openModalAndDragFiles(files);

  expect(createImage).toHaveBeenCalledTimes(2);
});

test.skip("when the user drags invalid formats, only the valid pictures are uploaded", async () => {
  await openModalAndDragFiles([
    ...files,
    new File(["Error"], "error.pdf", { type: "application/pdf" }),
  ]);

  expect(createImage).toHaveBeenCalledTimes(2);
});

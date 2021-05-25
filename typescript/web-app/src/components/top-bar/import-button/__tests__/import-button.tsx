import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApolloProvider } from "@apollo/client";
import localforage from "localforage";

import { PropsWithChildren } from "react";

import { client } from "../../../../connectors/apollo-client";
import { createImage } from "../../../../connectors/apollo-client/resolvers/image";
import { ImportButton } from "../import-button";

jest.mock("../../../../connectors/apollo-client/resolvers/image");

const mockedCreateImage = jest.fn();
(createImage as jest.Mock<any>).mockImplementation(mockedCreateImage);

beforeEach(() => {
  localforage.clear();
  jest.clearAllMocks();
});

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

  expect(createImage).toHaveBeenCalledTimes(1);
});

test("2 files should be created when the user drops 2 pictures on the modal", async () => {
  await openModalAndDragFiles(files);

  expect(createImage).toHaveBeenCalledTimes(2);
});

test("when the user drags invalid formats, only the valid pictures are uploaded", async () => {
  await openModalAndDragFiles([
    ...files,
    new File(["Error"], "error.pdf", { type: "application/pdf" }),
  ]);

  expect(createImage).toHaveBeenCalledTimes(2);
});

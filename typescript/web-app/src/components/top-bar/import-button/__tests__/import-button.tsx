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

beforeAll(() => {
  // @ts-ignore
  global.URL.createObjectURL = jest.fn(() => "mockedUrl");
});

beforeEach(() => {
  localforage.clear();
});

const files = [
  new File(["Hello"], "hello.png", { type: "image/png" }),
  new File(["World"], "world.png", { type: "image/png" }),
  new File(["Error"], "error.pdf", { type: "application/pdf" }),
];

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

test("Open the modal when we click on the import button", async () => {
  render(<ImportButton />, {
    wrapper: Wrapper,
  });

  userEvent.click(screen.getByRole("button"));

  await waitFor(() => screen.getByLabelText(/drop folders or images/i));
});

test("1 file should be created when the user drops a single picture on the modal", async () => {
  render(<ImportButton />, {
    wrapper: Wrapper,
  });

  userEvent.click(screen.getByRole("button"));

  // Drag files
  const input = screen.getByLabelText(/drop folders or images/i);
  await waitFor(() => userEvent.upload(input, files[0]));

  // Expect files uploaded
  expect(createImage).toHaveBeenCalledTimes(1);
});

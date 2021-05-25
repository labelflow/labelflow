import { ApolloProvider } from "@apollo/client";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { client } from "../../../../connectors/apollo-client";

import { ImportButton } from "../import-button";

const files = [
  new File(["Hello"], "hello.png", { type: "image/png" }),
  new File(["World"], "world.png", { type: "image/png" }),
  new File(["Error"], "error.pdf", { type: "application/pdf" }),
];

const createImage = jest.fn();

test("Open the modal when we click on the import button", async () => {
  render(<ImportButton />, {
    wrapper: (children) => (
      <ApolloProvider client={client}>{children}</ApolloProvider>
    ),
  });

  userEvent.click(screen.getByRole("button"));

  await waitFor(() => screen.getByLabelText(/drop folders or images/i));
});

test("File should be uploaded when users drops a single picture on the modal", async () => {
  render(<ImportButton />, {
    wrapper: (children) => (
      <ApolloProvider client={client}>{children}</ApolloProvider>
    ),
  });

  userEvent.click(screen.getByRole("button"));

  // Drag files
  const input = screen.getByLabelText(/drop folders or images/i);
  await waitFor(() => userEvent.upload(input, files));

  // Expect files uploaded
  expect(createImage).toHaveBeenCalledTimes(1);
});

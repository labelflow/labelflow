import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApolloProvider } from "@apollo/client";
import { PropsWithChildren } from "react";
import "@testing-library/jest-dom/extend-expect";

import { client } from "../../../connectors/apollo-client";
import { setupTestsWithLocalDatabase } from "../../../utils/setup-local-db-tests";

import { ImportButton } from "../import-button";

const files = [
  new File(["Hello"], "hello.png", { type: "image/png" }),
  new File(["World"], "world.png", { type: "image/png" }),
  new File(["Error"], "error.pdf", { type: "application/pdf" }),
];

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

setupTestsWithLocalDatabase();

/**
 * Mock the apollo client to avoid creating corrupted files that allows
 * us to identify a behaviour.
 */
jest.mock("../../../connectors/apollo-client", () => {
  const original = jest.requireActual("../../../connectors/apollo-client");

  return {
    client: { ...original.client, mutate: jest.fn(original.client.mutate) },
  };
});

test("should clear the modal content when closed", async () => {
  render(<ImportButton />, {
    wrapper: Wrapper,
  });

  userEvent.click(screen.getByLabelText("Add images"));

  const input = screen.getByLabelText(/drop folders or images/i);
  await waitFor(() => userEvent.upload(input, files));

  await waitFor(() =>
    expect(screen.getAllByLabelText("Upload succeed")).toHaveLength(2)
  );

  userEvent.click(screen.getByLabelText("Close"));

  await waitFor(() => {
    expect(screen.queryByText("Import")).not.toBeInTheDocument();
  });

  userEvent.click(screen.getByLabelText("Add images"));

  expect(screen.getByLabelText(/drop folders or images/i)).toBeDefined();

  // Ensure that we really don't have the old state
  expect(screen.queryByText(/Completed 2 of 2 items/i)).toBeNull();

  await waitFor(() =>
    userEvent.upload(screen.getByLabelText(/drop folders or images/i), [
      new File(["Bonjour"], "bonjour.png", { type: "image/png" }),
    ])
  );

  await waitFor(() =>
    expect(screen.getByText(/Completed 1 of 1 items/i)).toBeDefined()
  );
});

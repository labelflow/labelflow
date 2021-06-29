import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApolloProvider } from "@apollo/client";
import { PropsWithChildren } from "react";
import "@testing-library/jest-dom/extend-expect";

import { client } from "../../../connectors/apollo-client-schema";
import { setupTestsWithLocalDatabase } from "../../../utils/setup-local-db-tests";
import { mockUseQueryParams } from "../../../utils/router-mocks";
import { CreateProjectModal } from "../create-project-modal";

mockUseQueryParams();

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

setupTestsWithLocalDatabase();

/**
 * Mock the apollo client to avoid creating corrupted files that allows
 * us to identify a behaviour.
 */
jest.mock("../../../connectors/apollo-client-schema", () => {
  const original = jest.requireActual(
    "../../../connectors/apollo-client-schema"
  );

  return {
    client: { ...original.client, mutate: jest.fn(original.client.mutate) },
  };
});

jest.mock("lodash/fp/debounce", () => jest.fn((nr, fn) => fn));

function renderModal(props = {}) {
  render(<CreateProjectModal isOpen onClose={() => {}} {...props} />, {
    wrapper: Wrapper,
  });
}

test("should initialize modal with an empty input and a disabled button", async () => {
  renderModal();

  const input = screen.getByPlaceholderText(
    /project name/i
  ) as HTMLInputElement;
  const button = screen.getByText(/start/i);

  expect(input.value).toEqual("");
  expect(button).toHaveAttribute("disabled");
});

test("should enable start button when project name is not empty", async () => {
  renderModal();

  const input = screen.getByPlaceholderText(
    /project name/i
  ) as HTMLInputElement;

  fireEvent.change(input, { target: { value: "Good Day" } });
  expect(input.value).toBe("Good Day");

  const button = screen.getByText(/start/i);

  expect(button).not.toHaveAttribute("disabled");
});

test("should call the onClose handler", async () => {
  const onClose = jest.fn();
  renderModal({ onClose });

  userEvent.click(screen.getByLabelText("Close"));

  expect(onClose).toHaveBeenCalled();
});

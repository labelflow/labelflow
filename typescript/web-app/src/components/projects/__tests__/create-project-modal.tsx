import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApolloProvider } from "@apollo/client";
import { PropsWithChildren } from "react";
import "@testing-library/jest-dom/extend-expect";
import { gql } from "graphql-tag";

import { client } from "../../../connectors/apollo-client-schema";
import { setupTestsWithLocalDatabase } from "../../../utils/setup-local-db-tests";
import { mockUseQueryParams } from "../../../utils/router-mocks";
import { CreateProjectModal } from "../create-project-modal";

mockUseQueryParams();

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

setupTestsWithLocalDatabase();

jest.mock("lodash/fp/debounce", () => jest.fn((_, fn) => fn));

const renderModal = (props = {}) => {
  render(<CreateProjectModal isOpen onClose={() => {}} {...props} />, {
    wrapper: Wrapper,
  });
};

test("should initialize modal with an empty input and a disabled button", async () => {
  renderModal();

  const input = screen.getByLabelText(
    /project name input/i
  ) as HTMLInputElement;
  const button = screen.getByLabelText(/create project/i);

  expect(input.value).toEqual("");
  expect(button).toHaveAttribute("disabled");
});

test("should enable start button when project name is not empty", async () => {
  renderModal();

  const input = screen.getByLabelText(
    /project name input/i
  ) as HTMLInputElement;

  fireEvent.change(input, { target: { value: "Good Day" } });
  expect(input.value).toBe("Good Day");

  const button = screen.getByLabelText(/create project/i);

  await waitFor(() => {
    expect(button).not.toHaveAttribute("disabled");
  });
});

test("should create a project when the form is submitted", async () => {
  const onClose = jest.fn();
  renderModal({ onClose });

  const projectName = "Good Day";

  const input = screen.getByLabelText(
    /project name input/i
  ) as HTMLInputElement;
  const button = screen.getByLabelText(/create project/i);

  fireEvent.change(input, { target: { value: projectName } });
  fireEvent.click(button);

  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
  });

  const {
    data: {
      project: { name },
    },
  } = await client.query({
    query: gql`
      query getProjectByName($name: String) {
        project(where: { name: $name }) {
          name
        }
      }
    `,
    variables: { name: projectName },
  });

  expect(name).toEqual(projectName);
});

test("should display an error message if project name already exists", async () => {
  const projectName = "Good Day";

  await client.mutate({
    mutation: gql`
      mutation createProject($name: String) {
        createProject(data: { name: $name }) {
          id
        }
      }
    `,
    variables: { name: projectName },
  });

  renderModal();

  const input = screen.getByLabelText(
    /project name input/i
  ) as HTMLInputElement;

  fireEvent.change(input, { target: { value: "Good Day" } });

  const button = screen.getByLabelText(/create project/i);

  await waitFor(() => {
    expect(button).toHaveAttribute("disabled");
    expect(screen.getByText(/this name is already taken/i)).toBeDefined();
  });
});

test("should call the onClose handler", async () => {
  const onClose = jest.fn();
  renderModal({ onClose });

  userEvent.click(screen.getByLabelText("Close"));

  expect(onClose).toHaveBeenCalled();
});

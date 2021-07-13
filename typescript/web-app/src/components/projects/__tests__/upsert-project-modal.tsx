/* eslint-disable import/first */
import {
  render,
  cleanup,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApolloProvider } from "@apollo/client";
import { PropsWithChildren } from "react";
import "@testing-library/jest-dom/extend-expect";
import { gql } from "graphql-tag";

import { client } from "../../../connectors/apollo-client-schema";
import { setupTestsWithLocalDatabase } from "../../../utils/setup-local-db-tests";
import { mockUseQueryParams } from "../../../utils/router-mocks";

mockUseQueryParams();

import { UpsertProjectModal } from "../upsert-project-modal";

setupTestsWithLocalDatabase();

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

jest.mock("lodash/fp/debounce", () => jest.fn((_, fn) => fn));

const renderModal = (props = {}) => {
  return render(<UpsertProjectModal isOpen onClose={() => {}} {...props} />, {
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

  fireEvent.change(input, { target: { value: projectName } });

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

test("update project: should have project name pre-filled when renaming existing project", async () => {
  const projectName = "Good Day";

  const {
    data: {
      createProject: { id: projectId },
    },
  } = await client.mutate({
    mutation: gql`
      mutation createProject($name: String) {
        createProject(data: { name: $name }) {
          id
        }
      }
    `,
    variables: { name: projectName },
  });

  renderModal({ projectId });

  const input = screen.getByLabelText(
    /project name input/i
  ) as HTMLInputElement;

  await waitFor(() => {
    expect(input.value).toBe(projectName);
  });

  const button = screen.getByLabelText(/update project/i);

  await waitFor(() => {
    expect(button).not.toHaveAttribute("disabled");
  });
});

test("update project: should update a project when the form is submitted", async () => {
  const projectName = "Bad Day";
  const projectNewName = "Good Day";

  const {
    data: {
      createProject: { id: projectId },
    },
  } = await client.mutate({
    mutation: gql`
      mutation createProject($name: String) {
        createProject(data: { name: $name }) {
          id
        }
      }
    `,
    variables: { name: projectName },
  });

  const onClose1 = jest.fn();

  renderModal({ projectId, onClose: onClose1 });

  const input1 = screen.getByLabelText(
    /project name input/i
  ) as HTMLInputElement;

  await waitFor(() => {
    expect(input1.value).toBe(projectName);
  });

  const button = screen.getByLabelText(/update project/i);

  userEvent.click(input1);
  userEvent.clear(input1);
  userEvent.type(input1, projectNewName);
  userEvent.click(button);

  expect(input1.value).toBe(projectNewName);

  await waitFor(() => {
    expect(onClose1).toHaveBeenCalled();
  });

  await act(async () => {
    // Check that new name is in DB, works
    const {
      data: {
        project: { name: name1 },
      },
    } = await client.query({
      query: gql`
        query getProjectById($id: ID) {
          project(where: { id: $id }) {
            id
            name
          }
        }
      `,
      variables: { id: projectId },
      fetchPolicy: "no-cache",
    });

    expect(name1).toEqual(projectNewName);
  });

  await waitFor(() => {
    expect(onClose1).toHaveBeenCalled();
  });

  // // FIXME: This checks that we can find the project by name in the DB after renaming it, does NOT work
  // const {
  //   data: {
  //     project: { name: name2 },
  //   },
  // } = await client.query({
  //   query: gql`
  //     query getProjectByName($name: String) {
  //       project(where: { name: $name }) {
  //         id
  //         name
  //       }
  //     }
  //   `,
  //   variables: { name: projectNewName },
  //   fetchPolicy: "no-cache",
  // });
  // expect(name2).toEqual(projectNewName);

  const onClose2 = jest.fn();

  // FIXME: the cleanup causes the test to be flaky
  cleanup();
  renderModal({ projectId, onClose: onClose2 });

  const input2 = screen.getByLabelText(
    /project name input/i
  ) as HTMLInputElement;

  await waitFor(() => {
    expect(input2.value).toBe(projectNewName);
  });
});

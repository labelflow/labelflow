/* eslint-disable import/first */
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { v4 as uuid } from "uuid";
import { ApolloProvider, gql } from "@apollo/client";
import { PropsWithChildren } from "react";
import "@testing-library/jest-dom/extend-expect";

import userEvent from "@testing-library/user-event";
import { client } from "../../../connectors/apollo-client/schema-client";
import { setupTestsWithLocalDatabase } from "../../../utils/setup-local-db-tests";
import {
  mockUseQueryParams,
  mockNextRouter,
} from "../../../utils/router-mocks";

mockUseQueryParams();
mockNextRouter({ query: { workspaceSlug: "local" } });

import { UpsertClassModal } from "../upsert-class-modal";

setupTestsWithLocalDatabase();

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

jest.mock("lodash/fp/debounce", () => jest.fn((_, fn) => fn));

const renderModal = (props = {}) => {
  return render(<UpsertClassModal isOpen datasetSlug="test" {...props} />, {
    wrapper: Wrapper,
  });
};

it("Should render edit modal when a class id is passed", async () => {
  renderModal({ classId: "classId" });
  expect(screen.getByText("Edit Class")).toBeDefined();
});

it("Should render create modal when a class id is not passed", async () => {
  renderModal();
  expect(screen.getByText("New Class")).toBeDefined();
});

it("Should render a modal with an empty input and a disabled button", () => {
  renderModal({ classId: "classId" });

  const input = screen.getByLabelText(/Class name input/i) as HTMLInputElement;

  const button = screen.getByLabelText(/Update/i);

  expect(input.value).toEqual("");
  expect(button).toHaveAttribute("disabled");
});

it("Should enable update button when class name is not empty", async () => {
  renderModal({ classId: "classId" });
  const input = screen.getByLabelText(/Class name input/i) as HTMLInputElement;

  fireEvent.change(input, { target: { value: "My new class" } });
  expect(input.value).toBe("My new class");

  const button = screen.getByLabelText(/Update/i);
  await waitFor(() => {
    expect(button).not.toHaveAttribute("disabled");
  });
});

it("Should create a label class when the form is submitted", async () => {
  const onClose = jest.fn();

  // We need to create a dataset to attach the new LabelClass to
  const datasetName = "test";
  const {
    data: {
      createDataset: { id: datasetId },
    },
  } = await client.mutate({
    mutation: gql`
      mutation createDataset($name: String) {
        createDataset(data: { name: $name, workspaceSlug: "local" }) {
          id
          name
          slug
        }
      }
    `,
    variables: { name: datasetName },
  });
  renderModal({ datasetId, onClose });

  const className = "My new class";

  const input = screen.getByLabelText(/Class name input/i) as HTMLInputElement;
  const button = screen.getByLabelText(/Create/i);

  fireEvent.change(input, { target: { value: className } });
  fireEvent.click(button);

  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
  });

  await act(async () => {
    const {
      data: { labelClasses },
    } = await client.query({
      query: gql`
        query getLabelClasses {
          labelClasses {
            id
            name
          }
        }
      `,
    });
    expect(labelClasses[0].name).toBe(className);
  });
});

it("Should display an error message if the label class already exists", async () => {
  const onClose = jest.fn();
  const datasetName = "test";
  const labelClassName = "Horse";
  const {
    data: {
      createDataset: { id: datasetId },
    },
  } = await client.mutate({
    mutation: gql`
      mutation createDataset($name: String) {
        createDataset(data: { name: $name, workspaceSlug: "local" }) {
          id
          name
          slug
        }
      }
    `,
    variables: { name: datasetName },
  });

  await client.mutate({
    mutation: gql`
      mutation createLabelClassMutation(
        $id: ID!
        $name: String!
        $color: ColorHex!
        $datasetId: ID!
      ) {
        createLabelClass(
          data: { name: $name, id: $id, color: $color, datasetId: $datasetId }
        ) {
          id
          name
          color
        }
      }
    `,
    variables: {
      name: labelClassName,
      id: uuid(),
      color: "#F87171",
      datasetId,
    },
  });

  renderModal({ datasetId, onClose });
  const input = screen.getByLabelText(/class name input/i) as HTMLInputElement;

  fireEvent.change(input, { target: { value: labelClassName } });

  const button = screen.getByLabelText(/create/i);

  await waitFor(() => {
    expect(button).toHaveAttribute("disabled");
    expect(screen.getByText(/this name is already taken/i)).toBeDefined();
  });
});

it("Should update a dataset when the form is submitted", async () => {
  const onClose = jest.fn();
  const datasetName = "test";
  const labelClassName = "Horse";
  const newLabelClassName = "Dog";
  const {
    data: {
      createDataset: { id: datasetId },
    },
  } = await client.mutate({
    mutation: gql`
      mutation createDataset($name: String) {
        createDataset(data: { name: $name, workspaceSlug: "local" }) {
          id
          name
          slug
        }
      }
    `,
    variables: { name: datasetName },
  });

  const {
    data: {
      createLabelClass: { id: labelClassId },
    },
  } = await client.mutate({
    mutation: gql`
      mutation createLabelClassMutation(
        $id: ID!
        $name: String!
        $color: ColorHex!
        $datasetId: ID!
      ) {
        createLabelClass(
          data: { name: $name, id: $id, color: $color, datasetId: $datasetId }
        ) {
          id
          name
          color
        }
      }
    `,
    variables: {
      name: labelClassName,
      id: uuid(),
      color: "#F87171",
      datasetId,
    },
  });

  renderModal({ classId: labelClassId, datasetId, onClose });

  const input = screen.getByLabelText(/class name input/i) as HTMLInputElement;
  const button = screen.getByLabelText(/update/i);

  userEvent.click(input);
  userEvent.type(input, newLabelClassName);
  await waitFor(() => {
    expect(input.value).toBe(newLabelClassName);
  });

  userEvent.click(button);
  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
  });

  await act(async () => {
    const {
      data: {
        labelClass: { name: newLabelClassNameFromQuery },
      },
    } = await client.query({
      query: gql`
        query getLabelClassById($id: ID) {
          labelClass(where: { id: $id }) {
            name
          }
        }
      `,
      variables: { id: labelClassId },
      fetchPolicy: "no-cache",
    });
    expect(newLabelClassNameFromQuery).toEqual(newLabelClassName);
  });
});

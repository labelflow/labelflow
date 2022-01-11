/* eslint-disable import/first */
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApolloProvider, gql } from "@apollo/client";
import { PropsWithChildren } from "react";
import "@testing-library/jest-dom/extend-expect";

import { client } from "../../../connectors/apollo-client/schema-client";
import { setupTestsWithLocalDatabase } from "../../../utils/setup-local-db-tests";
import {
  mockUseQueryParams,
  mockNextRouter,
} from "../../../utils/router-mocks";

mockUseQueryParams();
mockNextRouter({ query: { workspaceSlug: "local" } });

import { UpsertDatasetModal } from "../upsert-dataset-modal";
import { getDatasetsQuery } from "../dataset-list";

setupTestsWithLocalDatabase();

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

jest.mock("lodash/fp/debounce", () => jest.fn((_, fn) => fn));

const renderModal = (props = {}) => {
  return render(<UpsertDatasetModal isOpen onClose={() => {}} {...props} />, {
    wrapper: Wrapper,
  });
};

test("should initialize modal with an empty input and a disabled button", async () => {
  renderModal();

  const input = screen.getByLabelText(
    /dataset name input/i
  ) as HTMLInputElement;
  const button = screen.getByLabelText(/create dataset/i);

  expect(input.value).toEqual("");
  expect(button).toHaveAttribute("disabled");
});

test("should enable start button when dataset name is not empty", async () => {
  renderModal();

  const input = screen.getByLabelText(
    /dataset name input/i
  ) as HTMLInputElement;

  fireEvent.change(input, { target: { value: "Good Day" } });
  expect(input.value).toBe("Good Day");

  const button = screen.getByLabelText(/create dataset/i);

  await waitFor(() => {
    expect(button).not.toHaveAttribute("disabled");
  });
});

test("should create a dataset when the form is submitted", async () => {
  const onClose = jest.fn();
  // Used to put the query in apollo's cache
  await client.query({
    query: getDatasetsQuery,
    variables: { where: { workspaceSlug: "local" } },
  });
  renderModal({ onClose });

  const datasetSlug = "good-day";

  const input = screen.getByLabelText(
    /dataset name input/i
  ) as HTMLInputElement;
  const button = screen.getByLabelText(/create dataset/i);

  fireEvent.change(input, { target: { value: datasetSlug } });
  fireEvent.click(button);

  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
  });

  const {
    data: {
      dataset: { slug },
    },
  } = await client.query({
    query: gql`
      query getDatasetByName($slug: String) {
        dataset(where: { slugs: { slug: $slug, workspaceSlug: "local" } }) {
          slug
        }
      }
    `,
    variables: { slug: datasetSlug },
  });

  expect(slug).toEqual(datasetSlug);
});

test("should display an error message if dataset name already exists", async () => {
  const datasetName = "Good Day";

  await client.mutate({
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

  renderModal();

  const input = screen.getByLabelText(
    /dataset name input/i
  ) as HTMLInputElement;

  fireEvent.change(input, { target: { value: datasetName } });

  const button = screen.getByLabelText(/create dataset/i);

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

test("update dataset: should have dataset name pre-filled when renaming existing dataset", async () => {
  const datasetName = "Good Day";

  const {
    data: {
      createDataset: { id: datasetId },
    },
  } = await client.mutate({
    mutation: gql`
      mutation createDataset($name: String) {
        createDataset(data: { name: $name, workspaceSlug: "local" }) {
          id
        }
      }
    `,
    variables: { name: datasetName },
  });

  renderModal({ datasetId });

  const input = screen.getByLabelText(
    /dataset name input/i
  ) as HTMLInputElement;

  await waitFor(() => {
    expect(input.value).toBe(datasetName);
  });

  const button = screen.getByLabelText(/update dataset/i);

  await waitFor(() => {
    expect(button).not.toHaveAttribute("disabled");
  });
});

test("update dataset: should update a dataset when the form is submitted", async () => {
  const datasetName = "Bad Day";
  const datasetNewName = "Good Day";

  const {
    data: {
      createDataset: { id: datasetId },
    },
  } = await client.mutate({
    mutation: gql`
      mutation createDataset($name: String) {
        createDataset(data: { name: $name, workspaceSlug: "local" }) {
          id
        }
      }
    `,
    variables: { name: datasetName },
  });

  const onClose = jest.fn();

  renderModal({ datasetId, onClose });

  const input = screen.getByLabelText(
    /dataset name input/i
  ) as HTMLInputElement;

  await waitFor(() => {
    expect(input.value).toBe(datasetName);
  });

  const button = screen.getByLabelText(/update dataset/i);

  userEvent.click(input);
  userEvent.clear(input);
  userEvent.type(input, datasetNewName);
  await waitFor(() => {
    expect(input.value).toBe(datasetNewName);
  });

  userEvent.click(button);

  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
  });

  await act(async () => {
    // Check that new name is in DB, works
    const {
      data: {
        dataset: { name: name1 },
      },
    } = await client.query({
      query: gql`
        query getDatasetById($id: ID) {
          dataset(where: { id: $id }) {
            id
            name
          }
        }
      `,
      variables: { id: datasetId },
      fetchPolicy: "no-cache",
    });

    expect(name1).toEqual(datasetNewName);
  });
});

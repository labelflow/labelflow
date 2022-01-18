/* eslint-disable import/first */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import {
  getApolloMockWrapper,
  ApolloMockedResponse,
} from "../../../utils/testing/mock-apollo";
import { mockDatasetSimple } from "../../../utils/testing/mock-data";
import { mockNextRouter } from "../../../utils/router-mocks";

mockNextRouter({ query: { workspaceSlug: mockDatasetSimple.workspace.slug } });

import {
  createDatasetMutation,
  updateDatasetMutation,
  getDatasetByIdQuery,
  getDatasetBySlugQuery,
  UpsertDatasetModal,
} from "../upsert-dataset-modal";

const updatedDatasetName = "My new test dataset";
const mockQueries: Record<string, ApolloMockedResponse> = {
  getDatasetById: {
    request: {
      query: getDatasetByIdQuery,
      variables: { id: mockDatasetSimple.id },
    },
    result: {
      data: {
        dataset: { id: mockDatasetSimple.id, name: mockDatasetSimple.name },
      },
    },
  },
  getDatasetBySlug: {
    request: {
      query: getDatasetBySlugQuery,
      variables: {
        slug: mockDatasetSimple.slug,
        workspaceSlug: mockDatasetSimple.workspace.slug,
      },
    },
    result: {
      data: {
        searchDataset: {
          id: mockDatasetSimple.id,
          slug: mockDatasetSimple.slug,
        },
      },
    },
  },
  createDataset: {
    request: {
      query: createDatasetMutation,
      variables: {
        name: mockDatasetSimple.name,
        workspaceSlug: mockDatasetSimple.workspace.slug,
      },
    },
    newData: jest.fn(() => ({
      data: {
        createDataset: { id: mockDatasetSimple.id },
      },
    })),
  },
  updateDataset: {
    request: {
      query: updateDatasetMutation,
      variables: {
        id: mockDatasetSimple.id,
        name: updatedDatasetName,
      },
    },
    newData: jest.fn(() => ({
      data: {
        updateDataset: { id: mockDatasetSimple.id },
      },
    })),
  },
};

const renderModal = (props = {}) => {
  return render(<UpsertDatasetModal isOpen onClose={() => {}} {...props} />, {
    wrapper: getApolloMockWrapper(Object.values(mockQueries)),
  });
};

afterEach(() => {
  jest.clearAllMocks();
});

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
  renderModal({ onClose });
  const input = screen.getByLabelText(
    /dataset name input/i
  ) as HTMLInputElement;
  const button = screen.getByLabelText(/create dataset/i);
  fireEvent.change(input, { target: { value: mockDatasetSimple.name } });
  fireEvent.click(button);
  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
    expect(mockQueries.createDataset.newData).toHaveBeenCalledTimes(1);
  });
});

test("should display an error message if dataset name already exists", async () => {
  renderModal();
  const input = screen.getByLabelText(
    /dataset name input/i
  ) as HTMLInputElement;
  fireEvent.change(input, { target: { value: mockDatasetSimple.name } });
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
  renderModal({ datasetId: mockDatasetSimple.id });
  const input = screen.getByLabelText(
    /dataset name input/i
  ) as HTMLInputElement;
  await waitFor(() => {
    expect(input.value).toBe(mockDatasetSimple.name);
  });
  const button = screen.getByLabelText(/update dataset/i);
  await waitFor(() => {
    expect(button).not.toHaveAttribute("disabled");
  });
});

test("update dataset: should update a dataset when the form is submitted", async () => {
  const onClose = jest.fn();
  renderModal({ datasetId: mockDatasetSimple.id, onClose });
  const input = screen.getByLabelText(
    /dataset name input/i
  ) as HTMLInputElement;
  await waitFor(() => {
    expect(input.value).toBe(mockDatasetSimple.name);
  });
  const button = screen.getByLabelText(/update dataset/i);
  userEvent.click(input);
  userEvent.clear(input);
  userEvent.type(input, updatedDatasetName);
  await waitFor(() => {
    expect(input.value).toBe(updatedDatasetName);
  });
  userEvent.click(button);
  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
  });
  expect(mockQueries.updateDataset.newData).toHaveBeenCalledTimes(1);
});

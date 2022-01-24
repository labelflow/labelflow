/* eslint-disable import/first */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { getMockApolloWrapper } from "../../../utils/tests/mock-apollo";
import { MOCK_DATASET_SIMPLE } from "../../../utils/tests/data.fixtures";
import { mockNextRouter } from "../../../utils/router-mocks";

mockNextRouter({
  query: { workspaceSlug: MOCK_DATASET_SIMPLE.workspace.slug },
});

import { UpsertDatasetModal } from "../upsert-dataset-modal";
import {
  APOLLO_MOCKS,
  MOCK_UPDATED_DATASET_NAME,
} from "../upsert-dataset-modal.fixtures";

const renderModal = (props = {}) => {
  return render(<UpsertDatasetModal isOpen onClose={() => {}} {...props} />, {
    wrapper: getMockApolloWrapper(APOLLO_MOCKS),
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
  fireEvent.change(input, { target: { value: MOCK_DATASET_SIMPLE.name } });
  fireEvent.click(button);
  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
    expect(APOLLO_MOCKS.createDataset.result).toHaveBeenCalled();
  });
});

test("should display an error message if dataset name already exists", async () => {
  renderModal();
  const input = screen.getByLabelText(
    /dataset name input/i
  ) as HTMLInputElement;
  fireEvent.change(input, { target: { value: MOCK_DATASET_SIMPLE.name } });
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
  renderModal({ datasetId: MOCK_DATASET_SIMPLE.id });
  const input = screen.getByLabelText(
    /dataset name input/i
  ) as HTMLInputElement;
  await waitFor(() => {
    expect(input.value).toBe(MOCK_DATASET_SIMPLE.name);
  });
  const button = screen.getByLabelText(/update dataset/i);
  await waitFor(() => {
    expect(button).not.toHaveAttribute("disabled");
  });
});

test("update dataset: should update a dataset when the form is submitted", async () => {
  const onClose = jest.fn();
  renderModal({ datasetId: MOCK_DATASET_SIMPLE.id, onClose });
  const input = screen.getByLabelText(
    /dataset name input/i
  ) as HTMLInputElement;
  await waitFor(() => {
    expect(input.value).toBe(MOCK_DATASET_SIMPLE.name);
  });
  const button = screen.getByLabelText(/update dataset/i);
  userEvent.click(input);
  userEvent.clear(input);
  userEvent.type(input, MOCK_UPDATED_DATASET_NAME);
  await waitFor(() => {
    expect(input.value).toBe(MOCK_UPDATED_DATASET_NAME);
  });
  userEvent.click(button);
  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
  });
  expect(APOLLO_MOCKS.updateDataset.result).toHaveBeenCalled();
});

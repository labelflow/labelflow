/* eslint-disable import/first */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { getApolloMockWrapper } from "../../../utils/tests/apollo-mock";
import { BASIC_DATASET_MOCK } from "../../../utils/tests/data.fixtures";
import { mockNextRouter } from "../../../utils/router-mocks";

mockNextRouter({
  query: { workspaceSlug: BASIC_DATASET_MOCK.workspace.slug },
});

import { UpsertDatasetModal } from "../upsert-dataset-modal";
import {
  APOLLO_MOCKS,
  UPDATED_DATASET_MOCK_NAME,
  CREATE_DATASET_MOCK,
  UPDATE_DATASET_MOCK,
} from "../upsert-dataset-modal.fixtures";

const renderModal = (props = {}) => {
  return render(<UpsertDatasetModal isOpen onClose={() => {}} {...props} />, {
    wrapper: getApolloMockWrapper(APOLLO_MOCKS),
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
  fireEvent.change(input, { target: { value: BASIC_DATASET_MOCK.name } });
  fireEvent.click(button);
  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
    expect(CREATE_DATASET_MOCK.result).toHaveBeenCalled();
  });
});

test("should display an error message if dataset name already exists", async () => {
  renderModal();
  const input = screen.getByLabelText(
    /dataset name input/i
  ) as HTMLInputElement;
  fireEvent.change(input, { target: { value: BASIC_DATASET_MOCK.name } });
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
  renderModal({ datasetId: BASIC_DATASET_MOCK.id });
  const input = screen.getByLabelText(
    /dataset name input/i
  ) as HTMLInputElement;
  await waitFor(() => {
    expect(input.value).toBe(BASIC_DATASET_MOCK.name);
  });
  const button = screen.getByLabelText(/update dataset/i);
  await waitFor(() => {
    expect(button).not.toHaveAttribute("disabled");
  });
});

test("update dataset: should update a dataset when the form is submitted", async () => {
  const onClose = jest.fn();
  renderModal({ datasetId: BASIC_DATASET_MOCK.id, onClose });
  const input = screen.getByLabelText(
    /dataset name input/i
  ) as HTMLInputElement;
  await waitFor(() => {
    expect(input.value).toBe(BASIC_DATASET_MOCK.name);
  });
  const button = screen.getByLabelText(/update dataset/i);
  userEvent.click(input);
  userEvent.clear(input);
  userEvent.type(input, UPDATED_DATASET_MOCK_NAME);
  await waitFor(() => {
    expect(input.value).toBe(UPDATED_DATASET_MOCK_NAME);
  });
  userEvent.click(button);
  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
  });
  expect(UPDATE_DATASET_MOCK.result).toHaveBeenCalled();
});

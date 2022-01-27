import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { getApolloMockWrapper } from "../../../utils/tests/apollo-mock";
import { DeleteDatasetModal } from "../delete-dataset-modal";
import { BASIC_DATASET_MOCK } from "../../../utils/tests/data.fixtures";
import {
  APOLLO_MOCKS,
  DELETE_DATASET_BY_ID_MOCK,
} from "../delete-dataset-modal.fixtures";

const renderModal = (props = {}) => {
  return render(<DeleteDatasetModal isOpen {...props} />, {
    wrapper: getApolloMockWrapper(APOLLO_MOCKS),
  });
};

afterEach(() => {
  jest.clearAllMocks();
});

test("should delete a dataset when the button is clicked", async () => {
  const onClose = jest.fn();
  renderModal({ onClose, datasetId: BASIC_DATASET_MOCK.id });
  const button = screen.getByLabelText(/Dataset delete/i);
  fireEvent.click(button);
  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
  });
  expect(DELETE_DATASET_BY_ID_MOCK.result).toHaveBeenCalled();
});

test("shouldn't delete a dataset when the cancel is clicked", async () => {
  const onClose = jest.fn();
  renderModal({ onClose, datasetId: BASIC_DATASET_MOCK.id });
  const button = screen.getByLabelText(/Cancel delete/i);
  fireEvent.click(button);
  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
  });
  expect(DELETE_DATASET_BY_ID_MOCK.result).not.toHaveBeenCalled();
});

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { getMockApolloWrapper } from "../../../utils/tests/mock-apollo";
import { DeleteDatasetModal } from "../delete-dataset-modal";
import { MOCK_DATASET_SIMPLE } from "../../../utils/tests/data.fixtures";
import { APOLLO_MOCKS } from "../delete-dataset-modal.fixtures";

const renderModal = (props = {}) => {
  return render(<DeleteDatasetModal isOpen {...props} />, {
    wrapper: getMockApolloWrapper(APOLLO_MOCKS),
  });
};

afterEach(() => {
  jest.clearAllMocks();
});

test("should delete a dataset when the button is clicked", async () => {
  const onClose = jest.fn();
  renderModal({ onClose, datasetId: MOCK_DATASET_SIMPLE.id });
  const button = screen.getByLabelText(/Dataset delete/i);
  fireEvent.click(button);
  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
  });
  expect(APOLLO_MOCKS.deleteDatasetById.result).toHaveBeenCalled();
});

test("shouldn't delete a dataset when the cancel is clicked", async () => {
  const onClose = jest.fn();
  renderModal({ onClose, datasetId: MOCK_DATASET_SIMPLE.id });
  const button = screen.getByLabelText(/Cancel delete/i);
  fireEvent.click(button);
  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
  });
  expect(APOLLO_MOCKS.deleteDatasetById.result).not.toHaveBeenCalled();
});

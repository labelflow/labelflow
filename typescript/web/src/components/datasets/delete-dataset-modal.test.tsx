import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BASIC_DATASET_DATA } from "../../utils/fixtures";
import { getApolloMockWrapper } from "../../utils/tests";
import { DeleteDatasetModal } from "./delete-dataset-modal";
import {
  APOLLO_MOCKS,
  DELETE_DATASET_BY_ID_MOCK,
} from "./delete-dataset-modal.fixtures";

const renderModal = (props = {}) => {
  return render(<DeleteDatasetModal isOpen {...props} />, {
    wrapper: getApolloMockWrapper(APOLLO_MOCKS),
  });
};

describe(DeleteDatasetModal, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deletes a dataset when the delete button is clicked", async () => {
    const onClose = jest.fn();
    renderModal({ onClose, datasetId: BASIC_DATASET_DATA.id });
    const button = screen.getByTestId("confirm-delete-button");
    fireEvent.click(button);
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(DELETE_DATASET_BY_ID_MOCK.result).toHaveBeenCalled();
  });

  it("does not delete a dataset when the cancel button is clicked", async () => {
    const onClose = jest.fn();
    renderModal({ onClose, datasetId: BASIC_DATASET_DATA.id });
    const button = screen.getByLabelText(/Cancel delete/i);
    fireEvent.click(button);
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(DELETE_DATASET_BY_ID_MOCK.result).not.toHaveBeenCalled();
  });
});

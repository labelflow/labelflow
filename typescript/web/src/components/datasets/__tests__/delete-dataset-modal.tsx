import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { v4 as uuidV4 } from "uuid";
import {
  getApolloMockWrapper,
  ApolloMockedResponse,
} from "../../../utils/testing/mock-apollo";
import {
  DeleteDatasetModal,
  getDatasetByIdQuery,
  deleteDatasetByIdMutation,
} from "../delete-dataset-modal";
import { mockDatasetSimple } from "../../../utils/testing/mock-data";

const mockQueries: Record<string, ApolloMockedResponse> = {
  getDatasetById: {
    request: {
      query: getDatasetByIdQuery,
      variables: { id: mockDatasetSimple.id },
    },
    result: {
      data: { dataset: { name: mockDatasetSimple.name } },
    },
  },
  deleteDatasetById: {
    request: {
      query: deleteDatasetByIdMutation,
      variables: { id: mockDatasetSimple.id },
    },
    newData: jest.fn(() => ({
      data: { deleteDataset: { id: mockDatasetSimple.id } },
    })),
  },
};

const renderModal = (props = {}) => {
  return render(<DeleteDatasetModal isOpen {...props} />, {
    wrapper: getApolloMockWrapper(Object.values(mockQueries)),
  });
};

afterEach(() => {
  jest.clearAllMocks();
});

test("should delete a dataset when the button is clicked", async () => {
  const onClose = jest.fn();
  renderModal({ onClose, datasetId: mockDatasetSimple.id });
  const button = screen.getByLabelText(/Dataset delete/i);
  fireEvent.click(button);
  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
  });
  expect(mockQueries.deleteDatasetById.newData).toHaveBeenCalledTimes(1);
});

test("shouldn't delete a dataset when the cancel is clicked", async () => {
  const onClose = jest.fn();
  renderModal({ onClose, datasetId: uuidV4() });
  const button = screen.getByLabelText(/Cancel delete/i);
  fireEvent.click(button);
  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
  });
  expect(mockQueries.deleteDatasetById.newData).toHaveBeenCalledTimes(0);
});

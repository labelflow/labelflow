import { fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";

import { mockWorkspace } from "../../utils/tests/mock-workspace";

mockWorkspace();

import { BASIC_DATASET_DATA } from "../../utils/fixtures";
import {
  ApolloMockResponses,
  injectJestInApolloMockResults,
  renderWithTestWrapper,
} from "../../utils/tests";
import { UpsertDatasetModal } from "./upsert-dataset-modal";
import {
  APOLLO_MOCKS,
  UPDATED_DATASET_MOCK_NAME,
} from "./upsert-dataset-modal.fixtures";

const APOLLO_MOCKS_WITH_JEST = injectJestInApolloMockResults(APOLLO_MOCKS);

const renderModal = (props = {}) =>
  renderWithTestWrapper(
    <UpsertDatasetModal isOpen onClose={() => {}} {...props} />,
    {
      auth: { withWorkspaces: true },
      apollo: { extraMocks: APOLLO_MOCKS_WITH_JEST as ApolloMockResponses },
    }
  );

describe(UpsertDatasetModal, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("initializes modal with an empty input and a disabled button", async () => {
    const { getByLabelText } = await renderModal();
    const input = getByLabelText(/dataset name input/i) as HTMLInputElement;
    const button = getByLabelText(/create dataset/i);
    expect(input.value).toEqual("");
    expect(button).toHaveAttribute("disabled");
  });

  it("enables start button when dataset name is not empty", async () => {
    const { getByLabelText } = await renderModal();
    const input = getByLabelText(/dataset name input/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Good Day" } });
    expect(input.value).toBe("Good Day");
    const button = getByLabelText(/create dataset/i);
    await waitFor(() => expect(button).not.toHaveAttribute("disabled"));
  });

  it("creates a dataset when the form is submitted", async () => {
    const onClose = jest.fn();
    const { getByLabelText } = await renderModal({ onClose });
    const input = getByLabelText(/dataset name input/i) as HTMLInputElement;
    const button = getByLabelText(/create dataset/i);
    fireEvent.change(input, { target: { value: BASIC_DATASET_DATA.name } });
    fireEvent.click(button);
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
      expect(APOLLO_MOCKS_WITH_JEST[3].result).toHaveBeenCalled();
    });
  });

  it("displays an error message if dataset name already exists", async () => {
    const { getByLabelText, getByText } = await renderModal();
    const input = getByLabelText(/dataset name input/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: BASIC_DATASET_DATA.name } });
    const button = getByLabelText(/create dataset/i);
    await waitFor(() => {
      expect(button).toHaveAttribute("disabled");
      expect(getByText(/this name is already taken/i)).toBeDefined();
    });
  });

  it("calls the onClose handler", async () => {
    const onClose = jest.fn();
    const { getByLabelText } = await renderModal({ onClose });
    userEvent.click(getByLabelText("Close"));
    expect(onClose).toHaveBeenCalled();
  });

  it("have dataset name pre-filled when renaming existing dataset", async () => {
    const { getByLabelText } = await renderModal({
      datasetId: BASIC_DATASET_DATA.id,
    });
    const input = getByLabelText(/dataset name input/i) as HTMLInputElement;
    await waitFor(() => expect(input.value).toBe(BASIC_DATASET_DATA.name));
    const button = getByLabelText(/update dataset/i);
    await waitFor(() => expect(button).not.toHaveAttribute("disabled"));
  });

  it("updates a dataset when the form is submitted", async () => {
    const onClose = jest.fn();
    const { getByLabelText } = await renderModal({
      datasetId: BASIC_DATASET_DATA.id,
      onClose,
    });
    const input = getByLabelText(/dataset name input/i) as HTMLInputElement;
    await waitFor(() => expect(input.value).toBe(BASIC_DATASET_DATA.name));
    const button = getByLabelText(/update dataset/i);
    userEvent.click(input);
    userEvent.clear(input);
    userEvent.type(input, UPDATED_DATASET_MOCK_NAME);
    await waitFor(() => expect(input.value).toBe(UPDATED_DATASET_MOCK_NAME));
    userEvent.click(button);
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(APOLLO_MOCKS_WITH_JEST[4].result).toHaveBeenCalled();
  });
});

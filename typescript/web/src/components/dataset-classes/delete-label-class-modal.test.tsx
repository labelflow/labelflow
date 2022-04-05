import { act, fireEvent, render, screen } from "@testing-library/react";
import { WildcardMockLink } from "wildcard-mock-link";
import { BASIC_LABEL_CLASS_DATA } from "../../utils/fixtures";
import {
  ApolloMockResponses,
  getApolloMockLink,
  getApolloMockWrapper,
} from "../../utils/tests";
import { DeleteLabelClassModal } from "./delete-label-class-modal";
import {
  DELETE_LABEL_CLASS_SIMPLE_MOCK,
  GET_LABEL_CLASS_BY_ID_MOCK,
  getDeleteLabelClassMockResult,
  TestComponent,
} from "./delete-label-class-modal.fixtures";

const DELETE_LABEL_CLASS_MOCK_WITH_JEST = {
  ...DELETE_LABEL_CLASS_SIMPLE_MOCK,
  result: jest.fn(getDeleteLabelClassMockResult),
};

export const APOLLO_MOCKS: ApolloMockResponses = [
  GET_LABEL_CLASS_BY_ID_MOCK,
  DELETE_LABEL_CLASS_MOCK_WITH_JEST,
];

const setDeleteClassId = jest.fn();

const renderModal = (mockLink: WildcardMockLink) => {
  render(
    <TestComponent
      setDeleteClassId={setDeleteClassId}
      labelClassInfo={{
        id: BASIC_LABEL_CLASS_DATA.id,
        datasetId: BASIC_LABEL_CLASS_DATA.dataset.id,
      }}
    />,
    {
      wrapper: getApolloMockWrapper(mockLink),
    }
  );
};

describe(DeleteLabelClassModal, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deletes a class when confirm is clicked", async () => {
    const mockLink = getApolloMockLink(APOLLO_MOCKS);
    renderModal(mockLink);
    const confirmButton = screen.getByLabelText(/Confirm delete label class/);
    fireEvent.click(confirmButton);
    await act(() => mockLink.waitForAllResponses());
    expect(setDeleteClassId).toHaveBeenCalledWith(undefined);
    expect(DELETE_LABEL_CLASS_MOCK_WITH_JEST.result).toHaveBeenCalled();
  });

  it("does not delete a class when cancel is clicked", async () => {
    const mockLink = getApolloMockLink(APOLLO_MOCKS);
    renderModal(mockLink);
    const cancelButton = screen.getByLabelText(/Cancel delete label class/);
    fireEvent.click(cancelButton);
    await act(() => mockLink.waitForAllResponses());
    expect(setDeleteClassId).toHaveBeenCalledWith(undefined);
    expect(DELETE_LABEL_CLASS_MOCK_WITH_JEST.result).not.toHaveBeenCalled();
  });
});

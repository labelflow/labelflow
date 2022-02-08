import { act, fireEvent, render, screen } from "@testing-library/react";
import { WildcardMockLink } from "wildcard-mock-link";
import {
  getApolloMockLink,
  getApolloMockWrapper,
} from "../../utils/tests/apollo-mock";
import { BASIC_LABEL_CLASS_DATA } from "../../utils/tests/data.fixtures";
import { DeleteLabelClassModal } from "./delete-label-class-modal";
import {
  TestComponent,
  APOLLO_MOCKS,
  DELETE_LABEL_CLASS_SIMPLE_MOCK,
} from "./delete-label-class-modal.fixtures";

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
    expect(DELETE_LABEL_CLASS_SIMPLE_MOCK.result).toHaveBeenCalled();
  });

  it("does not delete a class when cancel is clicked", async () => {
    const mockLink = getApolloMockLink(APOLLO_MOCKS);
    renderModal(mockLink);
    const cancelButton = screen.getByLabelText(/Cancel delete label class/);
    fireEvent.click(cancelButton);
    await act(() => mockLink.waitForAllResponses());
    expect(setDeleteClassId).toHaveBeenCalledWith(undefined);
    expect(DELETE_LABEL_CLASS_SIMPLE_MOCK.result).not.toHaveBeenCalled();
  });
});

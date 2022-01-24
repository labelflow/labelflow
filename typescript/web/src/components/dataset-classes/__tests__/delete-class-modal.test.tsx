import { act, fireEvent, render, screen } from "@testing-library/react";
import { WildcardMockLink } from "wildcard-mock-link";
import {
  getMockApolloLink,
  getMockApolloWrapper,
} from "../../../utils/tests/mock-apollo";
import { MOCK_LABEL_CLASS_SIMPLE } from "../../../utils/tests/data.fixtures";
import {
  TestComponent,
  APOLLO_MOCKS,
} from "../delete-label-class-modal.fixtures";

const setDeleteClassId = jest.fn();

const renderModal = (mockLink: WildcardMockLink) => {
  render(
    <TestComponent
      setDeleteClassId={setDeleteClassId}
      labelClassInfo={{
        id: MOCK_LABEL_CLASS_SIMPLE.id,
        datasetId: MOCK_LABEL_CLASS_SIMPLE.dataset.id,
      }}
    />,
    {
      wrapper: getMockApolloWrapper(mockLink),
    }
  );
};

describe("Class delete modal tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should delete a class when confirm is clicked", async () => {
    const mockLink = getMockApolloLink(APOLLO_MOCKS);
    renderModal(mockLink);
    const confirmButton = screen.getByLabelText(/Confirm delete label class/);
    fireEvent.click(confirmButton);
    await act(() => mockLink.waitForAllResponses());
    expect(setDeleteClassId).toHaveBeenCalledWith(undefined);
    expect(APOLLO_MOCKS.deleteLabelClassSimple.result).toHaveBeenCalled();
  });

  test("shouldn't delete a class when cancel is clicked", async () => {
    const mockLink = getMockApolloLink(APOLLO_MOCKS);
    renderModal(mockLink);
    const cancelButton = screen.getByLabelText(/Cancel delete label class/);
    fireEvent.click(cancelButton);
    await act(() => mockLink.waitForAllResponses());
    expect(setDeleteClassId).toHaveBeenCalledWith(undefined);
    expect(APOLLO_MOCKS.deleteLabelClassSimple.result).not.toHaveBeenCalled();
  });
});

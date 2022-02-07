/* eslint-disable import/first */
import { act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  BASIC_LABEL_DATA,
  DEEP_DATASET_WITH_CLASSES_DATA,
} from "../../../../utils/tests/data.fixtures";

import { mockWorkspace } from "../../../../utils/tests/mock-workspace";

mockWorkspace({
  queryParams: {
    datasetSlug: BASIC_LABEL_DATA.labelClass.dataset.slug,
    imageId: BASIC_LABEL_DATA.imageId,
  },
});

import { useLabelingStore, Tools } from "../../../../connectors/labeling-state";
import { EditLabelClass } from "../edit-label-class";
import {
  APOLLO_MOCKS,
  createLabelClassActionMockResult,
  updateLabelClassActionMockResult,
  updateLabelClassOfLabelMockResult,
} from "../../edit-label-class.fixtures";
import { renderWithWrapper } from "../../../../utils/tests";

const onCloseEditLabelClass = jest.fn();

const renderEditLabelClass = () =>
  renderWithWrapper(<EditLabelClass isOpen onClose={onCloseEditLabelClass} />, {
    auth: { withWorkspaces: true },
    apollo: { extraMocks: APOLLO_MOCKS },
  });

describe("EditLabelClass", () => {
  beforeEach(async () => {
    act(() =>
      useLabelingStore.setState({
        selectedLabelId: BASIC_LABEL_DATA.id,
        selectedTool: Tools.SELECTION,
      })
    );
    jest.clearAllMocks();
  });

  it("should create a class", async () => {
    const { getByPlaceholderText, getByText } = await renderEditLabelClass();
    userEvent.type(getByPlaceholderText(/Search/), "new label class name");
    await waitFor(() => expect(getByText("Create class")).toBeDefined());
    userEvent.click(getByText("Create class"));
    await waitFor(() => {
      expect(createLabelClassActionMockResult).toHaveBeenCalled();
      expect(updateLabelClassActionMockResult).toHaveBeenCalled();
    });
  });

  it("should change a class", async () => {
    const { getByText } = await renderEditLabelClass();
    await waitFor(() =>
      expect(
        getByText(DEEP_DATASET_WITH_CLASSES_DATA.labelClasses[1].name)
      ).toBeDefined()
    );
    userEvent.click(
      getByText(DEEP_DATASET_WITH_CLASSES_DATA.labelClasses[1].name)
    );
    await waitFor(() =>
      expect(updateLabelClassOfLabelMockResult).toHaveBeenCalled()
    );
  });
});

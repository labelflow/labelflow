/* eslint-disable import/first */
import { act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockMatchMedia } from "../../../utils/mock-window";

mockMatchMedia(jest);

import {
  BASIC_LABEL_DATA,
  DEEP_DATASET_WITH_CLASSES_DATA,
} from "../../../utils/fixtures";
import { mockWorkspace } from "../../../utils/tests/mock-workspace";

mockWorkspace({
  queryParams: {
    datasetSlug: BASIC_LABEL_DATA.labelClass.dataset.slug,
    imageId: BASIC_LABEL_DATA.imageId,
  },
});

import { renderWithTestWrapper } from "../../../utils/tests";
import { Tools, useLabelingStore } from "../../../connectors/labeling-state";
import {
  APOLLO_MOCKS,
  CREATE_LABEL_CLASS_ACTION_MOCK,
  UPDATE_LABEL_CLASS_ACTION_MOCK,
  UPDATE_LABEL_CLASS_OF_LABEL_MOCK,
} from "../edit-label-class.fixtures";
import { EditLabelClassMenu } from "./edit-label-class-menu";

const renderEditLabelClassMenu = () => {
  return renderWithTestWrapper(<EditLabelClassMenu />, {
    auth: { withWorkspaces: true },
    apollo: { extraMocks: APOLLO_MOCKS },
  });
};

describe(EditLabelClassMenu, () => {
  beforeEach(() => {
    act(() =>
      useLabelingStore.setState({
        selectedLabelId: BASIC_LABEL_DATA.id,
        selectedTool: Tools.SELECTION,
      })
    );
    jest.clearAllMocks();
  });

  it("creates a class", async () => {
    const { getByPlaceholderText, getByText } =
      await renderEditLabelClassMenu();
    userEvent.type(getByPlaceholderText(/Search/), "newClassTest");
    await waitFor(() => expect(getByText("Create class")).toBeDefined());
    userEvent.click(getByText("Create class"));
    await waitFor(() => {
      // TODO The queries that are behind the name of those mocks have confusing names
      // We need to do a full check of the names of queries and function in the undo/redo store
      // - Create a label class
      expect(CREATE_LABEL_CLASS_ACTION_MOCK.result).toHaveBeenCalled();
      // - Update the class of a label
      expect(UPDATE_LABEL_CLASS_ACTION_MOCK.result).toHaveBeenCalled();
    });
  });

  it("changes a class", async () => {
    const { getByText } = await renderEditLabelClassMenu();
    await waitFor(() =>
      expect(
        getByText(DEEP_DATASET_WITH_CLASSES_DATA.labelClasses[1].name)
      ).toBeDefined()
    );
    userEvent.click(
      getByText(DEEP_DATASET_WITH_CLASSES_DATA.labelClasses[1].name)
    );
    await waitFor(() =>
      expect(UPDATE_LABEL_CLASS_OF_LABEL_MOCK.result).toHaveBeenCalled()
    );
  });
});

/* eslint-disable import/first */
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WildcardMockLink } from "wildcard-mock-link";
import {
  getApolloMockLink,
  getApolloMockWrapper,
} from "../../../../utils/tests/apollo-mock";
import {
  BASIC_LABEL_DATA,
  DEEP_DATASET_WITH_CLASSES_DATA,
} from "../../../../utils/tests/data.fixtures";
import {
  APOLLO_MOCKS,
  CREATE_LABEL_CLASS_ACTION_MOCK,
  UPDATE_LABEL_CLASS_ACTION_MOCK,
  UPDATE_LABEL_CLASS_OF_LABEL_MOCK,
} from "../../edit-label-class.fixtures";

import { mockMatchMedia } from "../../../../utils/mock-window";

mockMatchMedia(jest);

import { mockNextRouter } from "../../../../utils/router-mocks";

mockNextRouter({
  query: {
    imageId: BASIC_LABEL_DATA.imageId,
    datasetSlug: BASIC_LABEL_DATA.labelClass.dataset.slug,
    workspaceSlug: BASIC_LABEL_DATA.labelClass.dataset.workspace.slug,
  },
});

import { Tools, useLabelingStore } from "../../../../connectors/labeling-state";
import { EditLabelClassMenu } from "../edit-label-class-menu";

const renderEditLabelClassMenu = (mockLink: WildcardMockLink) => {
  return render(<EditLabelClassMenu />, {
    wrapper: getApolloMockWrapper(mockLink),
  });
};

beforeEach(() => {
  act(() =>
    useLabelingStore.setState({
      selectedLabelId: BASIC_LABEL_DATA.id,
      selectedTool: Tools.SELECTION,
    })
  );
  jest.clearAllMocks();
});

it("should create a class", async () => {
  const mockLink = getApolloMockLink(APOLLO_MOCKS);
  renderEditLabelClassMenu(mockLink);
  act(() =>
    userEvent.type(screen.getByPlaceholderText(/Search/), "newClassTest")
  );
  await waitFor(() => expect(screen.getByText("Create class")).toBeDefined());
  userEvent.click(screen.getByText("Create class"));
  await act(() => mockLink.waitForAllResponsesRecursively());
  // TODO The queries that are behind the name of those mocks have confusing names
  // We need to do a full check of the names of queries and function in the undo/redo store
  // - Create a label class
  expect(CREATE_LABEL_CLASS_ACTION_MOCK.result).toHaveBeenCalled();
  // - Update the class of a label
  expect(UPDATE_LABEL_CLASS_ACTION_MOCK.result).toHaveBeenCalled();
});

it("should change a class", async () => {
  const mockLink = getApolloMockLink(APOLLO_MOCKS);
  renderEditLabelClassMenu(mockLink);
  await waitFor(() =>
    expect(
      screen.getByText(DEEP_DATASET_WITH_CLASSES_DATA.labelClasses[1].name)
    ).toBeDefined()
  );
  userEvent.click(
    screen.getByText(DEEP_DATASET_WITH_CLASSES_DATA.labelClasses[1].name)
  );
  // Intentionally done twice
  await act(() => mockLink.waitForAllResponses());
  await act(() => mockLink.waitForAllResponses());
  expect(UPDATE_LABEL_CLASS_OF_LABEL_MOCK.result).toHaveBeenCalled();
});

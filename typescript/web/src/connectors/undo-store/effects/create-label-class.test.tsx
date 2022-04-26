import { useUndoStore } from "..";
import { DEEP_DATASET_WITH_CLASSES_DATA } from "../../../utils/fixtures";
import {
  ApolloClientWithMockLink,
  getApolloMockClient,
} from "../../../utils/tests/apollo-mock";
import { useLabelingStore } from "../../labeling-state";
import { createCreateLabelClassEffect } from "./create-label-class";
import {
  APOLLO_MOCKS,
  createLabelClassActionMockResult,
  CREATE_LABEL_CLASS_ACTION_MOCK,
  DELETE_LABEL_CLASS_ACTION_MOCK,
} from "./label-and-label-class.fixtures";

const [PREVIOUS_LABEL_CLASS_DATA, NEW_LABEL_CLASS_DATA] =
  DEEP_DATASET_WITH_CLASSES_DATA.labelClasses;

const { perform } = useUndoStore.getState();

describe("CreateLabelClassEffect", () => {
  let mockClient: ApolloClientWithMockLink;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockClient = getApolloMockClient(APOLLO_MOCKS);
    useLabelingStore.setState({
      selectedLabelClassId: PREVIOUS_LABEL_CLASS_DATA.id,
    });
    await perform(
      createCreateLabelClassEffect(
        {
          name: NEW_LABEL_CLASS_DATA.name,
          color: NEW_LABEL_CLASS_DATA.color,
          datasetId: DEEP_DATASET_WITH_CLASSES_DATA.id,
          selectedLabelClassIdPrevious: PREVIOUS_LABEL_CLASS_DATA.id,
        },
        { client: mockClient.client }
      )
    );
  });

  it("creates the label class and update the labeling store", async () => {
    expect(CREATE_LABEL_CLASS_ACTION_MOCK.result).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: NEW_LABEL_CLASS_DATA.name,
        color: NEW_LABEL_CLASS_DATA.color,
        datasetId: DEEP_DATASET_WITH_CLASSES_DATA.id,
      }),
    });
    const [
      {
        data: { id: newLabelClassId },
      },
    ] = createLabelClassActionMockResult.mock.calls[0];
    expect(useLabelingStore.getState()).toMatchObject({
      selectedLabelClassId: newLabelClassId,
    });
  });

  it("undo the label class creation the update of the labeling store", async () => {
    const [
      {
        data: { id: newLabelClassId },
      },
    ] = createLabelClassActionMockResult.mock.calls[0];
    await useUndoStore.getState().undo();
    expect(DELETE_LABEL_CLASS_ACTION_MOCK.result).toHaveBeenCalledWith({
      where: { id: newLabelClassId },
    });
    expect(useLabelingStore.getState()).toMatchObject({
      selectedLabelClassId: PREVIOUS_LABEL_CLASS_DATA.id,
    });
  });

  it("redo the update of the label class of a label and the update of the labeling store", async () => {
    const [
      {
        data: { id: newLabelClassId },
      },
    ] = createLabelClassActionMockResult.mock.calls[0];
    await useUndoStore.getState().undo();
    await useUndoStore.getState().redo();
    expect(CREATE_LABEL_CLASS_ACTION_MOCK.result).toHaveBeenCalledWith({
      data: {
        id: newLabelClassId,
        name: NEW_LABEL_CLASS_DATA.name,
        color: NEW_LABEL_CLASS_DATA.color,
        datasetId: DEEP_DATASET_WITH_CLASSES_DATA.id,
      },
    });
    expect(useLabelingStore.getState()).toMatchObject({
      selectedLabelClassId: newLabelClassId,
    });
  });
});

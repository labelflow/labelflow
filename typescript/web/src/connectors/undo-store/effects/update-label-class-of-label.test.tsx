import { useUndoStore } from "..";
import {
  BASIC_LABEL_DATA,
  DEEP_DATASET_WITH_CLASSES_DATA,
} from "../../../utils/fixtures";
import {
  ApolloClientWithMockLink,
  getApolloMockClient,
} from "../../../utils/tests/apollo-mock";
import {
  APOLLO_MOCKS,
  UPDATE_LABEL_CLASS_OF_LABEL_MOCK,
} from "./label-and-label-class.fixtures";
import { createUpdateLabelClassOfLabelEffect } from "./update-label-class-of-label";

const { perform } = useUndoStore.getState();
const [PREVIOUS_LABEL_CLASS_DATA, NEW_LABEL_CLASS_DATA] =
  DEEP_DATASET_WITH_CLASSES_DATA.labelClasses;

describe("UpdateLabelClassOfLabelEffect", () => {
  let mockClient: ApolloClientWithMockLink;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockClient = getApolloMockClient(APOLLO_MOCKS);
    await perform(
      createUpdateLabelClassOfLabelEffect(
        {
          selectedLabelId: BASIC_LABEL_DATA.id,
          selectedLabelClassId: NEW_LABEL_CLASS_DATA.id,
        },
        { client: mockClient.client }
      )
    );
  });

  it("updates the label class of a label", async () => {
    expect(UPDATE_LABEL_CLASS_OF_LABEL_MOCK.result).toHaveBeenCalledWith({
      where: { id: BASIC_LABEL_DATA.id },
      data: { labelClassId: NEW_LABEL_CLASS_DATA.id },
    });
  });

  it("undo the update of the label class of a label", async () => {
    await useUndoStore.getState().undo();
    expect(UPDATE_LABEL_CLASS_OF_LABEL_MOCK.result).toHaveBeenCalledWith({
      where: { id: BASIC_LABEL_DATA.id },
      data: { labelClassId: PREVIOUS_LABEL_CLASS_DATA.id },
    });
  });

  it("redo the update of the label class of a label", async () => {
    await useUndoStore.getState().undo();
    await useUndoStore.getState().redo();
    expect(UPDATE_LABEL_CLASS_OF_LABEL_MOCK.result).toHaveBeenNthCalledWith(5, {
      where: { id: BASIC_LABEL_DATA.id },
      data: { labelClassId: NEW_LABEL_CLASS_DATA.id },
    });
  });
});

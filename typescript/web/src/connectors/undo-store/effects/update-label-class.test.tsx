import { useLabelingStore } from "../../labeling-state";
import { useUndoStore } from "..";
import { createUpdateLabelClassEffect } from "./update-label-class";

const { perform } = useUndoStore.getState();

describe("UpdateLabelClassEffect", () => {
  beforeEach(() => {
    useLabelingStore.setState({
      selectedLabelClassId: "previous label class id",
    });
  });

  it("updates the selected label class", async () => {
    const { selectedLabelClassId: selectedLabelClassIdPrevious } =
      useLabelingStore.getState();
    const selectedLabelClassId = "new label class id";
    await perform(
      createUpdateLabelClassEffect({
        selectedLabelClassId,
        selectedLabelClassIdPrevious,
      })
    );
    expect(useLabelingStore.getState()).toMatchObject({
      selectedLabelClassId: "new label class id",
    });
  });

  it("undo the update of the selected label class", async () => {
    const { selectedLabelClassId: selectedLabelClassIdPrevious } =
      useLabelingStore.getState();
    const selectedLabelClassId = "new label class id";
    await perform(
      createUpdateLabelClassEffect({
        selectedLabelClassId,
        selectedLabelClassIdPrevious,
      })
    );
    await useUndoStore.getState().undo();
    expect(useLabelingStore.getState()).toMatchObject({
      selectedLabelClassId: "previous label class id",
    });
  });
});

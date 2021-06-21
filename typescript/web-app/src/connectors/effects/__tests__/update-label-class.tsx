import { useLabellingStore } from "../../labelling-state";
import { useUndoStore } from "../../undo-store";
import { createUpdateLabelClassEffect } from "../update-label-class";

const { perform } = useUndoStore.getState();

beforeEach(() => {
  //   useLabellingStore.destroy();
  useLabellingStore.setState({
    selectedLabelClassId: "previous label class id",
  });
});

it("should update the selected label class", async () => {
  const { selectedLabelClassId: selectedLabelClassIdPrevious } =
    useLabellingStore.getState();
  const selectedLabelClassId = "new label class id";
  await perform(
    createUpdateLabelClassEffect({
      selectedLabelClassId,
      selectedLabelClassIdPrevious,
    })
  );

  expect(useLabellingStore.getState()).toMatchObject({
    selectedLabelClassId: "new label class id",
  });
});

it("should undo the update of the selected label class", async () => {
  const { selectedLabelClassId: selectedLabelClassIdPrevious } =
    useLabellingStore.getState();
  const selectedLabelClassId = "new label class id";
  await perform(
    createUpdateLabelClassEffect({
      selectedLabelClassId,
      selectedLabelClassIdPrevious,
    })
  );

  await useUndoStore.getState().undo();

  expect(useLabellingStore.getState()).toMatchObject({
    selectedLabelClassId: "previous label class id",
  });
});

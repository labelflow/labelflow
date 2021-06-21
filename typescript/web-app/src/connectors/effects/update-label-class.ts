import { useLabellingStore } from "../labelling-state";
import { Effect } from "../undo-store";

export const createUpdateLabelClassEffect = ({
  selectedLabelClassId,
  selectedLabelClassIdPrevious,
}: {
  selectedLabelClassId: string | null;
  selectedLabelClassIdPrevious: string | null;
}): Effect => ({
  do: async () => {
    useLabellingStore.setState({ selectedLabelClassId });
  },
  undo: async () => {
    useLabellingStore.setState({ selectedLabelClassIdPrevious });
  },
});

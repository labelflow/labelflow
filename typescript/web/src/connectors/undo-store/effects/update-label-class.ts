import { useLabelingStore } from "../../labeling-state";
import { Effect } from "..";

export const createUpdateLabelClassEffect = ({
  selectedLabelClassId,
  selectedLabelClassIdPrevious,
}: {
  selectedLabelClassId: string | null;
  selectedLabelClassIdPrevious: string | null;
}): Effect => ({
  do: async () => {
    useLabelingStore.setState({ selectedLabelClassId });
  },
  undo: async () => {
    useLabelingStore.setState({
      selectedLabelClassId: selectedLabelClassIdPrevious,
    });
  },
});

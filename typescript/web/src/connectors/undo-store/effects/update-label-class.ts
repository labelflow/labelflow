import { useLabellingStore } from "../../labeling-state";
import { Effect } from "..";

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
    useLabellingStore.setState({
      selectedLabelClassId: selectedLabelClassIdPrevious,
    });
  },
});

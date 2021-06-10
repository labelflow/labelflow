import { click } from "ol/events/condition";
import { SelectEvent } from "ol/interaction/Select";
import { useLabellingStore, Tools } from "../../../connectors/labelling-state";

export const SelectInteraction = () => {
  const selectedTool = useLabellingStore((state) => state.selectedTool);
  const setSelectedLabelId = useLabellingStore(
    (state) => state.setSelectedLabelId
  );

  if (selectedTool !== Tools.SELECTION) {
    return null;
  }

  return (
    <olInteractionSelect
      onSelect={(e) => {
        const selectEvent = e as SelectEvent;
        if (selectEvent.selected.length > 0) {
          setSelectedLabelId(selectEvent.selected[0].getProperties().id);
        } else {
          setSelectedLabelId(null);
        }
        /* the onSelect handler should return a boolean.
         * It seems to be used for internal state purpose. Sometimes openlayers
         * takes over react lifecycle and change the selected label style.
         * Returning false prevent this side effect. */
        return false;
      }}
      condition={click}
    />
  );
};

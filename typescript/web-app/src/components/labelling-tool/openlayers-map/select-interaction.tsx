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
      /*
       * Prevent openlayers to apply its own style on the selected features. An
       * alternative could be to use the "features" property to switch
       * to a kind of controlled mode.
       *
       * Select interaction accept "null" for the style property.
       * See https://openlayers.org/en/latest/apidoc/module-ol_interaction_Select-Select.html
       */
      // @ts-ignore
      style={null}
      onSelect={(e) => {
        const selectEvent = e as SelectEvent;
        if (selectEvent.selected.length > 0) {
          setSelectedLabelId(selectEvent.selected[0].getProperties().id);
        } else {
          setSelectedLabelId(null);
        }

        // Typescript forces us to return a boolean
        return false;
      }}
      condition={click}
    />
  );
};

import { MutableRefObject, useState } from "react";
import { click } from "ol/events/condition";
import { SelectEvent } from "ol/interaction/Select";
import { Coordinate } from "ol/coordinate";
import { MapBrowserEvent } from "ol";
import { useLabellingStore, Tools } from "../../../connectors/labelling-state";

const isContextMenuEvent = (mapBrowserEvent: MapBrowserEvent) => {
  return mapBrowserEvent?.type === "contextmenu";
};

const shouldSelectFeature = (mapBrowserEvent: MapBrowserEvent) => {
  return click(mapBrowserEvent) || isContextMenuEvent(mapBrowserEvent);
};

export const SelectInteraction = ({
  setEditClass = () => {},
  editClassOverlayRef,
}: {
  setEditClass?: (editClass: boolean) => void;
  editClassOverlayRef?: MutableRefObject<HTMLDivElement | null>;
}) => {
  const [editMenuLocation, setEditMenuLocation] =
    useState<Coordinate | undefined>(undefined);
  const selectedTool = useLabellingStore((state) => state.selectedTool);
  const setSelectedLabelId = useLabellingStore(
    (state) => state.setSelectedLabelId
  );

  if (selectedTool !== Tools.SELECTION) {
    return null;
  }

  return (
    <>
      <olInteractionSelect
        onSelect={(e) => {
          const selectEvent = e as SelectEvent;
          console.log(selectEvent);
          if (selectEvent.selected.length > 0) {
            setSelectedLabelId(selectEvent.selected[0].getProperties().id);
            if (isContextMenuEvent(selectEvent?.mapBrowserEvent)) {
              setEditClass(true);
              setEditMenuLocation(e.mapBrowserEvent.coordinate);
            }
          } else {
            setSelectedLabelId(null);
          }
          /* the onSelect handler should return a boolean.
           * It seems to be used for internal state purpose. Sometimes openlayers
           * takes over react lifecycle and change the selected label style.
           * Returning false prevent this side effect. */
          return false;
        }}
        condition={shouldSelectFeature}
      />
      {editClassOverlayRef?.current ? (
        <olOverlay
          element={editClassOverlayRef.current}
          position={editMenuLocation}
        />
      ) : null}
    </>
  );
};

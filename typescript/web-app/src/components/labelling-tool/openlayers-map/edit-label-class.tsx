import React, { useState } from "react";
import { MapBrowserEvent, Overlay } from "ol";
import { SelectEvent } from "ol/interaction/Select";
import { Coordinate } from "ol/coordinate";
import { ClassSelectionPopover } from "../../class-selection-popover";
import { useLabellingStore } from "../../../connectors/labelling-state";

export const EditLabelClass = ({ editClassOverlayRef, isOpen, onClose }) => {
  return (
    <div ref={editClassOverlayRef}>
      {isOpen && (
        <ClassSelectionPopover isOpen onClose={onClose} labelClasses={[]} />
      )}
    </div>
  );
};

const isContextMenuEvent = (mapBrowserEvent: MapBrowserEvent) => {
  return mapBrowserEvent?.type === "contextmenu";
};

export const EditLabelClassInteraction = ({
  editClassOverlayRef,
  setEditClass,
}: {
  editClassOverlayRef: React.MutableRefObject<HTMLElement | undefined>;
}) => {
  const [editMenuLocation, setEditMenuLocation] =
    useState<Coordinate | undefined>(undefined);

  const setSelectedLabelId = useLabellingStore(
    (state) => state.setSelectedLabelId
  );
  return (
    <>
      <olInteractionSelect
        args={{ condition: isContextMenuEvent }}
        // TODO: figure out why typescript is drunk as the style property should be of type StyleLike|null
        style={null} // To prevent default styling of the selected feature in open layers
        onSelect={(e: SelectEvent) => {
          const selectedFeatures = e.target.getFeatures().getArray();
          if (selectedFeatures?.length > 0) {
            const selectedFeature = selectedFeatures[0];
            const { id } = selectedFeature.getProperties();
            setSelectedLabelId(id);
            setEditClass(true);
            setEditMenuLocation(e.mapBrowserEvent.coordinate);
          }
        }}
      />

      {editClassOverlayRef.current ? (
        <olOverlay
          element={editClassOverlayRef.current}
          position={editMenuLocation}
        />
      ) : null}
    </>
  );
};

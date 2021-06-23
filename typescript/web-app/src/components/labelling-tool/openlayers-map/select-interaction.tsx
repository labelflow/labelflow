import { MutableRefObject, useState } from "react";
import { Coordinate } from "ol/coordinate";
import { MapBrowserEvent } from "ol";
import OverlayPositioning from "ol/OverlayPositioning";
import { useLabellingStore, Tools } from "../../../connectors/labelling-state";

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

  const clickHandler = (e: MapBrowserEvent<UIEvent>) => {
    const { map } = e;
    const feature = map.forEachFeatureAtPixel(e.pixel, (f: any) => f);
    setSelectedLabelId(feature?.getProperties().id ?? null);
    return true;
  };

  const contextMenuHandler = (e: MapBrowserEvent<UIEvent>) => {
    const { map } = e;
    const feature = map.forEachFeatureAtPixel(e.pixel, (f: any) => f);
    const selectedLabelId = feature?.getProperties().id ?? null;
    setSelectedLabelId(selectedLabelId);
    if (selectedLabelId) {
      setEditClass(true);
      setEditMenuLocation(map.getCoordinateFromPixel(e.pixel));
    }
    return true;
  };

  return (
    <>
      <olInteractionPointer
        style={null}
        handleEvent={(e) => {
          const eventType = e?.type ?? null;
          switch (eventType) {
            case "click":
              return clickHandler(e);
            case "contextmenu":
              return contextMenuHandler(e);
            default:
              return true;
          }
        }}
      />
      {editClassOverlayRef?.current ? (
        <olOverlay
          element={editClassOverlayRef.current}
          position={editMenuLocation}
          positioning={OverlayPositioning.CENTER_CENTER}
        />
      ) : null}
    </>
  );
};

import { MutableRefObject, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Coordinate } from "ol/coordinate";
import VectorLayer from "ol/layer/Vector";
import { MapBrowserEvent } from "ol";
import { Vector as OlSourceVector } from "ol/source";
import { Geometry } from "ol/geom";
import { createEmpty, extend, getCenter } from "ol/extent";

import OverlayPositioning from "ol/OverlayPositioning";
import { useLabellingStore, Tools } from "../../../connectors/labelling-state";

import { keymap } from "../../../keymap";

export const SelectInteraction = ({
  setIsContextMenuOpen = () => {},
  editClassOverlayRef,
  sourceVectorLabelsRef,
}: {
  setIsContextMenuOpen?: (state: boolean) => void;
  editClassOverlayRef?: MutableRefObject<HTMLDivElement | null>;
  sourceVectorLabelsRef: MutableRefObject<OlSourceVector<Geometry> | null>;
}) => {
  const [editMenuLocation, setEditMenuLocation] =
    useState<Coordinate | undefined>(undefined);
  const selectedTool = useLabellingStore((state) => state.selectedTool);
  const setSelectedLabelId = useLabellingStore(
    (state) => state.setSelectedLabelId
  );

  useHotkeys(
    keymap.openLabelClassSelectionPopover.key,
    () => {
      if (sourceVectorLabelsRef.current == null) return;

      const selectedFeatures = sourceVectorLabelsRef.current
        .getFeatures()
        .filter((feature) => feature.getProperties().isSelected === true);

      if (selectedFeatures.length > 0) {
        const extent = createEmpty();
        selectedFeatures.forEach((feature) => {
          extend(extent, feature.getGeometry().getExtent());
        });

        const center = getCenter(extent);
        setIsContextMenuOpen(true);
        setEditMenuLocation(center);
      }
    },
    {},
    [sourceVectorLabelsRef, setIsContextMenuOpen, setEditMenuLocation]
  );

  const clickHandler = (e: MapBrowserEvent<UIEvent>) => {
    const { map } = e;
    const featuresAtPixel = map.getFeaturesAtPixel(e.pixel);
    const coordinate = map.getCoordinateFromPixel(e.pixel);
    // TODO: Find a more robust way to get the right layer
    const vectorLayer = map
      .getLayers()
      .getArray()
      .find((layer) => "getStyle" in layer) as VectorLayer;
    if (!vectorLayer) throw Error("Could not find vector layer");
    const source = vectorLayer.getSource();
    // @ts-ignore
    const feature = source.getClosestFeatureToCoordinate(coordinate, (f) =>
      featuresAtPixel.find((fAtPixel) => f === fAtPixel)
    );
    setSelectedLabelId(feature?.getProperties().id ?? null);
    return true;
  };

  const contextMenuHandler = (e: MapBrowserEvent<UIEvent>) => {
    const { map } = e;
    const feature = map.forEachFeatureAtPixel(e.pixel, (f: any) => f);
    const selectedLabelIdFromFeature = feature?.getProperties().id ?? null;
    setSelectedLabelId(selectedLabelIdFromFeature);
    if (selectedLabelIdFromFeature) {
      const center = map.getCoordinateFromPixel(e.pixel);

      setIsContextMenuOpen(true);
      setEditMenuLocation(center);
    }
    return true;
  };

  return (
    <>
      {selectedTool === Tools.SELECTION && (
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
      )}
      {editClassOverlayRef?.current && (
        <olOverlay
          element={editClassOverlayRef.current}
          position={editMenuLocation}
          positioning={OverlayPositioning.CENTER_CENTER}
        />
      )}
    </>
  );
};

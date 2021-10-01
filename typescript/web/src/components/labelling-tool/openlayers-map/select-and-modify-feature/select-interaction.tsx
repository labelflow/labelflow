import { MutableRefObject } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { MapBrowserEvent } from "ol";
import { Vector as OlSourceVector } from "ol/source";
import { Geometry } from "ol/geom";
import { createEmpty, extend, getCenter } from "ol/extent";

import OverlayPositioning from "ol/OverlayPositioning";
import {
  useLabellingStore,
  Tools,
} from "../../../../connectors/labelling-state";

import { keymap } from "../../../../keymap";

export const SelectInteraction = ({
  setIsContextMenuOpen = () => {},
  editClassOverlayRef,
  sourceVectorLabelsRef,
  image,
}: {
  image: { width?: number; height?: number };
  setIsContextMenuOpen?: (state: boolean) => void;
  editClassOverlayRef?: MutableRefObject<HTMLDivElement | null>;
  sourceVectorLabelsRef: MutableRefObject<OlSourceVector<Geometry> | null>;
}) => {
  const contextMenuLocation = useLabellingStore(
    (state) => state.contextMenuLocation
  );
  const setContextMenuLocation = useLabellingStore(
    (state) => state.setContextMenuLocation
  );

  const selectedTool = useLabellingStore((state) => state.selectedTool);
  const setSelectedLabelId = useLabellingStore(
    (state) => state.setSelectedLabelId
  );

  useHotkeys(
    keymap.openLabelClassSelectionPopover.key,
    () => {
      if (selectedTool === Tools.CLASSIFICATION) {
        setIsContextMenuOpen(true);
        setContextMenuLocation([
          (image?.width ?? 0) / 2,
          (image?.height ?? 0) / 2,
        ]);
        return;
      }

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
        setContextMenuLocation(center);
      }
    },
    {},
    [sourceVectorLabelsRef, setIsContextMenuOpen, setContextMenuLocation, image]
  useHotkeys(
    keymap.deselect.key,
    () => {
      useLabellingStore.getState().setIsContextMenuOpen(false);
      useLabellingStore.getState().setSelectedLabelId(null);
    },
    {},
    []
  );

  const getClosestFeature = (e: MapBrowserEvent<UIEvent>) => {
    const { map } = e;
    const featuresAtPixel = map.getFeaturesAtPixel(e.pixel);
    const coordinate = map.getCoordinateFromPixel(e.pixel);
    const source = sourceVectorLabelsRef.current;
    // @ts-ignore
    return source.getClosestFeatureToCoordinate(coordinate, (f) =>
      featuresAtPixel.find((fAtPixel) => f === fAtPixel)
    );
  };

  const clickHandler = (e: MapBrowserEvent<UIEvent>) => {
    const feature = getClosestFeature(e);
    setSelectedLabelId(feature?.getProperties().id ?? null);
    return true;
  };

  const contextMenuHandler = (e: MapBrowserEvent<UIEvent>) => {
    const { map } = e;
    const feature = getClosestFeature(e);
    const selectedLabelIdFromFeature = feature?.getProperties().id ?? null;
    setSelectedLabelId(selectedLabelIdFromFeature);

    if (selectedLabelIdFromFeature) {
      const center = map.getCoordinateFromPixel(e.pixel);
      setIsContextMenuOpen(true);
      setContextMenuLocation(center);
      return true;
    }

    if (selectedTool === Tools.CLASSIFICATION) {
      setIsContextMenuOpen(true);
      setContextMenuLocation([
        e.coordinate?.[0] ?? (image?.width ?? 0) / 2,
        e.coordinate?.[1] ?? (image?.height ?? 0) / 2,
      ]);
      return true;
    }

    return true;
  };

  return (
    <>
      {selectedTool === Tools.SELECTION && (
        <olInteractionPointer
          key={selectedTool}
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
      {selectedTool === Tools.CLASSIFICATION && (
        <olInteractionPointer
          key={selectedTool}
          style={null}
          handleEvent={(e) => {
            const eventType = e?.type ?? null;
            switch (eventType) {
              case "click": {
                setSelectedLabelId(null);
                return true;
              }
              case "contextmenu":
                return contextMenuHandler(e);
              default:
                return true;
            }
          }}
        />
      )}
      {(selectedTool === Tools.POLYGON || selectedTool === Tools.BOX) && (
        <olInteractionPointer
          key={selectedTool}
          style={null}
          handleEvent={(e) => {
            const eventType = e?.type ?? null;
            switch (eventType) {
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
          position={contextMenuLocation}
          positioning={OverlayPositioning.CENTER_CENTER}
        />
      )}
    </>
  );
};

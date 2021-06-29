import { MutableRefObject, useState, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Coordinate } from "ol/coordinate";
import { Collection, Feature, MapBrowserEvent } from "ol";
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
  setSelectedFeatures,
}: {
  setIsContextMenuOpen?: (state: boolean) => void;
  editClassOverlayRef?: MutableRefObject<HTMLDivElement | null>;
  sourceVectorLabelsRef: MutableRefObject<OlSourceVector<Geometry> | null>;
  setSelectedFeatures: (features: Collection<Feature<Geometry>>) => void;
}) => {
  const [editMenuLocation, setEditMenuLocation] =
    useState<Coordinate | undefined>(undefined);

  const selectedTool = useLabellingStore((state) => state.selectedTool);
  const setSelectedLabelId = useLabellingStore(
    (state) => state.setSelectedLabelId
  );
  const selectedLabelId = useLabellingStore((state) => state.selectedLabelId);

  useEffect(() => {
    const sleep = (time: number) =>
      new Promise((resolve) => setTimeout(resolve, time));
    const timeout = 1000; // ms
    const getSelectedLabelInOpenLayers = async () => {
      // Make sure we set the selected feature in state on the first render if there is already a selectedLabelId
      if (selectedLabelId != null && sourceVectorLabelsRef.current != null) {
        const startDate = Date.now();
        // We need this to wait for the labels to be added to open layers on the first render
        while (
          sourceVectorLabelsRef.current.getFeatures()?.length === 0 &&
          startDate - Date.now() < timeout
        ) {
          // eslint-disable-next-line no-await-in-loop
          await sleep(100);
        }
        if (sourceVectorLabelsRef.current.getFeatures()?.length > 0) {
          const selectedFeature = sourceVectorLabelsRef.current
            .getFeatures()
            .filter(
              (feature) => feature.getProperties().id === selectedLabelId
            )?.[0];
          setSelectedFeatures(new Collection([selectedFeature]));
        }
      }
    };
    getSelectedLabelInOpenLayers();
  }, [sourceVectorLabelsRef.current]);

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
    const source = sourceVectorLabelsRef.current;
    // @ts-ignore
    const feature = source.getClosestFeatureToCoordinate(coordinate, (f) =>
      featuresAtPixel.find((fAtPixel) => f === fAtPixel)
    );
    setSelectedLabelId(feature?.getProperties().id ?? null);
    setSelectedFeatures(new Collection([feature]));
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

import { MutableRefObject } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { MapBrowserEvent } from "ol";
import { Vector as OlSourceVector } from "ol/source";
import { Geometry } from "ol/geom";
import { createEmpty, extend, getCenter } from "ol/extent";

import OverlayPositioning from "ol/OverlayPositioning";
import {
  useLabelingStore,
  Tools,
  SelectionToolState,
} from "../../../../connectors/labeling-state";

import { keymap } from "../../../../keymap";

// FIXME DIRTY HACK here
//
// We need to save the image prop of SelectInteraction,
// because for some reason it gets transiently set to a random value
// every time the url (including url query params) changes.
// This seems to be caused by a weird interaction between nextjs router
// and react-openlayers-fiber
//
// Due to another weird interaction between react-openlayers-fiber and
// react-hotkeys-hook(I think), this transient wrong image value then becomes
// used in the callback of useHotkeys, resulting in bad placement of
// context menu in the case where it's opened with the "c" shortcut
// (No position from mouse event)
//
// So we need to save the image prop when it is valid, to use it in the
// useHotkeys callback. But there is a final bug! useRef seems to not work
// here, (maybe because of react-openlayers-fiber...), it's value gets
// reset on each render, making it impossible to save the value
//
// Thankfully this component is a singleton (for now), so we can use this
// DIRTY HACK that consists in saving the last valid image value in a global
// variable called imageRef, that we can mutate like a ref...
//
const imageRef = {
  current: null as null | {
    width?: number | undefined;
    height?: number | undefined;
  },
};

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
  const contextMenuLocation = useLabelingStore(
    (state) => state.contextMenuLocation
  );
  const setContextMenuLocation = useLabelingStore(
    (state) => state.setContextMenuLocation
  );

  if (image.height && image.width) {
    // When the image prop is valid, save it while it lasts!
    // See comment on top of this file...
    imageRef.current = image;
  }

  const selectedTool = useLabelingStore((state) => state.selectedTool);
  const selectionToolState = useLabelingStore(
    (state) => state.selectionToolState
  );
  const setSelectedLabelId = useLabelingStore(
    (state) => state.setSelectedLabelId
  );
  const selectedLabelId = useLabelingStore((state) => state.selectedLabelId);

  useHotkeys(
    keymap.openLabelClassSelectionPopover.key,
    () => {
      // To open the context menu when pressing "c" when no label is selected
      // in classification mode
      const { selectedLabelId: selectedLabelIdHotKey } =
        useLabelingStore.getState();

      if (
        selectedTool === Tools.CLASSIFICATION &&
        selectedLabelIdHotKey == null
      ) {
        setIsContextMenuOpen(true);
        setContextMenuLocation([
          (imageRef.current?.width ?? 0) / 2,
          (imageRef.current?.height ?? 0) / 2,
        ]);
        return;
      }

      if (sourceVectorLabelsRef.current == null) return;

      // To open the context menu when pressing "c" when a label is selected
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
    [
      sourceVectorLabelsRef,
      setIsContextMenuOpen,
      setContextMenuLocation,
      imageRef,
      selectedTool,
    ]
  );

  useHotkeys(
    keymap.deselect.key,
    () => {
      useLabelingStore.getState().setIsContextMenuOpen(false);
      useLabelingStore.getState().setSelectedLabelId(null);
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
    if (
      (selectedTool === Tools.SELECTION ||
        selectedTool === Tools.AI_ASSISTANT) &&
      selectionToolState === SelectionToolState.IOG &&
      selectedLabelId != null
    ) {
      return true;
    }
    const feature = getClosestFeature(e);
    setSelectedLabelId(feature?.getProperties().id ?? null);
    return true;
  };

  const contextMenuHandler = (e: MapBrowserEvent<UIEvent>) => {
    const { map } = e;
    const feature = getClosestFeature(e);
    const selectedLabelIdFromFeature = feature?.getProperties().id ?? null;
    setSelectedLabelId(selectedLabelIdFromFeature);

    // To open the context menu when clicking on labels on the image
    if (selectedLabelIdFromFeature) {
      const center = map.getCoordinateFromPixel(e.pixel);
      setIsContextMenuOpen(true);
      setContextMenuLocation(center);
      return true;
    }

    // To allow opening the context menu when right clicking on
    // an empty part of the image when in classification mode
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
      {(selectedTool === Tools.SELECTION ||
        selectedTool === Tools.AI_ASSISTANT) && (
        <olInteractionPointer
          // Key is a trick to force react open layers to take into account the change in image
          key={`${selectedTool}-${image.height}-${image.width}`}
          style={null}
          args={{
            handleEvent: (e) => {
              const eventType = e?.type ?? null;
              switch (eventType) {
                case "click":
                  return clickHandler(e);
                case "contextmenu":
                  return contextMenuHandler(e);
                default:
                  return true;
              }
            },
          }}
        />
      )}
      {selectedTool === Tools.CLASSIFICATION && (
        <olInteractionPointer
          // Key is a trick to force react open layers to take into account the change in image
          key={`${selectedTool}-${image.height}-${image.width}`}
          style={null}
          args={{
            handleEvent: (e) => {
              const eventType = e?.type ?? null;
              switch (eventType) {
                case "click": {
                  setSelectedLabelId(null);
                  return false;
                }
                case "contextmenu":
                  return contextMenuHandler(e);
                default:
                  return true;
              }
            },
          }}
        />
      )}
      {(selectedTool === Tools.POLYGON ||
        selectedTool === Tools.BOX ||
        selectedTool === Tools.IOG ||
        selectedTool === Tools.FREEHAND) && (
        <olInteractionPointer
          // Key is a trick to force react open layers to take into account the change in image
          key={`${selectedTool}-${image.height}-${image.width}`}
          style={null}
          args={{
            handleEvent: (e) => {
              const eventType = e?.type ?? null;
              switch (eventType) {
                case "contextmenu":
                  return contextMenuHandler(e);
                default:
                  return true;
              }
            },
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

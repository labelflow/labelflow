import { useToast } from "@chakra-ui/react";
import { useCallback, useEffect } from "react";
import { MapBrowserEvent } from "ol";
import { useApolloClient, useQuery } from "@apollo/client";
import { useMap } from "@labelflow/react-openlayers-fiber";
import { Coordinate } from "ol/coordinate";

import {
  useLabelingStore,
  DrawingToolState,
} from "../../../../connectors/labeling-state";
import { createUpdateIogLabelEffect } from "../../../../connectors/undo-store/effects/update-iog-label";
import { useUndoStore } from "../../../../connectors/undo-store";
import { getIogMaskIdFromLabelId } from "../../../../connectors/iog";

import { LABEL_QUERY } from "./queries";

export const HandleIogClick = () => {
  const map = useMap();
  const registerIogJob = useLabelingStore((state) => state.registerIogJob);
  const unregisterIogJob = useLabelingStore((state) => state.unregisterIogJob);
  const client = useApolloClient();

  const setDrawingToolState = useLabelingStore(
    (state) => state.setDrawingToolState
  );
  const selectedLabelId = useLabelingStore((state) => state.selectedLabelId);
  const setSelectedLabelId = useLabelingStore(
    useCallback((state) => state.setSelectedLabelId, [])
  );

  const { data: dataLabelQuery } = useQuery(LABEL_QUERY, {
    variables: { id: selectedLabelId },
    skip: selectedLabelId == null,
  });
  const pointsInside: Coordinate[] =
    dataLabelQuery?.label?.smartToolInput?.pointsInside ?? [];
  const pointsOutside: Coordinate[] =
    dataLabelQuery?.label?.smartToolInput?.pointsOutside ?? [];
  const centerPoint: null | Coordinate =
    dataLabelQuery?.label?.smartToolInput?.centerPoint;

  const { perform } = useUndoStore();
  const toast = useToast();

  const handleClick = useCallback(
    async (event: MapBrowserEvent<UIEvent>) => {
      const timestamp = new Date().getTime();
      const { map: mapEvent } = event;

      const idOfClickedFeature = mapEvent.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature.getProperties().id
      );
      if (idOfClickedFeature?.includes("point-center")) {
        return false;
      }

      try {
        registerIogJob(timestamp, selectedLabelId, centerPoint);
        if (
          idOfClickedFeature === getIogMaskIdFromLabelId(selectedLabelId ?? "")
        ) {
          // Deselect feature
          setSelectedLabelId(null);
          setDrawingToolState(DrawingToolState.IDLE);
        } else if (idOfClickedFeature === selectedLabelId) {
          // Add point outside
          await perform(
            createUpdateIogLabelEffect(
              {
                labelId: dataLabelQuery?.label?.id,
                pointsInside,
                pointsOutside: [
                  ...pointsOutside,
                  event.coordinate as Coordinate,
                ],
              },
              { client }
            )
          );
        } else if (idOfClickedFeature?.includes("point-inside-")) {
          // Remove point inside
          const indexPointToRemove = parseInt(
            idOfClickedFeature.split("point-inside-")[1],
            10
          );
          await perform(
            createUpdateIogLabelEffect(
              {
                labelId: dataLabelQuery?.label?.id,
                pointsInside: [
                  ...pointsInside.slice(0, indexPointToRemove),
                  ...pointsInside.slice(
                    indexPointToRemove + 1,
                    pointsInside.length
                  ),
                ],
                pointsOutside,
              },
              { client }
            )
          );
        } else if (idOfClickedFeature?.includes("point-outside-")) {
          // Remove point outside
          const indexPointToRemove = parseInt(
            idOfClickedFeature.split("point-outside-")[1],
            10
          );
          await perform(
            createUpdateIogLabelEffect(
              {
                labelId: dataLabelQuery?.label?.id,
                pointsInside,
                pointsOutside: [
                  ...pointsOutside.slice(0, indexPointToRemove),
                  ...pointsOutside.slice(
                    indexPointToRemove + 1,
                    pointsOutside.length
                  ),
                ],
              },
              { client }
            )
          );
        } else {
          // Add point inside
          await perform(
            createUpdateIogLabelEffect(
              {
                labelId: dataLabelQuery?.label?.id,
                pointsInside: [...pointsInside, event.coordinate as Coordinate],
                pointsOutside,
              },
              { client }
            )
          );
        }

        return false;
      } catch (error) {
        toast({
          title: "Error running IOG",
          // @ts-ignore
          description: error?.message,
          isClosable: true,
          status: "error",
          position: "bottom-right",
          duration: 10000,
        });
        throw error;
      } finally {
        unregisterIogJob(timestamp, selectedLabelId);
      }
    },
    [
      selectedLabelId,
      dataLabelQuery,
      setSelectedLabelId,
      setDrawingToolState,
      perform,
      toast,
      registerIogJob,
      unregisterIogJob,
      client,
      pointsInside,
      pointsOutside,
      centerPoint,
    ]
  );

  useEffect(() => {
    if (selectedLabelId != null) {
      map?.on("click", handleClick);
      return () => map?.un("click", handleClick);
    }
    return () => {};
  }, [map, selectedLabelId, handleClick]);
  return null;
};

export const HandleIogHover = () => {
  const map = useMap();
  const selectedLabelId = useLabelingStore((state) => state.selectedLabelId);
  const handler = useCallback(
    (event: MapBrowserEvent<UIEvent>) => {
      const { map: mapEvent } = event;
      if (!map) return;
      const idOfHoveredFeature = mapEvent.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature.getProperties().id
      );
      if (idOfHoveredFeature === selectedLabelId) {
        map.getViewport().style.cursor = `url("/static/graphics/iog-remove.svg") 6 7, auto`;
      } else if (
        idOfHoveredFeature?.includes("point-inside-") ||
        idOfHoveredFeature?.includes("point-outside-")
      ) {
        map.getViewport().style.cursor = `url("/static/graphics/iog-delete.svg") 8 8, auto`;
      } else if (
        idOfHoveredFeature !== getIogMaskIdFromLabelId(selectedLabelId ?? "") &&
        !idOfHoveredFeature?.includes("point-center") &&
        selectedLabelId != null
      ) {
        map.getViewport().style.cursor = `url("/static/graphics/iog-add.svg") 6 6, auto`;
      }
    },
    [map, selectedLabelId]
  );
  useEffect(() => {
    map?.on("pointermove", handler);
    return () => {
      if (!map) return;
      map.un("pointermove", handler);
      map.getViewport().style.cursor = "auto";
    };
  }, [handler, map, selectedLabelId]);
  return null;
};

import { useToast } from "@chakra-ui/react";
import { useState, useEffect, RefObject, useCallback } from "react";
import { Vector as OlSourceVector } from "ol/source";
import Collection from "ol/Collection";
import { Feature } from "ol";
import { Geometry, Polygon } from "ol/geom";
import { useApolloClient, useQuery } from "@apollo/client";
import { ModifyEvent } from "ol/interaction/Modify";
import BaseEvent from "ol/events/Event";
import { Coordinate } from "ol/coordinate";

import { useLabelingStore } from "../../../../connectors/labeling-state";
import { createUpdateIogLabelEffect } from "../../../../connectors/undo-store/effects/update-iog-label";
import { useUndoStore } from "../../../../connectors/undo-store";

import { LABEL_QUERY } from "./queries";

export const ModifyIogCenterPoint = ({
  vectorSourceRef,
}: {
  vectorSourceRef: RefObject<OlSourceVector<Geometry>>;
}) => {
  const selectedLabelId = useLabelingStore((state) => state.selectedLabelId);
  const registerIogJob = useLabelingStore((state) => state.registerIogJob);
  const unregisterIogJob = useLabelingStore((state) => state.unregisterIogJob);
  const { perform } = useUndoStore();
  const client = useApolloClient();
  const { data: dataLabelQuery } = useQuery(LABEL_QUERY, {
    variables: { id: selectedLabelId },
    skip: selectedLabelId == null,
  });
  const pointsInside: Coordinate[] =
    dataLabelQuery?.label?.smartToolInput?.pointsInside ?? [];
  const pointsOutside: Coordinate[] =
    dataLabelQuery?.label?.smartToolInput?.pointsOutside ?? [];
  const toast = useToast();
  const performIogFromModifyEvent = useCallback(
    async (modifyEvent: ModifyEvent): Promise<boolean> => {
      const timestamp = new Date().getTime();
      const newCoordinates = modifyEvent.mapBrowserEvent.coordinate;
      registerIogJob(timestamp, selectedLabelId, newCoordinates);
      try {
        await perform(
          createUpdateIogLabelEffect(
            {
              labelId: selectedLabelId ?? "",
              centerPoint: newCoordinates,
              pointsInside: pointsInside ?? undefined,
              pointsOutside: pointsOutside ?? undefined,
            },
            { client }
          )
        );
        return true;
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
      registerIogJob,
      selectedLabelId,
      perform,
      pointsInside,
      pointsOutside,
      client,
      unregisterIogJob,
    ]
  );
  const [centerPointFeature, setCenterPointFeature] =
    useState<Feature<Polygon> | null>(null);
  useEffect(() => {
    if (vectorSourceRef.current != null) {
      const centerPointFeatureFromSource =
        vectorSourceRef.current.getFeatureById("point-center");
      setCenterPointFeature(centerPointFeatureFromSource as Feature<Polygon>);

      const listener = (event: BaseEvent) => {
        const { feature } = event as unknown as { feature: Feature<Geometry> };
        if (feature.getProperties().id === "point-center") {
          setCenterPointFeature(feature as Feature<Polygon>);
        }
      };
      vectorSourceRef.current?.on(["addfeature"], listener);
      return () => vectorSourceRef.current?.un("addfeature", listener);
    }
    return () => {};
  }, [vectorSourceRef.current]);
  return centerPointFeature != null ? (
    <olInteractionModify
      args={{ features: new Collection([centerPointFeature]) }}
      onModifyend={performIogFromModifyEvent}
    />
  ) : null;
};

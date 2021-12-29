import { MutableRefObject, useEffect, useState, useCallback } from "react";
import { Feature } from "ol";
import { Geometry, Polygon } from "ol/geom";
import { Vector as OlSourceVector } from "ol/source";
import { extend } from "@labelflow/react-openlayers-fiber";
import { useApolloClient } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import { useLabelingStore } from "../../../../connectors/labeling-state";
import {
  ResizeIogCanvasInteraction,
  ResizeIogEvent,
} from "./resize-canvas-interaction";
import { useUndoStore } from "../../../../connectors/undo-store";
import { createUpdateIogLabelEffect } from "../../../../connectors/undo-store/effects/update-iog-label";
import {
  extractSmartToolInputInputFromIogMask,
  getIogMaskIdFromLabelId,
  getLabelIdFromIogMaskId,
} from "../../../../connectors/iog";

// Extend react-openlayers-catalogue to include resize and translate interaction
extend({
  ResizeIogCanvasInteraction: {
    object: ResizeIogCanvasInteraction,
    kind: "Interaction",
  },
});

export const ResizeIogCanvas = (props: {
  sourceVectorLabelsRef: MutableRefObject<OlSourceVector<Geometry> | null>;
}) => {
  const { sourceVectorLabelsRef } = props;

  // We need to have this state in order to store the selected feature in the addfeature listener below
  const [selectedFeature, setSelectedFeature] =
    useState<Feature<Polygon> | null>(null);
  const [selectedFeatureIog, setSelectedFeatureIog] =
    useState<Feature<Polygon> | null>(null);
  const selectedLabelId = useLabelingStore((state) => state.selectedLabelId);
  const registerIogJob = useLabelingStore((state) => state.registerIogJob);
  const unregisterIogJob = useLabelingStore((state) => state.unregisterIogJob);

  const getSelectedFeature = useCallback(() => {
    if (selectedFeature?.getProperties()?.id !== selectedLabelId) {
      if (selectedLabelId == null) {
        setSelectedFeature(null);
      } else {
        const featureFromSource = sourceVectorLabelsRef.current
          ?.getFeatures()
          ?.filter(
            (feature) => feature.getProperties().id === selectedLabelId
          )?.[0];
        if (featureFromSource != null) {
          setSelectedFeature(featureFromSource as Feature<Polygon>);
        }
        const featureFromSourceIog = sourceVectorLabelsRef.current
          ?.getFeatures()
          ?.filter(
            (feature) =>
              feature.getProperties().id ===
              getIogMaskIdFromLabelId(selectedLabelId)
          )?.[0];
        if (featureFromSourceIog != null) {
          setSelectedFeatureIog(featureFromSourceIog as Feature<Polygon>);
        }
      }
    }
  }, [selectedLabelId, sourceVectorLabelsRef.current]);

  // This is needed to make sure that each time a new feature is added to OL we check if it's the selected feature (for instance when we reload the page and we have a selected label but labels haven't been added to OL yet)
  useEffect(() => {
    sourceVectorLabelsRef.current?.on("addfeature", getSelectedFeature);
    return () =>
      sourceVectorLabelsRef.current?.un("addfeature", getSelectedFeature);
  }, [sourceVectorLabelsRef.current, selectedLabelId]);

  useEffect(() => {
    getSelectedFeature();
  }, [selectedLabelId]);
  const client = useApolloClient();
  const { perform } = useUndoStore();
  const toast = useToast();

  const interactionEndIog = useCallback(
    async (e: ResizeIogEvent | null) => {
      const feature = e?.features?.item(0) as Feature<Polygon>;
      const coordinates = feature.getGeometry().getCoordinates();
      const positionSpinner =
        extractSmartToolInputInputFromIogMask(coordinates).centerPoint;
      const timestamp = new Date().getTime();
      // await interactionEndIog(e, perform, client, toast);
      if (feature != null) {
        const { id: labelIdIog } = feature.getProperties();
        try {
          registerIogJob(timestamp, selectedLabelId, positionSpinner);
          await perform(
            createUpdateIogLabelEffect(
              {
                labelId: getLabelIdFromIogMaskId(labelIdIog),
                ...extractSmartToolInputInputFromIogMask(coordinates),
                pointsInside: [],
                pointsOutside: [],
              },
              { client }
            )
          );
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
      }
      return true;
    },
    [toast, perform, client, registerIogJob, unregisterIogJob]
  );

  return (
    // @ts-ignore - We need to add this because resizeAndTranslateBox is not included in the react-openalyers-fiber original catalogue
    <resizeIogCanvasInteraction
      args={{ selectedFeature: selectedFeatureIog, pixelTolerance: 20 }}
      onInteractionEnd={interactionEndIog}
    />
  );
};

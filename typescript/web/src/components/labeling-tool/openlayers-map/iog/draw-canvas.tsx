import { useMemo, useRef, useCallback } from "react";
import { Draw as OlDraw } from "ol/interaction";
import { createBox, DrawEvent } from "ol/interaction/Draw";
import GeoJSON, { GeoJSONPolygon } from "ol/format/GeoJSON";
import { Fill, Stroke, Style } from "ol/style";
import GeometryType from "ol/geom/GeometryType";
import { useApolloClient, useQuery } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import { useHotkeys } from "react-hotkeys-hook";
import { getBoundedGeometryFromImage } from "@labelflow/common-resolvers";
import { LabelType } from "@labelflow/graphql-types";

import {
  useLabelingStore,
  DrawingToolState,
} from "../../../../connectors/labeling-state";
import { keymap } from "../../../../keymap";
import { noneClassColor } from "../../../../utils/class-color-generator";
import { createCreateLabelEffect } from "../../../../connectors/undo-store/effects/create-label";
import { createRunIogEffect } from "../../../../connectors/undo-store/effects/run-iog";
import { useUndoStore } from "../../../../connectors/undo-store";

import { labelClassQuery, imageQuery } from "./queries";
import { extractSmartToolInputInputFromIogMask } from "../../../../connectors/iog";

const geometryFunction = createBox();

export const DrawIogCanvas = ({ imageId }: { imageId: string }) => {
  const drawRef = useRef<OlDraw>(null);
  const setSelectedLabelId = useLabelingStore(
    useCallback((state) => state.setSelectedLabelId, [])
  );
  const selectedLabelClassId = useLabelingStore(
    (state) => state.selectedLabelClassId
  );
  const setDrawingToolState = useLabelingStore(
    (state) => state.setDrawingToolState
  );
  const registerIogJob = useLabelingStore((state) => state.registerIogJob);
  const unregisterIogJob = useLabelingStore((state) => state.unregisterIogJob);
  const { perform } = useUndoStore();
  const client = useApolloClient();
  const { data: dataImage } = useQuery(imageQuery, {
    variables: { id: imageId },
    skip: imageId == null,
  });
  const { data: dataLabelClass } = useQuery(labelClassQuery, {
    variables: { id: selectedLabelClassId },
    skip: selectedLabelClassId == null,
  });
  useHotkeys(
    keymap.cancelAction.key,
    () => drawRef.current?.abortDrawing(),
    {},
    [drawRef]
  );
  const toast = useToast();
  const performIOGFromDrawEvent = useCallback(
    async (drawEvent: DrawEvent) => {
      const timestamp = new Date().getTime();
      const openLayersGeometry = drawEvent.feature.getGeometry();
      const geometry = new GeoJSON().writeGeometryObject(
        openLayersGeometry
      ) as GeoJSONPolygon;
      const boundedGeometry = getBoundedGeometryFromImage(
        { width: dataImage?.image?.width, height: dataImage?.image?.height },
        geometry
      ).geometry;
      const labelId = await createCreateLabelEffect(
        {
          imageId,
          selectedLabelClassId,
          geometry: boundedGeometry,
          labelType: LabelType.Polygon,
        },
        {
          setSelectedLabelId,
          client,
        }
      ).do();
      const inferencePromise = (async () => {
        const dataUrl = await (async function () {
          const blob = await fetch(dataImage?.image?.url).then((r) => r.blob());
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        })();
        const smartToolInput = extractSmartToolInputInputFromIogMask(
          boundedGeometry.coordinates as number[][][]
        );
        registerIogJob(timestamp, labelId, smartToolInput.centerPoint);

        return perform(
          createRunIogEffect(
            {
              labelId,
              imageUrl: dataUrl,
              ...smartToolInput,
            },
            { client }
          )
        );
      })();

      try {
        await inferencePromise;
      } catch (error) {
        setSelectedLabelId(null);
        toast({
          title: "Error executing IOG",
          description: error?.message,
          isClosable: true,
          status: "error",
          position: "bottom-right",
          duration: 10000,
        });
        throw error;
      } finally {
        unregisterIogJob(timestamp, labelId);
      }
    },
    [
      dataImage,
      imageId,
      selectedLabelClassId,
      setSelectedLabelId,
      client,
      registerIogJob,
      unregisterIogJob,
      setSelectedLabelId,
      toast,
      perform,
    ]
  );
  const selectedLabelClass = dataLabelClass?.labelClass;
  const style = useMemo(() => {
    const color = selectedLabelClass?.color ?? noneClassColor;

    return new Style({
      fill: new Fill({
        color: `${color}10`,
      }),
      stroke: new Stroke({
        color,
        width: 2,
      }),
    });
  }, [selectedLabelClass?.color]);
  return (
    <olInteractionDraw
      ref={drawRef}
      args={{
        type: GeometryType.CIRCLE,
        geometryFunction,
        style, // Needed here to trigger the rerender of the component when the selected class changes
      }}
      condition={(e) => {
        // 0 is the main mouse button. See: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
        // @ts-ignore
        return e.originalEvent.button === 0;
      }}
      onDrawabort={() => {
        setDrawingToolState(DrawingToolState.IDLE);
        return true;
      }}
      onDrawstart={() => {
        setDrawingToolState(DrawingToolState.DRAWING);
        return true;
      }}
      onDrawend={performIOGFromDrawEvent}
    />
  );
};

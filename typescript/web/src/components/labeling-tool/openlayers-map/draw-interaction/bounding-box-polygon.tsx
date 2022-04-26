import { useApolloClient, useQuery } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import GeoJSON, { GeoJSONPolygon } from "ol/format/GeoJSON";
import GeometryType from "ol/geom/GeometryType";
import { Draw as OlDraw } from "ol/interaction";
import { createBox, DrawEvent } from "ol/interaction/Draw";
import { Fill, Stroke, Style } from "ol/style";
import { useMemo, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
  DrawingToolState,
  Tools,
  useLabelingStore,
} from "../../../../connectors/labeling-state";
import { useUndoStore } from "../../../../connectors/undo-store";
import { createCreateLabelEffect } from "../../../../connectors/undo-store/effects/create-label";
import { noneClassColor } from "../../../../theme";
import { keymap } from "../../../../keymap";
import { labelClassQuery } from "../queries";
import { LabelType } from "../../../../graphql-types/globalTypes";

const geometryFunction = createBox();

export const DrawBoundingBoxAndPolygonInteraction = ({
  imageId,
}: {
  imageId: string;
}) => {
  const drawRef = useRef<OlDraw>(null);
  const client = useApolloClient();

  const selectedTool = useLabelingStore((state) => state.selectedTool);

  const setDrawingToolState = useLabelingStore(
    (state) => state.setDrawingToolState
  );
  const setSelectedLabelId = useLabelingStore(
    (state) => state.setSelectedLabelId
  );
  const selectedLabelClassId = useLabelingStore(
    (state) => state.selectedLabelClassId
  );
  const { data: dataLabelClass } = useQuery(labelClassQuery, {
    variables: { id: selectedLabelClassId },
    skip: selectedLabelClassId == null,
  });
  const { perform } = useUndoStore();

  const selectedLabelClass = dataLabelClass?.labelClass;

  useHotkeys(
    keymap.cancelAction.key,
    () => drawRef.current?.abortDrawing(),
    {},
    [drawRef]
  );

  const toast = useToast();

  const errorMessage =
    selectedTool === Tools.POLYGON
      ? "Error creating polygon"
      : "Error creating bounding box";

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

  const interactionDrawArguments =
    selectedTool === Tools.POLYGON || selectedTool === Tools.FREEHAND
      ? {
          type: GeometryType.MULTI_POLYGON,
          style, // Needed here to trigger the rerender of the component when the selected class changes
        }
      : {
          type: GeometryType.CIRCLE,
          geometryFunction,
          style, // Needed here to trigger the rerender of the component when the selected class changes
        };

  const createLabelFromDrawEvent = async (drawEvent: DrawEvent) => {
    const geometry = new GeoJSON().writeGeometryObject(
      drawEvent.feature.getGeometry()
    ) as GeoJSONPolygon;
    const createLabelPromise = perform(
      createCreateLabelEffect(
        {
          imageId,
          selectedLabelClassId,
          geometry,
          labelType:
            selectedTool === Tools.POLYGON || selectedTool === Tools.FREEHAND
              ? LabelType.Polygon
              : LabelType.Box,
        },
        {
          setSelectedLabelId,
          client,
        }
      )
    );
    setDrawingToolState(DrawingToolState.IDLE);
    try {
      await createLabelPromise;
    } catch (error) {
      toast({
        title: errorMessage,
        description: error?.message,
        isClosable: true,
        status: "error",
        position: "bottom-right",
        duration: 10000,
      });
    }
  };

  return (
    <olInteractionDraw
      ref={drawRef}
      args={interactionDrawArguments}
      freehand={selectedTool === Tools.FREEHAND}
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
      onDrawend={createLabelFromDrawEvent}
    />
  );
};

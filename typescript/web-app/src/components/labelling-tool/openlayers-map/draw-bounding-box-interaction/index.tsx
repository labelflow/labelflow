import { useMemo, useRef } from "react";
import { useRouter } from "next/router";
import { Draw as OlDraw } from "ol/interaction";
import { createBox, DrawEvent } from "ol/interaction/Draw";
import GeoJSON from "ol/format/GeoJSON";
import { Fill, Stroke, Style } from "ol/style";
import GeometryType from "ol/geom/GeometryType";
import { useApolloClient, useQuery, gql } from "@apollo/client";

import { useToast } from "@chakra-ui/react";

import { useHotkeys } from "react-hotkeys-hook";
import {
  useLabellingStore,
  Tools,
  BoxDrawingToolState,
} from "../../../../connectors/labelling-state";
import { keymap } from "../../../../keymap";
import { useUndoStore } from "../../../../connectors/undo-store";
import { noneClassColor } from "../../../../utils/class-color-generator";
import { createLabelEffect } from "./create-label-effect";

const labelClassQuery = gql`
  query getLabelClass($id: ID!) {
    labelClass(where: { id: $id }) {
      id
      name
      color
    }
  }
`;

const geometryFunction = createBox();

export const DrawBoundingBoxInteraction = () => {
  const drawRef = useRef<OlDraw>(null);
  const client = useApolloClient();
  const { imageId } = useRouter().query;

  const selectedTool = useLabellingStore((state) => state.selectedTool);

  const setBoxDrawingToolState = useLabellingStore(
    (state) => state.setBoxDrawingToolState
  );
  const setSelectedLabelId = useLabellingStore(
    (state) => state.setSelectedLabelId
  );
  const selectedLabelClassId = useLabellingStore(
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

  if (selectedTool !== Tools.BOX) {
    return null;
  }
  if (typeof imageId !== "string") {
    return null;
  }

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
        setBoxDrawingToolState(BoxDrawingToolState.IDLE);
        return true;
      }}
      onDrawstart={() => {
        setBoxDrawingToolState(BoxDrawingToolState.DRAWING);
        return true;
      }}
      onDrawend={async (drawEvent: DrawEvent) => {
        const geometry = new GeoJSON().writeGeometryObject(
          drawEvent.feature.getGeometry()
        ) as GeoJSON.Polygon;
        const createLabelPromise = perform(
          createLabelEffect(
            {
              imageId,
              selectedLabelClassId,
              geometry,
            },
            {
              setSelectedLabelId,
              client,
            }
          )
        );
        setBoxDrawingToolState(BoxDrawingToolState.IDLE);
        try {
          await createLabelPromise;
        } catch (error) {
          toast({
            title: "Error creating bounding box",
            description: error?.message,
            isClosable: true,
            status: "error",
            position: "bottom-right",
            duration: 10000,
          });
        }
      }}
    />
  );
};

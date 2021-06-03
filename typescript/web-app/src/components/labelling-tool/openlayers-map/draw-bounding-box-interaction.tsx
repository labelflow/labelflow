import { useState } from "react";
import { createBox } from "ol/interaction/Draw";
import OlSourceVector from "ol/source/Vector";
import GeometryType from "ol/geom/GeometryType";
import { useLabellingStore, Tools } from "../../../connectors/labelling-state";

type Props = { imageId: string };

const geometryFunction = createBox();

export const DrawBoundingBoxInteraction = ({}: Props) => {
  const selectedTool = useLabellingStore((state) => state.selectedTool);

  if (selectedTool !== Tools.BOUNDING_BOX) {
    return null;
  }

  return (
    <olInteractionDraw
      args={{
        type: GeometryType.CIRCLE,
        geometryFunction,
      }}
      onDrawend={(drawEvent) => {
        console.log(drawEvent);
        return false;
      }}
    />
  );
};

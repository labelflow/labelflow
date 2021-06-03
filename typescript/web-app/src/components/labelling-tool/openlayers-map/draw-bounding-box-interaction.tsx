import { createBox } from "ol/interaction/Draw";
import GeometryType from "ol/geom/GeometryType";
import { useLabellingStore, Tools } from "../../../connectors/labelling-state";

const geometryFunction = createBox();

export const DrawBoundingBoxInteraction = () => {
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

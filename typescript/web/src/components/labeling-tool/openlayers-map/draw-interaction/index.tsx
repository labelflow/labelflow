import { useRouter } from "next/router";
import { useLabelingStore, Tools } from "../../../../connectors/labeling-state";
import { DrawIogInteraction } from "./iog";
import { DrawBoundingBoxAndPolygonInteraction } from "./bounding-box-polygon";

export const DrawInteraction = () => {
  const { imageId } = useRouter()?.query;

  const selectedTool = useLabelingStore((state) => state.selectedTool);

  if (![Tools.BOX, Tools.POLYGON, Tools.IOG].includes(selectedTool)) {
    return null;
  }
  if (typeof imageId !== "string") {
    return null;
  }
  return selectedTool === Tools.IOG ? (
    <DrawIogInteraction imageId={imageId} />
  ) : (
    <DrawBoundingBoxAndPolygonInteraction imageId={imageId} />
  );
};

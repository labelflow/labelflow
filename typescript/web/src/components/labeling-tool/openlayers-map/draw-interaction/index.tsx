import { MutableRefObject } from "react";
import { useRouter } from "next/router";
import { Vector as OlSourceVector } from "ol/source";
import { Geometry } from "ol/geom";
import { useLabelingStore, Tools } from "../../../../connectors/labeling-state";
import { DrawIogInteraction } from "./iog";
import { DrawBoundingBoxAndPolygonInteraction } from "./bounding-box-polygon";

export const DrawInteraction = ({
  iogSpinnerRef,
  sourceVectorLabelsRef,
}: {
  iogSpinnerRef: MutableRefObject<HTMLDivElement | null>;
  sourceVectorLabelsRef: MutableRefObject<OlSourceVector<Geometry> | null>;
}) => {
  const { imageId } = useRouter()?.query;

  const selectedTool = useLabelingStore((state) => state.selectedTool);

  if (![Tools.BOX, Tools.POLYGON, Tools.IOG].includes(selectedTool)) {
    return null;
  }
  if (typeof imageId !== "string") {
    return null;
  }
  return selectedTool === Tools.IOG ? (
    <DrawIogInteraction
      imageId={imageId}
      iogSpinnerRef={iogSpinnerRef}
      sourceVectorLabelsRef={sourceVectorLabelsRef}
    />
  ) : (
    <DrawBoundingBoxAndPolygonInteraction imageId={imageId} />
  );
};

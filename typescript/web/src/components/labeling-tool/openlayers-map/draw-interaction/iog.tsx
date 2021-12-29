import { useCallback, useEffect, MutableRefObject } from "react";
import { Vector as OlSourceVector } from "ol/source";
import { Geometry } from "ol/geom";
import { useHotkeys } from "react-hotkeys-hook";

import {
  useLabelingStore,
  DrawingToolState,
} from "../../../../connectors/labeling-state";
import { keymap } from "../../../../keymap";

import { DrawIogCanvas } from "../iog/draw-canvas";
import { ModifyIog } from "../iog/modify";

export const DrawIogInteraction = ({
  imageId,
  iogSpinnerRef,
  sourceVectorLabelsRef,
}: {
  imageId: string;
  iogSpinnerRef: MutableRefObject<HTMLDivElement | null>;
  sourceVectorLabelsRef: MutableRefObject<OlSourceVector<Geometry> | null>;
}) => {
  const setDrawingToolState = useLabelingStore(
    (state) => state.setDrawingToolState
  );
  const selectedLabelId = useLabelingStore((state) => state.selectedLabelId);
  const setSelectedLabelId = useLabelingStore(
    useCallback((state) => state.setSelectedLabelId, [])
  );

  useEffect(() => {
    if (selectedLabelId == null) setDrawingToolState(DrawingToolState.IDLE);
    else setDrawingToolState(DrawingToolState.DRAWING);
  }, [selectedLabelId]);

  useHotkeys(
    keymap.validateIogLabel.key,
    () => {
      setSelectedLabelId(null);
      setDrawingToolState(DrawingToolState.IDLE);
    },
    {},
    [setSelectedLabelId]
  );

  if (typeof imageId !== "string") {
    return null;
  }

  return selectedLabelId == null ? (
    <DrawIogCanvas imageId={imageId} iogSpinnerRef={iogSpinnerRef} />
  ) : (
    <ModifyIog
      imageId={imageId}
      iogSpinnerRef={iogSpinnerRef}
      sourceVectorLabelsRef={sourceVectorLabelsRef}
    />
  );
};

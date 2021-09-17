import React, { MutableRefObject } from "react";
import OverlayPositioning from "ol/OverlayPositioning";

export const ClassificationOverlay = ({
  classificationOverlayRef,
  image,
}: {
  classificationOverlayRef: MutableRefObject<HTMLDivElement | null>;
  image: { height?: number };
}) => {
  if (!image?.height || !classificationOverlayRef?.current) {
    return null;
  }
  return (
    <olOverlay
      element={classificationOverlayRef.current}
      position={[0, image?.height]}
      positioning={OverlayPositioning.TOP_LEFT}
      className="pointereventsnone"
    />
  );
};

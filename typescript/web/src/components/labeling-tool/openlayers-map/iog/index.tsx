import { useRef, useCallback, useEffect, MutableRefObject } from "react";
import { Style } from "ol/style";
import { Vector as OlSourceVector } from "ol/source";
import { Geometry, Point } from "ol/geom";
import { useQuery } from "@apollo/client";
import { useHotkeys } from "react-hotkeys-hook";
import Icon from "ol/style/Icon";
import OverlayPositioning from "ol/OverlayPositioning";
import { Coordinate } from "ol/coordinate";

import {
  useLabelingStore,
  DrawingToolState,
} from "../../../../connectors/labeling-state";
import { keymap } from "../../../../keymap";

import { labelQuery } from "./queries";
import { HandleIogClick, HandleIogHover } from "./click-and-hover";
import { DrawIogCanvas } from "./draw-canvas";
import { ModifyCenterPoint } from "./modify-center-point";

export const DrawIogInteraction = ({
  imageId,
  iogSpinnerRef,
}: {
  imageId: string;
  iogSpinnerRef: MutableRefObject<HTMLDivElement | null>;
}) => {
  const iogSpinnerPosition = useLabelingStore(
    (state) => state.iogSpinnerPosition
  );
  const setDrawingToolState = useLabelingStore(
    (state) => state.setDrawingToolState
  );
  const selectedLabelId = useLabelingStore((state) => state.selectedLabelId);
  const setSelectedLabelId = useLabelingStore(
    useCallback((state) => state.setSelectedLabelId, [])
  );

  const { data: dataLabelQuery } = useQuery(labelQuery, {
    variables: { id: selectedLabelId },
    skip: selectedLabelId == null,
  });
  const pointsInside: Coordinate[] =
    dataLabelQuery?.label?.smartToolInput?.pointsInside ?? [];
  const pointsOutside: Coordinate[] =
    dataLabelQuery?.label?.smartToolInput?.pointsOutside ?? [];
  const centerPoint: null | Coordinate =
    dataLabelQuery?.label?.smartToolInput?.centerPoint;

  const vectorSourceRef = useRef<OlSourceVector<Geometry>>(null);

  useEffect(() => {
    if (selectedLabelId == null) setDrawingToolState(DrawingToolState.IDLE);
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
    <DrawIogCanvas imageId={imageId} />
  ) : (
    <>
      <ModifyCenterPoint vectorSourceRef={vectorSourceRef} />
      <HandleIogClick />
      <HandleIogHover />
      <olOverlay
        id="overlay-spinner"
        key="overlay-spinner"
        element={iogSpinnerRef.current ?? undefined}
        position={iogSpinnerPosition ?? undefined}
        positioning={OverlayPositioning.CENTER_CENTER}
      />
      <olLayerVector>
        <olSourceVector ref={vectorSourceRef}>
          {[
            ...(pointsInside?.map((coordinates, index) => {
              return (
                <olFeature
                  id={`point-inside-${index}`}
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${coordinates.join("-")}-${index}`}
                  geometry={new Point(coordinates)}
                  style={
                    new Style({
                      image: new Icon({
                        src: "/static/graphics/iog-inside.svg",
                        scale: 0.5,
                      }),
                    })
                  }
                />
              );
            }) ?? []),
            ...(pointsOutside?.map((coordinates, index) => {
              return (
                <olFeature
                  id={`point-outside-${index}`}
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${coordinates.join("-")}-${index}`}
                  geometry={new Point(coordinates)}
                  style={
                    new Style({
                      image: new Icon({
                        src: "/static/graphics/iog-outside.svg",
                        scale: 0.5,
                      }),
                    })
                  }
                />
              );
            }) ?? []),
            centerPoint && !iogSpinnerPosition ? (
              <olFeature
                key={centerPoint.join("-")}
                id="point-center"
                geometry={new Point(centerPoint)}
                style={
                  new Style({
                    image: new Icon({
                      src: "/static/graphics/iog-target.svg",
                      scale: 0.5,
                    }),
                  })
                }
              />
            ) : null,
          ].filter((item) => item)}
        </olSourceVector>
      </olLayerVector>
    </>
  );
};

import { useRef, useCallback, MutableRefObject, useMemo } from "react";
import { Style } from "ol/style";
import { Vector as OlSourceVector } from "ol/source";
import { Geometry, Point } from "ol/geom";
import { useQuery } from "@apollo/client";
import { useHotkeys } from "react-hotkeys-hook";
import Icon from "ol/style/Icon";
import OverlayPositioning from "ol/OverlayPositioning";
import { Coordinate } from "ol/coordinate";

import { useLabelingStore } from "../../../../connectors/labeling-state";
import { keymap } from "../../../../keymap";

import { LABEL_QUERY } from "./queries";
import { HandleIogClick, HandleIogHover } from "./click-and-hover";
import { ModifyIogCenterPoint } from "./modify-center-point";
import { ResizeIogCanvas } from "./resize-canvas";

export const ModifyIog = ({
  imageId,
  iogSpinnerRef,
  sourceVectorLabelsRef,
}: {
  imageId: string;
  iogSpinnerRef: MutableRefObject<HTMLDivElement | null>;
  sourceVectorLabelsRef: MutableRefObject<OlSourceVector<Geometry> | null>;
}) => {
  const iogSpinnerPosition = useLabelingStore(
    (state) => state.iogSpinnerPosition
  );
  const selectedLabelId = useLabelingStore((state) => state.selectedLabelId);
  const setSelectedLabelId = useLabelingStore(
    useCallback((state) => state.setSelectedLabelId, [])
  );

  const { data: dataLabelQuery } = useQuery(LABEL_QUERY, {
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
  const stylePointInside = useMemo(
    () =>
      new Style({
        image: new Icon({
          src: "/static/graphics/iog-inside.svg",
        }),
      }),
    []
  );
  const stylePointOutside = useMemo(
    () =>
      new Style({
        image: new Icon({
          src: "/static/graphics/iog-outside.svg",
        }),
      }),
    []
  );
  const stylePointCenter = useMemo(
    () =>
      new Style({
        image: new Icon({
          src: "/static/graphics/iog-target.svg",
        }),
      }),
    []
  );

  useHotkeys(
    keymap.validateIogLabel.key,
    () => {
      setSelectedLabelId(null);
    },
    {},
    [setSelectedLabelId]
  );
  if (typeof imageId !== "string") {
    return null;
  }
  return (
    <>
      <ModifyIogCenterPoint vectorSourceRef={vectorSourceRef} />
      <HandleIogClick />
      <HandleIogHover />
      <ResizeIogCanvas sourceVectorLabelsRef={sourceVectorLabelsRef} />
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
                  style={stylePointInside}
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
                  style={stylePointOutside}
                />
              );
            }) ?? []),
            centerPoint && !iogSpinnerPosition ? (
              <olFeature
                key="point-center"
                id="point-center"
                geometry={new Point(centerPoint)}
                style={stylePointCenter}
              />
            ) : null,
          ].filter((item) => item)}
        </olSourceVector>
      </olLayerVector>
    </>
  );
};

import {
  useMemo,
  useRef,
  useCallback,
  useState,
  useEffect,
  MutableRefObject,
} from "react";
import { Draw as OlDraw } from "ol/interaction";
import { createBox, DrawEvent } from "ol/interaction/Draw";
import GeoJSON, { GeoJSONPolygon } from "ol/format/GeoJSON";
import { Fill, Stroke, Style } from "ol/style";
import { Vector as OlSourceVector } from "ol/source";
import Collection from "ol/Collection";
import GeometryType from "ol/geom/GeometryType";
import { Feature, MapBrowserEvent } from "ol";
import { Geometry, Polygon, Point } from "ol/geom";
import { useApolloClient, useQuery, gql } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import { useHotkeys } from "react-hotkeys-hook";
import Icon from "ol/style/Icon";
import { LabelType } from "@labelflow/graphql-types";
import { ModifyEvent } from "ol/interaction/Modify";
import { useMap } from "@labelflow/react-openlayers-fiber";
import BaseEvent from "ol/events/Event";
import OverlayPositioning from "ol/OverlayPositioning";

import {
  useLabelingStore,
  DrawingToolState,
} from "../../../../connectors/labeling-state";
import { keymap } from "../../../../keymap";
import { noneClassColor } from "../../../../utils/class-color-generator";
import { createCreateLabelEffect } from "../../../../connectors/undo-store/effects/create-label";
import { createRunIogEffect } from "../../../../connectors/undo-store/effects/run-iog";
import { useUndoStore } from "../../../../connectors/undo-store";
import { getIogMaskIdFromLabelId } from "../../../../connectors/iog";

const labelClassQuery = gql`
  query getLabelClass($id: ID!) {
    labelClass(where: { id: $id }) {
      id
      name
      color
    }
  }
`;

const imageQuery = gql`
  query getImage($id: ID!) {
    image(where: { id: $id }) {
      id
      url
    }
  }
`;

const labelQuery = gql`
  query getLabel($id: ID!) {
    label(where: { id: $id }) {
      id
      smartToolInput
    }
  }
`;

const geometryFunction = createBox();
type Coordinate = [number, number];

export const DrawIogInteraction = ({
  imageId,
  iogSpinnerRef,
}: {
  imageId: string;
  iogSpinnerRef: MutableRefObject<HTMLDivElement | null>;
}) => {
  const map = useMap();
  const drawRef = useRef<OlDraw>(null);
  const iogSpinnerPosition = useLabelingStore(
    (state) => state.iogSpinnerPosition
  );
  const registerIogJob = useLabelingStore((state) => state.registerIogJob);
  const unregisterIogJob = useLabelingStore((state) => state.unregisterIogJob);
  const client = useApolloClient();

  const setDrawingToolState = useLabelingStore(
    (state) => state.setDrawingToolState
  );
  const selectedLabelId = useLabelingStore((state) => state.selectedLabelId);
  const setSelectedLabelId = useLabelingStore(
    useCallback((state) => state.setSelectedLabelId, [])
  );
  const selectedLabelClassId = useLabelingStore(
    (state) => state.selectedLabelClassId
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

  const { perform } = useUndoStore();
  const vectorSourceRef = useRef<OlSourceVector<Geometry>>(null);
  const [centerPointFeature, setCenterPointFeature] =
    useState<Feature<Polygon> | null>(null);
  const { data: dataLabelClass } = useQuery(labelClassQuery, {
    variables: { id: selectedLabelClassId },
    skip: selectedLabelClassId == null,
  });
  const selectedLabelClass = dataLabelClass?.labelClass;
  const { data: dataImage } = useQuery(imageQuery, {
    variables: { id: imageId },
    skip: imageId == null,
  });
  const toast = useToast();

  useEffect(() => {
    if (vectorSourceRef.current != null) {
      const centerPointFeatureFromSource =
        vectorSourceRef.current.getFeatureById("point-center");
      if (centerPoint != null)
        setCenterPointFeature(centerPointFeatureFromSource as Feature<Polygon>);

      const listener = (event: BaseEvent) => {
        const { feature } = event as unknown as { feature: Feature<Geometry> };
        if (feature.getProperties().id === "point-center") {
          setCenterPointFeature(feature as Feature<Polygon>);
        }
      };
      vectorSourceRef.current?.on(["addfeature"], listener);
      return () => vectorSourceRef.current?.un("addfeature", listener);
    }
    return () => {};
  }, [vectorSourceRef.current]);

  useHotkeys(
    keymap.validateIogLabel.key,
    () => {
      setSelectedLabelId(null);
      setDrawingToolState(DrawingToolState.IDLE);
    },
    {},
    [setSelectedLabelId]
  );
  useHotkeys(
    keymap.cancelAction.key,
    () => drawRef.current?.abortDrawing(),
    {},
    [drawRef]
  );

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

  const handleClick = useCallback(
    async (event: MapBrowserEvent<UIEvent>) => {
      const timestamp = new Date().getTime();
      const { map: mapEvent } = event;

      const idOfClickedFeature = mapEvent.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature.getProperties().id
      );

      if (
        idOfClickedFeature === getIogMaskIdFromLabelId(selectedLabelId ?? "")
      ) {
        // Deselect feature
        setSelectedLabelId(null);
        setDrawingToolState(DrawingToolState.IDLE);
      } else if (idOfClickedFeature === selectedLabelId) {
        // Add point outside
        registerIogJob(timestamp, selectedLabelId, centerPoint);
        await perform(
          createRunIogEffect(
            {
              labelId: dataLabelQuery?.label?.id,
              pointsInside,
              pointsOutside: [...pointsOutside, event.coordinate as Coordinate],
            },
            { client }
          )
        );
        unregisterIogJob(timestamp, selectedLabelId);
      } else if (idOfClickedFeature?.includes("point-inside-")) {
        // Remove point inside
        const indexPointToRemove = parseInt(
          idOfClickedFeature.split("point-inside-")[1],
          10
        );
        registerIogJob(timestamp, selectedLabelId, centerPoint);
        await perform(
          createRunIogEffect(
            {
              labelId: dataLabelQuery?.label?.id,
              pointsInside: [
                ...pointsInside.slice(0, indexPointToRemove),
                ...pointsInside.slice(
                  indexPointToRemove + 1,
                  pointsInside.length
                ),
              ],
              pointsOutside,
            },
            { client }
          )
        );
        unregisterIogJob(timestamp, selectedLabelId);
      } else if (idOfClickedFeature?.includes("point-outside-")) {
        // Remove point outside
        const indexPointToRemove = parseInt(
          idOfClickedFeature.split("point-outside-")[1],
          10
        );
        registerIogJob(timestamp, selectedLabelId, centerPoint);
        await perform(
          createRunIogEffect(
            {
              labelId: dataLabelQuery?.label?.id,
              pointsInside,
              pointsOutside: [
                ...pointsOutside.slice(0, indexPointToRemove),
                ...pointsOutside.slice(
                  indexPointToRemove + 1,
                  pointsOutside.length
                ),
              ],
            },
            { client }
          )
        );
        unregisterIogJob(timestamp, selectedLabelId);
      } else if (idOfClickedFeature?.includes("point-center")) {
        return false;
      } else {
        // Add point inside
        registerIogJob(timestamp, selectedLabelId, centerPoint);
        await perform(
          createRunIogEffect(
            {
              labelId: dataLabelQuery?.label?.id,
              pointsInside: [...pointsInside, event.coordinate as Coordinate],
              pointsOutside,
            },
            { client }
          )
        );
        unregisterIogJob(timestamp, selectedLabelId);
      }

      return false;
    },
    [selectedLabelId, dataLabelQuery]
  );

  useEffect(() => {
    if (selectedLabelId != null) {
      map?.on("click", handleClick);
      return () => map?.un("click", handleClick);
    }
    return () => {};
  }, [map, selectedLabelId, handleClick]);

  const performIOGFromDrawEvent = async (drawEvent: DrawEvent) => {
    const timestamp = new Date().getTime();
    const openLayersGeometry = drawEvent.feature.getGeometry();
    const geometry = new GeoJSON().writeGeometryObject(
      openLayersGeometry
    ) as GeoJSONPolygon;
    const labelId = await createCreateLabelEffect(
      {
        imageId,
        selectedLabelClassId,
        geometry,
        labelType: LabelType.Polygon,
      },
      {
        setSelectedLabelId,
        client,
      }
    ).do();
    const inferencePromise = (async () => {
      const dataUrl = await (async function () {
        const blob = await fetch(dataImage?.image?.url).then((r) => r.blob());
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      })();
      const [x, y, xMax, yMax] = openLayersGeometry.getExtent();
      const boundingBoxCenterPoint: Coordinate = [
        Math.floor((x + xMax) / 2),
        Math.floor((y + yMax) / 2),
      ];
      registerIogJob(timestamp, labelId, boundingBoxCenterPoint);

      return perform(
        createRunIogEffect(
          {
            labelId,
            x,
            y,
            height: yMax - y,
            width: xMax - x,
            imageUrl: dataUrl,
            centerPoint: boundingBoxCenterPoint,
          },
          { client }
        )
      );
    })();

    try {
      await inferencePromise;
      unregisterIogJob(timestamp, labelId);
    } catch (error) {
      toast({
        title: "Error executing IOG",
        description: error?.message,
        isClosable: true,
        status: "error",
        position: "bottom-right",
        duration: 10000,
      });
    }
  };

  const performIogFromModifyEvent = async (
    modifyEvent: ModifyEvent
  ): Promise<boolean> => {
    const timestamp = new Date().getTime();
    const newCoordinates = modifyEvent.mapBrowserEvent.coordinate;
    registerIogJob(timestamp, selectedLabelId, newCoordinates);
    await perform(
      createRunIogEffect(
        {
          labelId: selectedLabelId ?? "",
          centerPoint: newCoordinates,
          pointsInside: pointsInside ?? undefined,
          pointsOutside: pointsOutside ?? undefined,
        },
        { client }
      )
    );
    unregisterIogJob(timestamp, selectedLabelId);
    return true;
  };

  useEffect(() => {
    const handler = function (event: MapBrowserEvent<UIEvent>) {
      const { map: mapEvent } = event;
      if (!map) return;
      const idOfHoveredFeature = mapEvent.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature.getProperties().id
      );
      if (idOfHoveredFeature === selectedLabelId) {
        map.getViewport().style.cursor = `url("/static/graphics/iog-remove.svg") 12 14, auto`;
      } else if (
        idOfHoveredFeature?.includes("point-inside-") ||
        idOfHoveredFeature?.includes("point-outside-")
      ) {
        map.getViewport().style.cursor = `url("/static/graphics/iog-delete.svg") 16 16, auto`;
      } else if (
        idOfHoveredFeature !== getIogMaskIdFromLabelId(selectedLabelId ?? "") &&
        !idOfHoveredFeature?.includes("point-center") &&
        selectedLabelId != null
      ) {
        map.getViewport().style.cursor = `url("/static/graphics/iog-add.svg") 12 12, auto`;
      }
    };
    map?.on("pointermove", handler);
    return () => {
      if (!map) return;
      map.un("pointermove", handler);
      map.getViewport().style.cursor = "auto";
    };
  }, [map, selectedLabelId]);

  if (typeof imageId !== "string") {
    return null;
  }

  return selectedLabelId == null ? (
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
        setDrawingToolState(DrawingToolState.IDLE);
        return true;
      }}
      onDrawstart={() => {
        setDrawingToolState(DrawingToolState.DRAWING);
        return true;
      }}
      onDrawend={async (e) => {
        await performIOGFromDrawEvent(e);
      }}
    />
  ) : (
    <>
      {centerPointFeature != null && (
        <olInteractionModify
          args={{ features: new Collection([centerPointFeature]) }}
          onModifyend={performIogFromModifyEvent}
        />
      )}
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

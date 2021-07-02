import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { Feature, MapBrowserEvent, Map as OlMap } from "ol";
import { Geometry } from "ol/geom";
import { Coordinate, distance } from "ol/coordinate";
import Polygon, { fromExtent } from "ol/geom/Polygon";
import { Extent } from "ol/extent";
import { TranslateEvent } from "ol/interaction/Translate";

type FeatureVertices = [Coordinate, Coordinate, Coordinate, Coordinate];

/**
 * Returns an array with the coordinate of the feature vertices, starting from bottom left and going clockwise
 * @param param0
 * @returns
 */
const getFeatureVerticesFromExtent = ({
  x,
  y,
  destX,
  destY,
}: {
  x: number;
  y: number;
  destX: number;
  destY: number;
}): FeatureVertices => {
  return [
    [x, y],
    [x, destY],
    [destX, destY],
    [destX, y],
  ];
};

const vertexEnum = ["bottomLeft", "topLeft", "topRight", "bottomRight"];

const getNewFeatureExtentFromDragEvent = ({
  extent,
  vertex,
  coordinate,
}: {
  extent: Extent;
  vertex: string;
  coordinate: Coordinate;
}): Extent => {
  if (extent != null && coordinate != null && vertex != null) {
    const [x, y, destX, destY] = extent;
    const [newX, newY] = coordinate;
    switch (vertex) {
      case "bottomLeft":
        return [newX, newY, destX, destY];
      case "topLeft":
        return [newX, y, destX, newY];
      case "topRight":
        return [x, y, newX, newY];
      case "bottomRight":
        return [x, newY, newX, destY];
      default:
        return extent;
    }
  }
  return extent;
};

export const BoxResizeTranslateInteraction = ({
  selectedFeature,
  map,
  pixelTolerance = 20,
}: {
  selectedFeature: Feature<Polygon> | null;
  map: OlMap | null;
  pixelTolerance?: number;
}) => {
  // const [featureVertices, setFeatureVertices] =
  //   useState<FeatureVertices | null>(null);
  const featureVerticesRef = useRef(null);
  // const [selectedVertex, setSelectedVertex] = useState<string | null>(null);
  const selectedVertexRef = useRef(null);
  // const [mapTarget, setMapTarget] = useState<HTMLElement | null>(null);
  // useEffect(() => {
  //   if (map != null) {
  //     setMapTarget(map.getTarget() as HTMLElement);
  //   } else {
  //     setMapTarget(null);
  //   }
  // }, [map]);

  useEffect(() => {
    selectedFeatureRef.current = selectedFeature;
    if (selectedFeatureRef.current != null) {
      const [x, y, destX, destY] = selectedFeatureRef.current
        .getGeometry()
        .getExtent();
      // setFeatureVertices(getFeatureVerticesFromExtent({ x, y, destX, destY }));
      featureVerticesRef.current = getFeatureVerticesFromExtent({
        x,
        y,
        destX,
        destY,
      });
    } else {
      // setFeatureVertices(null);
      featureVerticesRef.current = null;
    }
  }, [selectedFeature]);
  console.log("Selected feature", selectedFeature);
  const pointerInteractionRef = useRef(null);
  const selectedFeatureRef = useRef<Feature<Polygon>>(selectedFeature);

  const args = useMemo(() => {
    const getClosestVertex = (coordinate) => {
      if (featureVerticesRef.current != null && coordinate != null) {
        const coordinateInPixels = map?.getPixelFromCoordinate(coordinate);
        const distanceToVertices = featureVerticesRef.current?.map((vertex) =>
          distance(coordinateInPixels, map?.getPixelFromCoordinate(vertex))
        );
        const minimalDistanceIndex = distanceToVertices.indexOf(
          Math.min(...distanceToVertices)
        );
        return {
          distanceToVertex: distanceToVertices[minimalDistanceIndex],
          vertex: vertexEnum[minimalDistanceIndex],
          insideTolerance:
            distanceToVertices[minimalDistanceIndex] < pixelTolerance,
        };
      }
      return {
        distanceToVertex: null,
        vertex: null,
        insideTolerance: null,
      };
    };

    const getClosestLine = (coordinate) => {
      if (featureVerticesRef.current != null && coordinate != null) {
        const closestPoint = selectedFeatureRef.current
          .getGeometry()
          .getClosestPoint(coordinate);
        const coordinateInPixels = map?.getPixelFromCoordinate(coordinate);
        const distanceToClosestPoint = distance(
          coordinateInPixels,
          map?.getPixelFromCoordinate(closestPoint)
        );
        if (distanceToClosestPoint < pixelTolerance) {
          if (closestPoint[0] === featureVerticesRef.current[0][0]) {
            return {
              distanceToLine: distanceToClosestPoint,
              line: "left",
              insideTolerance: true,
            };
          }
          if (closestPoint[0] === featureVerticesRef.current[2][0]) {
            return {
              distanceToLine: distanceToClosestPoint,
              line: "right",
              insideTolerance: true,
            };
          }
          if (closestPoint[1] === featureVerticesRef.current[0][1]) {
            return {
              distanceToLine: distanceToClosestPoint,
              line: "bottom",
              insideTolerance: true,
            };
          }
          if (closestPoint[1] === featureVerticesRef.current[2][1]) {
            return {
              distanceToLine: distanceToClosestPoint,
              line: "top",
              insideTolerance: true,
            };
          }
        }
      }
      return {
        distanceToLine: null,
        line: null,
        insideTolerance: null,
      };
    };

    return {
      handleDownEvent: (e: MapBrowserEvent) => {
        console.log("Down event");
        const { insideTolerance, vertex } = getClosestVertex(e.coordinate);
        if (insideTolerance) {
          console.log("Selected index", vertex);
          console.log("Deactivated!");
          // setSelectedVertex(vertex);
          selectedVertexRef.current = vertex;
          return true;
        }
        return false;
      },
      handleDragEvent: (e) => {
        console.log("Drag event", e.coordinate);
        if (selectedVertexRef.current != null) {
          const extent = selectedFeatureRef.current.getGeometry().getExtent();
          const newExtent = getNewFeatureExtentFromDragEvent({
            extent,
            vertex: selectedVertexRef.current,
            coordinate: e.coordinate,
          });
          selectedFeatureRef.current.setGeometry(fromExtent(newExtent));
          e.preventDefault();
          e.stopPropagation();
        }
      },
      handleEvent: (e: MapBrowserEvent) => {
        if (e.type === "pointermove") {
          const mapTarget = map?.getTarget();
          if (mapTarget != null) {
            const { insideTolerance, vertex } = getClosestVertex(e.coordinate);
            if (insideTolerance) {
              console.log("Inside tolerance!");
              const cursor =
                vertex === "bottomLeft" || vertex === "topRight"
                  ? "nesw-resize"
                  : "nwse-resize";
              mapTarget.style.cursor = cursor;
              e.stopPropagation();
              return false;
            }

            const { insideTolerance: insideLineTolerance, line } =
              getClosestLine(e.coordinate);
            if (insideLineTolerance) {
              console.log("Inside tolerance line!");
              const cursor =
                line === "left" || line === "right" ? "ew-resize" : "ns-resize";
              mapTarget.style.cursor = cursor;
              e.stopPropagation();
              return false;
            }
            return true;
          }
          return true;
        }
        return true;
      },
      handleMoveEvent: (e: MapBrowserEvent) => {
        console.log("Move event");
        const mapTarget = map?.getTarget();
        if (mapTarget != null) {
          const { insideTolerance, vertex } = getClosestVertex(e.coordinate);
          if (insideTolerance) {
            console.log("Inside tolerance!");
            const cursor =
              vertex === "bottomLeft" || vertex === "topRight"
                ? "nesw-resize"
                : "nwse-resize";
            mapTarget.style.cursor = cursor;
            e.stopPropagation();
            return;
          }

          const { insideTolerance: insideLineTolerance, line } = getClosestLine(
            e.coordinate
          );
          if (insideLineTolerance) {
            console.log("Inside tolerance line!");
            const cursor =
              line === "left" || line === "right" ? "ew-resize" : "ns-resize";
            mapTarget.style.cursor = cursor;
            e.stopPropagation();
          }
        }
      },
      handleUpEvent: () => {
        console.log("Up event");
        if (selectedFeatureRef.current != null) {
          const [x, y, destX, destY] = selectedFeatureRef.current
            .getGeometry()
            .getExtent();
          // setFeatureVertices(getFeatureVerticesFromExtent({ x, y, destX, destY }));
          featureVerticesRef.current = getFeatureVerticesFromExtent({
            x,
            y,
            destX,
            destY,
          });
        } else {
          // setFeatureVertices(null);
          featureVerticesRef.current = null;
        }
        console.log("Done");
        return false;
      },
      stopDown: (handled) => {
        console.log("Received here", handled);
        return handled;
      },
    };
  }, []);
  return selectedFeatureRef.current != null ? (
    <olInteractionPointer
      ref={pointerInteractionRef}
      args={args}
      // handleDownEvent={(e: MapBrowserEvent) => {
      //   console.log("Down event");
      //   lastDownEvent.current = Date.now();
      //   const { insideTolerance, vertex } = getClosestVertex(e.coordinate);
      //   if (insideTolerance) {
      //     console.log("Selected index", vertex);
      //     map?.getInteractions().getArray()[2].setActive(false);
      //     console.log("Deactivated!");
      //     setSelectedVertex(vertex);
      //     return true;
      //   }
      //   return false;
      // }}
      // handleDragEvent={(e) => {
      //   console.log("Drag event", selectedVertex);
      //   if (selectedVertex != null) {
      //     const extent = selectedFeature.getGeometry().getExtent();
      //     const newExtent = getNewFeatureExtentFromDragEvent({
      //       extent,
      //       vertex: selectedVertex,
      //       coordinate: e.coordinate,
      //     });
      //     selectedFeature.setGeometry(fromExtent(newExtent));
      //     e.preventDefault();
      //     e.stopPropagation();
      //   }
      // }}
      // handleMoveEvent={(e: MapBrowserEvent) => {
      //   const viewport = e.map.getViewport();
      //   // console.log("Map", olMap);
      //   console.log("Move event", lastDownEvent.current);
      //   if (viewport != null) {
      //     const { insideTolerance, vertex, distanceToVertex } =
      //       getClosestVertex(e.coordinate);
      //     console.log(insideTolerance, vertex, distanceToVertex);
      //     if (insideTolerance) {
      //       console.log("Inside tolerance!");
      //       const cursor =
      //         vertex === "bottomLeft" || vertex === "topRight"
      //           ? "nesw-resize"
      //           : "nwse-resize";
      //       viewport.style.cursor = cursor;
      //     }
      //   }
      // }}
      // handleUpEvent={() => {
      //   console.log("Up event");
      //   map?.getInteractions().getArray()[2].setActive(true);
      //   console.log("Activated!");
      //   return false;
      // }}
      // stopDown={(e: MapBrowserEvent) => {
      //   const { insideTolerance } = getClosestVertex(e.coordinate);
      //   console.log("Stopping down", insideTolerance === true);
      //   return insideTolerance === true;
      // }}
    />
  ) : null;
};

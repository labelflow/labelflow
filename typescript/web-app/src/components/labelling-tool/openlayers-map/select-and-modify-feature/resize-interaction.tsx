import { useEffect, useState, useCallback, useRef } from "react";
import { Feature, MapBrowserEvent, Map as OlMap } from "ol";
import { Geometry } from "ol/geom";
import { Coordinate, distance } from "ol/coordinate";
import { fromExtent } from "ol/geom/Polygon";
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

export const ResizeInteraction = ({
  selectedFeature,
  map,
  pixelTolerance = 10,
}: {
  selectedFeature: Feature<Geometry> | null;
  map: OlMap | null;
  pixelTolerance?: number;
}) => {
  const [featureVertices, setFeatureVertices] =
    useState<FeatureVertices | null>(null);
  const [selectedVertex, setSelectedVertex] = useState<string | null>(null);
  const [mapTarget, setMapTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (map != null) {
      setMapTarget(map.getTarget() as HTMLElement);
    } else {
      setMapTarget(null);
    }
  }, [map]);
  useEffect(() => {
    if (selectedFeature != null) {
      const [x, y, destX, destY] = selectedFeature.getGeometry().getExtent();
      setFeatureVertices(getFeatureVerticesFromExtent({ x, y, destX, destY }));
    } else {
      setFeatureVertices(null);
    }
  }, [selectedFeature]);
  const getClosestVertex = useCallback(
    (coordinate) => {
      if (featureVertices != null && coordinate != null) {
        const distanceToVertices = featureVertices.map((vertex) =>
          distance(coordinate, vertex)
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
        distance: null,
        vertex: null,
        insideTolerance: null,
      };
    },
    [featureVertices]
  );
  const pointerInteractionRef = useRef(null);
  return selectedFeature != null ? (
    <olInteractionPointer
      ref={pointerInteractionRef}
      args={{
        handleDownEvent: (e: MapBrowserEvent) => {
          const { insideTolerance, vertex } = getClosestVertex(e.coordinate);
          if (insideTolerance) {
            console.log("Selected index", vertex);
            map?.getInteractions().getArray()[2].setActive(false);
            console.log("Deactivated!");
            setSelectedVertex(vertex);
            return true;
          }
          return false;
        },
        handleDragEvent: (e) => {
          console.log("Drag event", e.coordinate);
          if (selectedVertex != null) {
            const extent = selectedFeature.getGeometry().getExtent();
            const newExtent = getNewFeatureExtentFromDragEvent({
              extent,
              vertex: selectedVertex,
              coordinate: e.coordinate,
            });
            selectedFeature.setGeometry(fromExtent(newExtent));
            e.preventDefault();
            e.stopPropagation();
          }
        },
        handleMoveEvent: (e: MapBrowserEvent) => {
          if (mapTarget != null) {
            const { insideTolerance, vertex } = getClosestVertex(e.coordinate);
            if (insideTolerance) {
              const cursor =
                vertex === "bottomLeft" || vertex === "topRight"
                  ? "nesw-resize"
                  : "nwse-resize";
              mapTarget.style.cursor = cursor;
            }
          }
        },
        handleUpEvent: () => {
          map?.getInteractions().getArray()[2].setActive(true);
          console.log("Activated!");
          return false;
        },
        stopDown: (e: MapBrowserEvent) => {
          const { insideTolerance } = getClosestVertex(e.coordinate);
          return insideTolerance === true;
        },
      }}
    />
  ) : null;
};

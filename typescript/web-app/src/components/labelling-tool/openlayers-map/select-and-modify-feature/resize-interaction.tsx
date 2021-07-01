import { useEffect, useState, useCallback } from "react";
import { Feature, MapBrowserEvent, Map as OlMap } from "ol";
import { Geometry } from "ol/geom";
import { Coordinate, distance } from "ol/coordinate";

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
  return selectedFeature != null ? (
    <olInteractionPointer
      args={{
        handleDownEvent: (e: MapBrowserEvent) => {
          const { insideTolerance, vertex } = getClosestVertex(e.coordinate);
          if (insideTolerance) {
            console.log("Selected index", vertex);
            setSelectedVertex(vertex);
            return true;
          }
          return false;
        },
        handleDragEvent: () => {
          console.log("Drag event!");
          return true;
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
              return true;
            }
            return false;
          }
        },
        handleUpEvent: () => {},
        stopDown: (e: MapBrowserEvent) => {
          const { insideTolerance } = getClosestVertex(e.coordinate);
          return insideTolerance === true;
        },
      }}
    />
  ) : null;
};

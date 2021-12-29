import { Collection, Feature, MapBrowserEvent } from "ol";
import PointerInteraction from "ol/interaction/Pointer";
import { Coordinate, distance } from "ol/coordinate";
import { Extent } from "ol/extent";
import { Geometry, Polygon } from "ol/geom";

import {
  extractIogMaskFromLabel,
  extractSmartToolInputInputFromIogMask,
  extractImageDimensionsFromIogMask,
} from "../../../../connectors/iog";

type FeatureVertices = [Coordinate, Coordinate, Coordinate, Coordinate];
type ClosestElement = {
  distanceToElement: number | null;
  element: string | null;
  insideTolerance: boolean | null;
};
export type ResizeIogEvent = {
  features: Collection<Feature<Geometry>>;
};

export class ResizeIogCanvasInteraction extends PointerInteraction {
  feature: Feature<Polygon> | null;

  featureVertices: FeatureVertices | null = null;

  imageDimensions: { width: number; height: number } | null = null;

  selectedElement: string | null = null;

  pixelTolerance: number = 10;

  vertexEnum = ["bottomLeft", "topLeft", "topRight", "bottomRight"];

  featureChanged = false;

  onInteractionEnd: (() => void) | ((event: ResizeIogEvent | null) => boolean) =
    () => true;

  constructor(options: {
    pixelTolerance?: number;
    selectedFeature?: Feature<Polygon>;
    onInteractionEnd?: (event: ResizeIogEvent | null) => boolean;
  }) {
    super();
    this.pixelTolerance = options?.pixelTolerance ?? this.pixelTolerance;
    this.feature = options?.selectedFeature ?? null;
    this.onInteractionEnd = options?.onInteractionEnd ?? this.onInteractionEnd;
    if (this.feature != null) {
      const coordinates = this.feature.getGeometry().getCoordinates();
      const smartToolInput = extractSmartToolInputInputFromIogMask(coordinates);
      this.imageDimensions = extractImageDimensionsFromIogMask(coordinates);
      this.featureVertices = this.getFeatureVerticesFromExtent({
        x: smartToolInput.x,
        y: smartToolInput.y,
        destX: smartToolInput.x + smartToolInput.width,
        destY: smartToolInput.y + smartToolInput.height,
      });
      this.feature.on("change", () => {
        if (this.feature != null) {
          const smartToolInputNew = extractSmartToolInputInputFromIogMask(
            this.feature.getGeometry().getCoordinates()
          );
          this.featureVertices = this.getFeatureVerticesFromExtent({
            x: smartToolInputNew.x,
            y: smartToolInputNew.y,
            destX: smartToolInputNew.x + smartToolInputNew.width,
            destY: smartToolInputNew.y + smartToolInputNew.height,
          });
        }
      });
    }
  }

  /**
   * Returns an array with the coordinate of the feature vertices, starting from bottom left and going clockwise
   * @param param0
   * @returns
   */
  getFeatureVerticesFromExtent = ({
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

  getNewFeatureExtentFromDragEvent = ({
    extent,
    vertex,
    coordinate,
  }: {
    extent: Extent;
    vertex: string;
    coordinate: Coordinate;
  }): number[] => {
    if (
      extent != null &&
      coordinate != null &&
      vertex != null &&
      this.feature != null
    ) {
      const geometry = this.feature.getGeometry();
      const [x, y, destX, destY] = extent;
      const [newX, newY] = [
        Math.max(
          0,
          Math.min(coordinate[0], this.imageDimensions?.width ?? Infinity)
        ),
        Math.max(
          0,
          Math.min(coordinate[1], this.imageDimensions?.height ?? Infinity)
        ),
      ];
      switch (vertex) {
        case "bottomLeft":
          return [Math.min(newX, destX), Math.min(newY, destY), destX, destY];
        case "topLeft":
          return [Math.min(destX, newX), y, destX, Math.max(y, newY)];
        case "topRight":
          return [x, y, Math.max(x, newX), Math.max(y, newY)];
        case "bottomRight":
          return [x, Math.min(destY, newY), Math.max(x, newX), destY];
        case "left":
          return [Math.min(destX, newX), y, destX, destY];
        case "right":
          return [x, y, Math.max(x, newX), destY];
        case "top":
          return [x, y, destX, Math.max(y, newY)];
        case "bottom":
          return [x, Math.min(destY, newY), destX, destY];
        default:
          return geometry.getExtent();
      }
    }
    return extent;
  };

  getClosestElement = (coordinate: Coordinate): ClosestElement => {
    const map = this.getMap();
    if (
      this.featureVertices != null &&
      coordinate != null &&
      map != null &&
      this.feature != null
    ) {
      const coordinateInPixels = map.getPixelFromCoordinate(coordinate);
      const distanceToVertices = this.featureVertices?.map((vertex) =>
        distance(coordinateInPixels, map.getPixelFromCoordinate(vertex))
      );
      const minimalDistanceIndex = distanceToVertices.indexOf(
        Math.min(...distanceToVertices)
      );
      if (distanceToVertices[minimalDistanceIndex] < this.pixelTolerance) {
        return {
          distanceToElement: distanceToVertices[minimalDistanceIndex],
          element: this.vertexEnum[minimalDistanceIndex],
          insideTolerance:
            distanceToVertices[minimalDistanceIndex] < this.pixelTolerance,
        };
      }

      const closestPoint = this.feature
        .getGeometry()
        .getClosestPoint(coordinate);
      const distanceToClosestPoint = distance(
        coordinateInPixels,
        map?.getPixelFromCoordinate(closestPoint)
      );
      if (distanceToClosestPoint < this.pixelTolerance) {
        if (closestPoint[0] === this.featureVertices[0][0]) {
          return {
            distanceToElement: distanceToClosestPoint,
            element: "left",
            insideTolerance: true,
          };
        }
        if (closestPoint[0] === this.featureVertices[2][0]) {
          return {
            distanceToElement: distanceToClosestPoint,
            element: "right",
            insideTolerance: true,
          };
        }
        if (closestPoint[1] === this.featureVertices[0][1]) {
          return {
            distanceToElement: distanceToClosestPoint,
            element: "bottom",
            insideTolerance: true,
          };
        }
        if (closestPoint[1] === this.featureVertices[2][1]) {
          return {
            distanceToElement: distanceToClosestPoint,
            element: "top",
            insideTolerance: true,
          };
        }
      }
    }

    return {
      distanceToElement: null,
      element: null,
      insideTolerance: null,
    };
  };

  handleDownEvent(e: MapBrowserEvent<UIEvent>) {
    const { insideTolerance, element } = this.getClosestElement(e.coordinate);
    if (insideTolerance) {
      this.selectedElement = element;
      return true;
    }
    return false;
  }

  handleUpEvent() {
    if (this.feature != null) {
      const [x, y, destX, destY] = this.feature.getGeometry().getExtent();
      this.featureVertices = this.getFeatureVerticesFromExtent({
        x,
        y,
        destX,
        destY,
      });
      if (this.featureChanged === true) {
        this.onInteractionEnd({ features: new Collection([this.feature]) });
        this.featureChanged = false;
      }
    } else {
      this.featureVertices = null;
    }
    this.selectedElement = null;
    return false;
  }

  handleDragEvent(e: MapBrowserEvent<UIEvent>) {
    if (this.selectedElement != null && this.feature != null) {
      const coordinates = this.feature.getGeometry().getCoordinates();
      const smartToolInput = extractSmartToolInputInputFromIogMask(coordinates);
      const extent = [
        smartToolInput.x,
        smartToolInput.y,
        smartToolInput.x + smartToolInput.width,
        smartToolInput.y + smartToolInput.height,
      ];
      const [x, y, X, Y] = this.getNewFeatureExtentFromDragEvent({
        extent,
        vertex: this.selectedElement,
        coordinate: e.coordinate,
      });
      const { width: imageWidth, height: imageHeight } =
        extractImageDimensionsFromIogMask(coordinates);
      this.feature.setGeometry(
        new Polygon(
          extractIogMaskFromLabel(
            {
              smartToolInput: {
                x,
                y,
                width: X - x,
                height: Y - y,
              },
            },
            imageWidth,
            imageHeight
          )
        )
      );
      this.featureChanged = true;
      e.preventDefault();
      e.stopPropagation();
    }
  }

  handleMoveEvent(e: MapBrowserEvent<UIEvent>) {
    const mapTargetViewport = e.map.getViewport();
    if (mapTargetViewport != null) {
      const { insideTolerance, element } = this.getClosestElement(e.coordinate);
      if (insideTolerance) {
        switch (element) {
          case "bottomLeft":
          case "topRight":
            mapTargetViewport.style.cursor = "nesw-resize";
            break;
          case "bottomRight":
          case "topLeft":
            mapTargetViewport.style.cursor = "nwse-resize";
            break;
          case "left":
          case "right":
            mapTargetViewport.style.cursor = "ew-resize";
            break;
          case "top":
          case "bottom":
            mapTargetViewport.style.cursor = "ns-resize";
            break;
          default:
            mapTargetViewport.style.cursor = "default";
            break;
        }
        e.stopPropagation();
      }
    }
  }

  static stopDown(handled: boolean) {
    return handled;
  }
}

import { Collection, Feature, MapBrowserEvent } from "ol";
import PointerInteraction from "ol/interaction/Pointer";
import { Coordinate, distance } from "ol/coordinate";
import { Extent } from "ol/extent";
import { Geometry, Polygon } from "ol/geom";
import { fromExtent } from "ol/geom/Polygon";

type FeatureVertices = [Coordinate, Coordinate, Coordinate, Coordinate];
type ClosestElement = {
  distanceToElement: number | null;
  element: string | null;
  insideTolerance: boolean | null;
};
export type ResizeAndTranslateEvent = {
  features: Collection<Feature<Geometry>>;
};

export class ResizeAndTranslateBox extends PointerInteraction {
  feature: Feature<Polygon> | null;

  featureVertices: FeatureVertices | null = null;

  selectedElement: string | null = null;

  pixelTolerance: number = 10;

  vertexEnum = ["bottomLeft", "topLeft", "topRight", "bottomRight"];

  lastTranslateCoordinates: Coordinate | null = null;

  featureChanged = false;

  onInteractionEnd:
    | (() => void)
    | ((event: ResizeAndTranslateEvent | null) => boolean) = () => true;

  constructor(options: {
    pixelTolerance?: number;
    selectedFeature?: Feature<Polygon>;
    onInteractionEnd?: (event: ResizeAndTranslateEvent | null) => boolean;
  }) {
    super();
    this.pixelTolerance = options?.pixelTolerance ?? this.pixelTolerance;
    this.feature = options?.selectedFeature ?? null;
    this.onInteractionEnd = options?.onInteractionEnd ?? this.onInteractionEnd;
    if (this.feature != null) {
      const [x, y, destX, destY] = this.feature.getGeometry().getExtent();
      this.featureVertices = this.getFeatureVerticesFromExtent({
        x,
        y,
        destX,
        destY,
      });
      this.feature.on("change", () => {
        if (this.feature != null) {
          const [newX, newY, newDestX, newDestY] = this.feature
            .getGeometry()
            .getExtent();
          this.featureVertices = this.getFeatureVerticesFromExtent({
            x: newX,
            y: newY,
            destX: newDestX,
            destY: newDestY,
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

  getNewFeatureGeometryFromDragEvent = ({
    extent,
    vertex,
    coordinate,
  }: {
    extent: Extent;
    vertex: string;
    coordinate: Coordinate;
  }): Polygon => {
    if (
      extent != null &&
      coordinate != null &&
      vertex != null &&
      this.feature != null
    ) {
      const geometry = this.feature.getGeometry();
      const [x, y, destX, destY] = extent;
      const [newX, newY] = coordinate;
      switch (vertex) {
        case "bottomLeft":
          return fromExtent([
            Math.min(newX, destX),
            Math.min(newY, destY),
            destX,
            destY,
          ]);
        case "topLeft":
          return fromExtent([
            Math.min(destX, newX),
            y,
            destX,
            Math.max(y, newY),
          ]);
        case "topRight":
          return fromExtent([x, y, Math.max(x, newX), Math.max(y, newY)]);
        case "bottomRight":
          return fromExtent([
            x,
            Math.min(destY, newY),
            Math.max(x, newX),
            destY,
          ]);
        case "left":
          return fromExtent([Math.min(destX, newX), y, destX, destY]);
        case "right":
          return fromExtent([x, y, Math.max(x, newX), destY]);
        case "top":
          return fromExtent([x, y, destX, Math.max(y, newY)]);
        case "bottom":
          return fromExtent([x, Math.min(destY, newY), destX, destY]);
        case "feature":
          if (this.lastTranslateCoordinates != null) {
            const deltaX = newX - this.lastTranslateCoordinates[0];
            const deltaY = newY - this.lastTranslateCoordinates[1];
            geometry.translate(deltaX, deltaY);
          }
          return geometry;
        default:
          return geometry;
      }
    }
    return fromExtent(extent);
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
      // Is it inside feature
      if (
        coordinateInPixels[0] >
          map.getPixelFromCoordinate(this.featureVertices[0])[0] +
            this.pixelTolerance &&
        coordinateInPixels[0] <
          map.getPixelFromCoordinate(this.featureVertices[2])[0] +
            this.pixelTolerance &&
        coordinateInPixels[1] <
          map.getPixelFromCoordinate(this.featureVertices[0])[1] +
            this.pixelTolerance &&
        coordinateInPixels[1] >
          map.getPixelFromCoordinate(this.featureVertices[2])[1] +
            this.pixelTolerance
      ) {
        return {
          distanceToElement: null,
          element: "feature",
          insideTolerance: true,
        };
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
      if (element === "feature") {
        this.lastTranslateCoordinates = e.coordinate;
      }
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
      this.lastTranslateCoordinates = null;
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
      const extent = this.feature.getGeometry().getExtent();
      const newGeometry = this.getNewFeatureGeometryFromDragEvent({
        extent,
        vertex: this.selectedElement,
        coordinate: e.coordinate,
      });
      this.feature.setGeometry(newGeometry);
      this.featureChanged = true;
      if (this.selectedElement === "feature") {
        this.lastTranslateCoordinates = e.coordinate;
      }
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
          case "feature":
            mapTargetViewport.style.cursor = "move";
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

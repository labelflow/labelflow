import { Feature, MapBrowserEvent } from "ol";
import PointerInteraction from "ol/interaction/Pointer";
import { Coordinate, distance } from "ol/coordinate";
import { Extent } from "ol/extent";
import { Polygon } from "ol/geom";
import { fromExtent } from "ol/geom/Polygon";

type FeatureVertices = [Coordinate, Coordinate, Coordinate, Coordinate];
type ClosestElement = {
  distanceToElement: number | null;
  element: string | null;
  insideTolerance: boolean | null;
};

export class ResizeBox extends PointerInteraction {
  feature: Feature<Polygon> | null;

  featureVertices: FeatureVertices | null = null;

  selectedElement: string | null = null;

  pixelTolerance: number = 20;

  vertexEnum = ["bottomLeft", "topLeft", "topRight", "bottomRight"];

  constructor(opt_options) {
    const options = opt_options || {};

    super(options);
    this.pixelTolerance = options?.pixelTolerance ?? this.pixelTolerance;
    this.feature = options?.selectedFeature ?? null;
    if (this.feature != null) {
      const [x, y, destX, destY] = this.feature.getGeometry().getExtent();
      this.featureVertices = this.getFeatureVerticesFromExtent({
        x,
        y,
        destX,
        destY,
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
        case "left":
          return [newX, y, destX, destY];
        case "right":
          return [x, y, newX, destY];
        case "top":
          return [x, y, destX, newY];
        case "bottom":
          return [x, newY, destX, destY];
        default:
          return extent;
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
      // Is it inside feature
      if (
        coordinate[0] > this.featureVertices[0][0] + this.pixelTolerance &&
        coordinate[0] < this.featureVertices[2][0] + this.pixelTolerance &&
        coordinate[1] > this.featureVertices[0][1] + this.pixelTolerance &&
        coordinate[1] > this.featureVertices[0][1] + this.pixelTolerance
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

  handleDownEvent(e: MapBrowserEvent) {
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
    } else {
      this.featureVertices = null;
    }
    return false;
  }

  handleDragEvent(e: MapBrowserEvent) {
    if (this.selectedElement != null && this.feature != null) {
      const extent = this.feature.getGeometry().getExtent();
      const newExtent = this.getNewFeatureExtentFromDragEvent({
        extent,
        vertex: this.selectedElement,
        coordinate: e.coordinate,
      });
      this.feature.setGeometry(fromExtent(newExtent));
      e.preventDefault();
      e.stopPropagation();
    }
  }

  handleMoveEvent(e: MapBrowserEvent) {
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

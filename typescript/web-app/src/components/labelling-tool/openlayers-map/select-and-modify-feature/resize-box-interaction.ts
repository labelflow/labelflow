import { Feature, MapBrowserEvent } from "ol";
import PointerInteraction from "ol/interaction/Pointer";
import { Coordinate, distance } from "ol/coordinate";
import { Extent } from "ol/extent";
import { Polygon } from "ol/geom";
import { fromExtent } from "ol/geom/Polygon";

type FeatureVertices = [Coordinate, Coordinate, Coordinate, Coordinate];

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
        default:
          return extent;
      }
    }
    return extent;
  };

  getClosestVertex = (coordinate: Coordinate) => {
    const map = this.getMap();
    if (this.featureVertices != null && coordinate != null && map != null) {
      const coordinateInPixels = map.getPixelFromCoordinate(coordinate);
      const distanceToVertices = this.featureVertices?.map((vertex) =>
        distance(coordinateInPixels, map.getPixelFromCoordinate(vertex))
      );
      const minimalDistanceIndex = distanceToVertices.indexOf(
        Math.min(...distanceToVertices)
      );
      return {
        distanceToVertex: distanceToVertices[minimalDistanceIndex],
        vertex: this.vertexEnum[minimalDistanceIndex],
        insideTolerance:
          distanceToVertices[minimalDistanceIndex] < this.pixelTolerance,
      };
    }
    return {
      distanceToVertex: null,
      vertex: null,
      insideTolerance: null,
    };
  };

  getClosestLine = (coordinate: Coordinate) => {
    const map = this.getMap();
    if (
      this.featureVertices != null &&
      coordinate != null &&
      map != null &&
      this.feature != null
    ) {
      const closestPoint = this.feature
        .getGeometry()
        .getClosestPoint(coordinate);
      const coordinateInPixels = map.getPixelFromCoordinate(coordinate);
      const distanceToClosestPoint = distance(
        coordinateInPixels,
        map?.getPixelFromCoordinate(closestPoint)
      );
      if (distanceToClosestPoint < this.pixelTolerance) {
        if (closestPoint[0] === this.featureVertices[0][0]) {
          return {
            distanceToLine: distanceToClosestPoint,
            line: "left",
            insideTolerance: true,
          };
        }
        if (closestPoint[0] === this.featureVertices[2][0]) {
          return {
            distanceToLine: distanceToClosestPoint,
            line: "right",
            insideTolerance: true,
          };
        }
        if (closestPoint[1] === this.featureVertices[0][1]) {
          return {
            distanceToLine: distanceToClosestPoint,
            line: "bottom",
            insideTolerance: true,
          };
        }
        if (closestPoint[1] === this.featureVertices[2][1]) {
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

  handleDownEvent(e: MapBrowserEvent) {
    const { insideTolerance, vertex } = this.getClosestVertex(e.coordinate);
    if (insideTolerance) {
      this.selectedElement = vertex;
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
      const { insideTolerance, vertex } = this.getClosestVertex(e.coordinate);
      if (insideTolerance) {
        const cursor =
          vertex === "bottomLeft" || vertex === "topRight"
            ? "nesw-resize"
            : "nwse-resize";
        mapTargetViewport.style.cursor = cursor;
        e.stopPropagation();
        return;
      }

      const { insideTolerance: insideLineTolerance, line } =
        this.getClosestLine(e.coordinate);
      if (insideLineTolerance) {
        const cursor =
          line === "left" || line === "right" ? "ew-resize" : "ns-resize";
        (mapTargetViewport as HTMLElement).style.cursor = cursor;
        e.stopPropagation();
      }
    }
  }

  static stopDown(handled: boolean) {
    return handled;
  }
}

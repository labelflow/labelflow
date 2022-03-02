import computeArea from "@turf/area";
import computeBbox from "@turf/bbox";
import bboxPolygon from "@turf/bbox-polygon";
import {
  multiPolygon,
  MultiPolygon,
  Polygon,
  polygon as singlePolygon,
  Feature,
  Properties,
} from "@turf/helpers";
import intersect from "@turf/intersect";
import { isNil } from "lodash/fp";
import { Geometry, Image, Label } from "../model";

export type LabelBounds = Pick<
  Label,
  "geometry" | "x" | "y" | "width" | "height"
>;

const getPolygon = (type: string, coordinates: number[][][] | number[][][][]) =>
  type === "Polygon"
    ? singlePolygon(coordinates as unknown as number[][][])
    : multiPolygon(coordinates as unknown as number[][][][]);

const verifyShape = (
  polygon: Feature<Polygon, Properties> | Feature<MultiPolygon, Properties>
) => {
  const area = computeArea(polygon);
  if (area !== 0) return;
  throw new Error("A label must have more than two distinct points");
};

export const computeLabelBounds = (
  { type, coordinates }: Geometry,
  { width, height }: Pick<Image, "width" | "height">
): LabelBounds => {
  const polygon = getPolygon(type, coordinates);
  verifyShape(polygon);
  const imagePolygon = bboxPolygon([0, 0, width, height]);
  const cropped = intersect(imagePolygon, polygon.geometry);
  if (isNil(cropped)) {
    throw new Error("Label out of image bounds");
  }
  const [minX, minY, maxX, maxY] = computeBbox(cropped);
  return {
    geometry: cropped.geometry,
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
};

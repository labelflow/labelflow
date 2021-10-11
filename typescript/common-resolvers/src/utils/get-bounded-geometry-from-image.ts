import bboxPolygon from "@turf/bbox-polygon";
import { multiPolygon } from "@turf/helpers";
import intersect from "@turf/intersect";
import bbox from "@turf/bbox";
import { GeometryInput } from "@labelflow/graphql-types";

export const getBoundedGeometryFromImage = (
  imageDimensions: { width: number; height: number },
  geometry: GeometryInput
) => {
  const geometryPolygon = multiPolygon(geometry.coordinates);
  const imagePolygon = bboxPolygon([
    0,
    0,
    imageDimensions.width,
    imageDimensions.height,
  ]);
  // const clippedGeometryObject = geometryPolygon; // TODO: put back the line below and fix iog inferences
  const clippedGeometryObject = intersect(
    imagePolygon,
    geometryPolygon.geometry
  )?.geometry;

  if (clippedGeometryObject == null) {
    throw new Error("Label out of image bounds");
  }
  const [minX, minY, maxX, maxY] = bbox(clippedGeometryObject);
  const width = maxX - minX;
  const height = maxY - minY;

  return {
    geometry: clippedGeometryObject,
    x: minX,
    y: minY,
    width,
    height,
  };
};

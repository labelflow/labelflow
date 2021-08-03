import bboxPolygon from "@turf/bbox-polygon";
import { polygon } from "@turf/helpers";
import intersect from "@turf/intersect";
import bbox from "@turf/bbox";
import { GeometryInput } from "@labelflow/graphql-types";

export const getBoundedGeometryFromImage = (
  imageDimensions: { width: number; height: number },
  geometry: GeometryInput
) => {
  const geometryPolygon = polygon(geometry.coordinates);
  const imagePolygon = bboxPolygon([
    0,
    0,
    imageDimensions.width,
    imageDimensions.height,
  ]);
  const clippedGeometryObject = intersect(imagePolygon, geometryPolygon);

  if (clippedGeometryObject?.geometry == null) {
    throw new Error("Label out of image bounds");
  }

  const [minX, minY, maxX, maxY] = bbox(clippedGeometryObject.geometry);
  const width = maxX - minX;
  const height = maxY - minY;

  return {
    geometry: clippedGeometryObject.geometry,
    x: minX,
    y: minY,
    width,
    height,
  };
};

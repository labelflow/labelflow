import bboxPolygon from "@turf/bbox-polygon";
import { MultiPolygon, Polygon, polygon } from "@turf/helpers";
import intersect from "@turf/intersect";
import unkinkPolygon from "@turf/unkink-polygon";
import bbox from "@turf/bbox";
import union from "@turf/union";
import flatten from "@turf/flatten";
import buffer from "@turf/buffer";
// import geojsonValidation from "geojson-validation";
import { GeometryInput } from "@labelflow/graphql-types";

const transformMultiPolygonToPolygon = (
  multiPolygon: MultiPolygon
): Polygon => ({
  type: "Polygon",
  coordinates: multiPolygon.coordinates.reduce(
    (polygonAggregatedCoordinates, polygonCoordinates) => [
      ...polygonAggregatedCoordinates,
      ...polygonCoordinates,
    ],
    []
  ),
});

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
  // const bufferedGeometry = buffer(geometryPolygon, 1, { units: "degrees" });
  // console.log(`
  // geometryPolygon.geometry = ${JSON.stringify(
  //   geometryPolygon.geometry,
  //   null,
  //   1
  // )}
  // bufferedGeometry.geometry = ${JSON.stringify(
  //   bufferedGeometry.geometry,
  //   null,
  //   1
  // )}
  // `);
  const clippedGeometryObject = intersect(imagePolygon, geometryPolygon);
  // const clippedGeometryObject = unkinkPolygon(
  //   intersect(imagePolygon, geometryPolygon)
  // ).features.reduce((polygonA, polygonB) => union(polygonA, polygonB) as any);
  // if (!geojsonValidation.isMultiPolygon(clippedGeometryObject)) {
  //   console.warn(
  //     "Couldn't intersect polygon with image canvas on first try, will try to validate the polygon."
  //   );
  //   clippedGeometryObject = unkinkPolygon(clippedGeometryObject);
  //   // Try to buffer the polygon with 1px
  //   // intersect(
  //   //   imagePolygon,
  //   //   buffer(geometryPolygon, 1, { units: "degrees" })
  //   // );
  // }

  if (clippedGeometryObject?.geometry == null) {
    throw new Error("Label out of image bounds");
  }

  const clippedPolygon = unkinkPolygon(clippedGeometryObject).features.reduce(
    (aggregatedPolygon, polygonCurrent) => ({
      ...aggregatedPolygon,
      coordinates: [
        ...aggregatedPolygon.coordinates,
        ...polygonCurrent.geometry.coordinates,
      ],
    }),
    { type: "Polygon", coordinates: [] }
  );

  // const clippedPolygon =
  //   clippedGeometryObject.geometry.type === "Polygon"
  //     ? clippedGeometryObject.geometry
  // : transformMultiPolygonToPolygon(clippedGeometryObject.geometry);
  const [minX, minY, maxX, maxY] = bbox(clippedPolygon);
  const width = maxX - minX;
  const height = maxY - minY;

  return {
    geometry: clippedPolygon,
    // geometry: geometryPolygon.geometry,
    x: minX,
    y: minY,
    width,
    height,
  };
};

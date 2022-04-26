import React from "react";
import GeoJSON from "ol/format/GeoJSON";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

import { Map } from "../map";

const image = new CircleStyle({
  radius: 5,
  // fill: null,
  stroke: new Stroke({ color: "red", width: 1 }),
});

const styles = {
  Point: new Style({
    image,
  }),
  LineString: new Style({
    stroke: new Stroke({
      color: "green",
      width: 1,
    }),
  }),
  MultiLineString: new Style({
    stroke: new Stroke({
      color: "green",
      width: 1,
    }),
  }),
  MultiPoint: new Style({
    image,
  }),
  MultiPolygon: new Style({
    stroke: new Stroke({
      color: "yellow",
      width: 1,
    }),
    fill: new Fill({
      color: "rgba(255, 255, 0, 0.1)",
    }),
  }),
  Polygon: new Style({
    stroke: new Stroke({
      color: "blue",
      lineDash: [4],
      width: 3,
    }),
    fill: new Fill({
      color: "rgba(0, 0, 255, 0.1)",
    }),
  }),
  GeometryCollection: new Style({
    stroke: new Stroke({
      color: "magenta",
      width: 2,
    }),
    fill: new Fill({
      color: "magenta",
    }),
    image: new CircleStyle({
      radius: 10,
      // fill: null,
      stroke: new Stroke({
        color: "magenta",
      }),
    }),
  }),
  Circle: new Style({
    stroke: new Stroke({
      color: "red",
      width: 2,
    }),
    fill: new Fill({
      color: "rgba(255,0,0,0.2)",
    }),
  }),
};

const styleFunction = (feature: any) => {
  return styles[feature.getGeometry().getType() as keyof typeof styles];
};

const geojsonObject = {
  type: "FeatureCollection",
  crs: {
    type: "name",
    properties: {
      name: "EPSG:3857",
    },
  },
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [0, 0],
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [4e6, -2e6],
          [8e6, 2e6],
        ],
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [4e6, 2e6],
          [8e6, -2e6],
        ],
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-5e6, -1e6],
            [-4e6, 1e6],
            [-3e6, -1e6],
          ],
        ],
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "MultiLineString",
        coordinates: [
          [
            [-1e6, -7.5e5],
            [-1e6, 7.5e5],
          ],
          [
            [1e6, -7.5e5],
            [1e6, 7.5e5],
          ],
          [
            [-7.5e5, -1e6],
            [7.5e5, -1e6],
          ],
          [
            [-7.5e5, 1e6],
            [7.5e5, 1e6],
          ],
        ],
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [-5e6, 6e6],
              [-5e6, 8e6],
              [-3e6, 8e6],
              [-3e6, 6e6],
            ],
          ],
          [
            [
              [-2e6, 6e6],
              [-2e6, 8e6],
              [0, 8e6],
              [0, 6e6],
            ],
          ],
          [
            [
              [1e6, 6e6],
              [1e6, 8e6],
              [3e6, 8e6],
              [3e6, 6e6],
            ],
          ],
        ],
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "GeometryCollection",
        geometries: [
          {
            type: "LineString",
            coordinates: [
              [-5e6, -5e6],
              [0, -5e6],
            ],
          },
          {
            type: "Point",
            coordinates: [4e6, -5e6],
          },
          {
            type: "Polygon",
            coordinates: [
              [
                [1e6, -6e6],
                [2e6, -4e6],
                [3e6, -6e6],
              ],
            ],
          },
        ],
      },
    },
  ],
};

export const GeoJSONStory = () => {
  return (
    <Map>
      <olView initialCenter={[0, 0]} initialZoom={2} />
      <olLayerTile>
        <olSourceOSM />
      </olLayerTile>
      <olLayerVector style={styleFunction}>
        <olSourceVector features={new GeoJSON().readFeatures(geojsonObject)}>
          <olFeature>
            <olGeomCircle center={[5e6, 7e6]} radius={1e6} />
          </olFeature>
        </olSourceVector>
      </olLayerVector>
    </Map>
  );
};

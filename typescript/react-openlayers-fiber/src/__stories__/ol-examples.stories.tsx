import { Map } from "../map";

import "ol/ol.css";

export * from "./accessible";
export * from "./bing";
export * from "./cluster";
export * from "./draw-and-modify-features";
export * from "./draw-shapes";
export * from "./dynamic-data";
export * from "./geojson";
export * from "./icon";
export * from "./image-filter";
export * from "./mapbox-vector-tiles";
export * from "./popup";
export * from "./reprojection-image";
export * from "./reprojection-wgs84";
export * from "./select-features";
export * from "./static-image";
export * from "./turf";
export * from "./vector-tiles";
export * from "./wms-tiled";
export * from "./xyz-retina";
export * from "./xyz";
export * from "./zoomify";

export default {
  title: "react-openlayers-fiber/OL Examples",
  component: Map,
  parameters: { chromatic: { disableSnapshot: true } },
};

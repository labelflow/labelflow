import { Map } from "../map";

import "ol/ol.css";

export * from "./basic";
export * from "./dynamic-style";
export * from "./dynamic";
export * from "./kitchen-sink";
export * from "./performance";
export * from "./retina";

export default {
  title: "react-openlayers-fiber/Other Examples",
  component: Map,
  parameters: { chromatic: { disableSnapshot: true } },
};

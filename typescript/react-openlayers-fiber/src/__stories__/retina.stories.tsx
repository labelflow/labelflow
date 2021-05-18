import React from "react";

import { Map } from "../map";

import "ol/ol.css";

export default {
  title: "Components/Retina",
  component: Map
};

export const Retina = () => (
  <Map>
    <olView initialCenter={[0, 0]} initialZoom={2} />
    <olLayerTile preload={Infinity}>
      <olSourceXYZ
        url="https://tile.osmand.net/hd/{z}/{x}/{y}.png"
        crossOrigin={null}
        maxZoom={19}
        tilePixelRatio={2}
      />
    </olLayerTile>
  </Map>
);

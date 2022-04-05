import React from "react";
import { transform } from "ol/proj";

import { Map } from "../map";

const attributions = `<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>`;

export const XYZRetina = () => {
  return (
    <Map>
      <olView
        initialProjection="EPSG:3857"
        initialCenter={transform(
          [-112.18688965, 36.057944835],
          "EPSG:4326",
          "EPSG:3857"
        )}
        initialZoom={12}
      />
      <olLayerTile>
        <olSourceXYZ
          tilePixelRatio={2}
          attributions={attributions}
          url="https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </olLayerTile>
    </Map>
  );
};

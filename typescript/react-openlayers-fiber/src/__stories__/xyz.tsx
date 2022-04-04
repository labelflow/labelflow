import React from "react";

import { Map } from "../map";

export const XYZ = () => {
  return (
    <Map>
      <olView initialCenter={[-472202, 7530279]} initialZoom={12} />
      <olLayerTile>
        <olSourceXYZ url="https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </olLayerTile>
    </Map>
  );
};

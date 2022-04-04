import React from "react";

import { Map } from "../map";

export const ReprojectionWGS84 = () => {
  return (
    <Map>
      <olView
        initialCenter={[0, 0]}
        initialZoom={2}
        initialProjection="EPSG:4326"
      />
      <olLayerTile>
        <olSourceOSM />
      </olLayerTile>
    </Map>
  );
};

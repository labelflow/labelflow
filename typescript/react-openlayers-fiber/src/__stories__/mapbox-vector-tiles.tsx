import React from "react";
import MVT from "ol/format/MVT";
import { Fill, Icon, Stroke, Style, Text } from "ol/style";
import { StyleLike } from "ol/style/Style";

import { Map } from "../map";
import { useLoadExternalLib } from "./hooks";

declare global {
  function createMapboxStreetsV6Style(...args: unknown[]): StyleLike;
}

const key =
  "pk.eyJ1IjoieXZvbm5pY2tzdGVyYmx1ZSIsImEiOiJja2huN2hmMG0yOGI5MnhvOTZ0cnB6ZjdsIn0.34GurIy5Nwnd-ErxGyO0LA";

export const MapboxVectorTiles = () => {
  const isLibLoaded = useLoadExternalLib(
    "https://openlayers.org/en/v6.4.3/examples/resources/mapbox-streets-v6-style.js"
  );
  return (
    <Map>
      <olView initialCenter={[0, 0]} initialZoom={2} />
      {isLibLoaded ? (
        <olLayerVectorTile
          declutter
          style={createMapboxStreetsV6Style(Style, Fill, Stroke, Icon, Text)}
        >
          <olSourceVectorTile
            format={new MVT()}
            url={`https://{a-d}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/{z}/{x}/{y}.vector.pbf?access_token=${key}`}
          />
        </olLayerVectorTile>
      ) : null}
    </Map>
  );
};

import React, { useState, useEffect } from "react";
import { Map as OlMap } from "ol";
import VectorTileSource from "ol/source/VectorTile";
import MVT from "ol/format/MVT";
import olms from "ol-mapbox-style";
import { defaultResolutions } from "ol-mapbox-style/dist/util";

import { Map } from "../map";

// Match the server resolutions
const maxResolution = 360 / 512;
defaultResolutions.length = 14;
for (let i = 0; i < 14; i += 1) {
  defaultResolutions[i] = maxResolution / 2 ** (i + 1);
}

export const VectorTiles = () => {
  const [mapboxStyle, setMapboxStyle] =
    useState<{ zoom: number; center: [number, number] }>();
  const [map, setMap] = useState<OlMap | null>(null);

  useEffect(() => {
    if (!map) return;
    olms(
      map,
      "https://sterblue-basemap-vectortiles.s3-eu-west-1.amazonaws.com/global-osm/basemap.json"
    )
      .then((theMap: any) => {
        const newMapboxStyle = theMap.get("mapbox-style");
        setMapboxStyle(newMapboxStyle);

        theMap.getLayers().forEach((layer: any) => {
          const mapboxSource = layer.get("mapbox-source");
          if (
            mapboxSource &&
            newMapboxStyle.sources[mapboxSource].type === "vector"
          ) {
            const source = layer.getSource();
            layer.setSource(
              new VectorTileSource({
                format: new MVT(),
                urls: source.getUrls(),
              })
            );
          }
        });
      })
      .catch((e: any) => {
        console.error(e.message);
      });
  }, [map]);

  return (
    <Map ref={setMap}>
      {mapboxStyle && (
        <olView
          initialZoom={mapboxStyle && mapboxStyle?.zoom}
          initialCenter={mapboxStyle.center}
        />
      )}
    </Map>
  );
};

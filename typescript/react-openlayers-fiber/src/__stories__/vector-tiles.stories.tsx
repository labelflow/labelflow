import React, { useState, useEffect } from "react";
import { Map as olMap } from "ol";
import VectorTileSource from "ol/source/VectorTile";
import MVT from "ol/format/MVT";
import olms from "ol-mapbox-style";
import { defaultResolutions } from "ol-mapbox-style/dist/util";

import { Map } from "../map";
import { useResource } from "../hooks";

import "ol/ol.css";

export default {
  title: "OL Examples/Vector Tiles",
  component: Map,
};

// Match the server resolutions
const maxResolution = 360 / 512;
defaultResolutions.length = 14;
for (let i = 0; i < 14; i += 1) {
  defaultResolutions[i] = maxResolution / 2 ** (i + 1);
}

export const VectorTiles = () => {
  const [mapboxStyle, setMapboxStyle] = useState(null);
  const mapRef = useResource<olMap>();

  useEffect(() => {
    if (!mapRef.current) return;
    olms(
      mapRef.current,
      "https://sterblue-basemap-vectortiles.s3-eu-west-1.amazonaws.com/global-osm/basemap.json"
    )
      .then(function (map) {
        const mapboxStyle = map.get("mapbox-style");
        setMapboxStyle(mapboxStyle);

        map.getLayers().forEach(function (layer) {
          const mapboxSource = layer.get("mapbox-source");
          if (
            mapboxSource &&
            mapboxStyle.sources[mapboxSource].type === "vector"
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
        return;
      })
      .catch((e) => {
        console.error(e.message);
      });
  }, [mapRef.current]);

  return (
    <Map ref={mapRef}>
      {mapboxStyle ? (
        <olView
          initialZoom={mapboxStyle.zoom}
          initialCenter={mapboxStyle.center}
        />
      ) : null}
    </Map>
  );
};

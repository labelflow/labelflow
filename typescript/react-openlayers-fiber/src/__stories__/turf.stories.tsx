import React, { useEffect, useState } from "react";

import { Vector } from "ol/source";
import { fromLonLat } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import { Geometry } from "ol/geom";
import { Feature, LineString, lineDistance, along } from "@turf/turf";

import { Map } from "../map";

export const Turf = () => {
  const [vectorSource, setVectorSource] = useState<Vector<Geometry>>();

  useEffect(() => {
    if (!vectorSource) return;

    fetch(
      "https://openlayers.org/en/latest/examples/data/geojson/roads-seoul.geojson"
    )
      .then((res) => res.json())
      .then((json) => {
        const format = new GeoJSON();
        const features = format.readFeatures(json);
        const street = features[0];

        // convert to a turf.js feature
        const turfLine = format.writeFeatureObject(street);

        // show a marker every 200 meters
        const distance = 0.2;

        // get the line length in kilometers
        const length = lineDistance(turfLine, { units: "kilometers" });
        for (let i = 1; i <= length / distance; i += 1) {
          const turfPoint = along(
            turfLine as Feature<LineString>,
            i * distance,
            { units: "kilometers" }
          );

          // convert the generated point to a OpenLayers feature
          const marker = format.readFeature(turfPoint);
          marker.getGeometry().transform("EPSG:4326", "EPSG:3857");
          vectorSource.addFeature(marker);
        }

        street.getGeometry().transform("EPSG:4326", "EPSG:3857");
        vectorSource.addFeature(street);
      })
      .catch((e) => {
        throw e;
      });
  }, [vectorSource]);

  return (
    <Map>
      <olView
        initialCenter={fromLonLat([126.980366, 37.52654])}
        initialZoom={15}
      />
      <olLayerTile>
        <olSourceOSM />
      </olLayerTile>
      <olLayerVector>
        <olSourceVector ref={setVectorSource} />
      </olLayerVector>
    </Map>
  );
};

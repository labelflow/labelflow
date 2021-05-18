import React, { useEffect } from "react";
import * as turf from "@turf/turf";
import { Vector } from "ol/source";
import { fromLonLat } from "ol/proj";
import GeoJSON, { GeoJSONFeature } from "ol/format/GeoJSON";

import { Map } from "../map";
import { useResource } from "../hooks";

import "ol/ol.css";

export default {
  title: "OL Examples/Turf",
  component: Map,
};

export const Turf = () => {
  const sourceVectorRef = useResource<Vector>();

  useEffect(() => {
    if (!sourceVectorRef.current) return;
    fetch(
      "https://openlayers.org/en/latest/examples/data/geojson/roads-seoul.geojson"
    )
      .then((res) => res.json())
      .then((json) => {
        console.log("TURF", turf);
        const format = new GeoJSON();
        const features = format.readFeatures(json);
        const street = features[0];

        // convert to a turf.js feature
        const turfLine = format.writeFeatureObject(street);

        // show a marker every 200 meters
        const distance = 0.2;

        // get the line length in kilometers
        const length = turf.lineDistance(turfLine, "kilometers");
        for (let i = 1; i <= length / distance; i++) {
          const turfPoint = turf.along(turfLine, i * distance, "kilometers");

          // convert the generated point to a OpenLayers feature
          const marker = format.readFeature(turfPoint);
          marker.getGeometry().transform("EPSG:4326", "EPSG:3857");
          sourceVectorRef.current.addFeature(marker);
        }

        street.getGeometry().transform("EPSG:4326", "EPSG:3857");
        sourceVectorRef.current.addFeature(street);

        return;
      })
      .catch((e) => {
        throw e;
      });
  }, [sourceVectorRef.current]);

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
        <olSourceVector ref={sourceVectorRef} />
      </olLayerVector>
    </Map>
  );
};

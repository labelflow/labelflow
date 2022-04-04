import React, { useState } from "react";
import { range } from "lodash/fp";
import { Style, Circle as CircleStyle, Fill, Stroke, Text } from "ol/style";

import { Map } from "../map";

const x = 4500000;
const coordinates = range(0, 2000).map(() => {
  return [2 * x * Math.random() - x, 2 * x * Math.random() - x];
});
const styleCache: any[] = [];

export const Cluster = () => {
  const [distance, setDistance] = useState(40);
  return (
    <div>
      <form>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="distance">cluster distance</label>
        <input
          id="distance"
          type="range"
          min="0"
          max="100"
          step="1"
          value={distance}
          onChange={(e) => setDistance(parseInt(e.target.value, 10))}
        />
      </form>
      <Map>
        <olView initialCenter={[0, 0]} initialZoom={2} />
        <olLayerTile>
          <olSourceOSM />
        </olLayerTile>
        <olLayerVector
          style={(feature) => {
            const size: number = feature.get("features").length;
            let style: any = styleCache[size];
            if (!style) {
              style = new Style({
                image: new CircleStyle({
                  radius: 10,
                  stroke: new Stroke({
                    color: "#fff",
                  }),
                  fill: new Fill({
                    color: "#3399CC",
                  }),
                }),
                text: new Text({
                  text: size.toString(),
                  fill: new Fill({
                    color: "#fff",
                  }),
                }),
              });
              styleCache[size] = style;
            }
            return style;
          }}
        >
          <olSourceCluster distance={distance}>
            <olSourceVector>
              {coordinates.map((coordinate) => (
                <olFeature key={coordinate.join()}>
                  <olGeomPoint args={[coordinate]} />
                </olFeature>
              ))}
            </olSourceVector>
          </olSourceCluster>
        </olLayerVector>
      </Map>
    </div>
  );
};

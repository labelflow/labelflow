import React, { useState } from "react";
import { Fill, RegularShape, Stroke, Style } from "ol/style";

import { Map } from "../map";
import { useInterval } from "./hooks";

const stroke = new Stroke({ color: "black", width: 2 });
const fill = new Fill({ color: "red" });

const pointStyle = new Style({
  image: new RegularShape({
    fill,
    stroke,
    points: 4,
    radius: 10,
    angle: Math.PI / 4,
  }),
});

export const Dynamic = () => {
  const [location, setLocation] = useState<[number, number]>([0, 6000000]);

  useInterval(() => {
    setLocation([100000 * Math.random(), 6000000 + 100000 * Math.random()]);
  }, 1000 / 30);

  return (
    <Map>
      <olView initialCenter={[0, 6000000]} initialZoom={6} />
      <olLayerTile>
        <olSourceOSM />
      </olLayerTile>
      <olLayerVector>
        <olSourceVector>
          <olFeature style={pointStyle}>
            <olGeomPoint coordinates={location} />
          </olFeature>
        </olSourceVector>
      </olLayerVector>
    </Map>
  );
};

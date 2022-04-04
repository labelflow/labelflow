import React, { useState } from "react";
import { Fill, Stroke } from "ol/style";

import { Map } from "../map";
import { useInterval } from "./hooks";

const stroke = new Stroke({ color: "black", width: 2 });
const fill = new Fill({ color: "red" });

export const DynamicStyle = () => {
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
          <olFeature>
            <olStyleStyle attach="style">
              <olStyleRegularShape
                attach="image"
                args={{
                  fill,
                  stroke,
                  radius: Math.random() * 20,
                  points: 4,
                  angle: Math.PI / 4,
                }}
              />
            </olStyleStyle>
            <olGeomPoint coordinates={location} />
          </olFeature>
        </olSourceVector>
      </olLayerVector>
    </Map>
  );
};

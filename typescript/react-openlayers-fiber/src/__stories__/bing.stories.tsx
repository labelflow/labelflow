import React, { useState } from "react";

import { Map } from "../map";

const styles = [
  "RoadOnDemand",
  "Aerial",
  "AerialWithLabelsOnDemand",
  "CanvasDark",
  "OrdnanceSurvey",
];

export const Bing = () => {
  const [currentStyle, setCurrentStyle] = useState(styles[0]);

  return (
    <>
      {/* This example does not work with onBlur */}
      {/* eslint-disable-next-line jsx-a11y/no-onchange */}
      <select
        value={currentStyle}
        onChange={(e) => setCurrentStyle(e.target.value)}
      >
        {styles.map((style) => (
          <option key={style} value={style}>
            {style}
          </option>
        ))}
      </select>
      <Map>
        <olView
          initialCenter={[-6655.5402445057125, 6709968.258934638]}
          initialZoom={13}
        />
        {styles.map((style) => (
          <olLayerTile
            key={style}
            visible={style === currentStyle}
            preload={Infinity}
          >
            <olSourceBingMaps
              _key="Akdsy2SFch0llm3vlRegzoCtdZEmgD--98xBIXj83gtJyicWSd9vIeH1Qibj_V3U"
              imagerySet={style}
            />
          </olLayerTile>
        ))}
      </Map>
    </>
  );
};

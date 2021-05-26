import React, { ReactPortal, useState } from "react";
import { Fill, RegularShape, Stroke, Style } from "ol/style";
import { Interaction } from "ol/interaction";
import { debounce } from "lodash/fp";

import "ol/ol.css";
import GeometryType from "ol/geom/GeometryType";
import { Geometry } from "ol/geom";
import VectorSource from "ol/source/Vector";

import { useResource, useUpdate } from "../hooks";
import { Map } from "../map";

export default {
  title: "Components/KitchenSink",
  component: Map,
};

const bingstyles = [
  "Road",
  "RoadOnDemand",
  "Aerial",
  "AerialWithLabelsOnDemand",
  "CanvasDark",
  "OrdnanceSurvey",
];

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

const polygonStyle = new Style({
  stroke: new Stroke({
    color: "red",
    width: 3,
  }),
  fill: new Fill({
    color: "rgba(0, 0, 255, 0.1)",
  }),
});

export const KitchenSink = () => {
  const [currentStyle, setCurrentStyle] = useState(bingstyles[0]);
  const [center, setCenter] = useState([0, 0]);
  const vectorSourceRef = useResource<ReactPortal>();
  const drawRef = useUpdate(
    (drawInteraction: Interaction) => {
      // There are better ways to do this! This is just to demonstrate
      // the use of useUpdate
      if (currentStyle === bingstyles[0]) {
        drawInteraction.setActive(false);
      } else {
        drawInteraction.setActive(true);
      }
    },
    [currentStyle]
  );

  return (
    <>
      {/* This example does not work with onBlur */}
      {/* eslint-disable-next-line jsx-a11y/no-onchange */}
      <select
        value={currentStyle}
        onChange={(e) => setCurrentStyle(e.target.value)}
      >
        {bingstyles.map((style, index) => (
          <option key={index} value={style}>
            {style}
          </option>
        ))}
      </select>
      <span>Center: {center.join(", ")}</span>
      <Map>
        <olView
          onChange_center={debounce(100, (e) => {
            setCenter(e.target.getCenter());
            return true;
          })}
          initialCenter={[-6655.5402445057125, 6709968.258934638]}
          initialZoom={13}
        />
        <olControlRotate />
        <olControlFullScreen />
        <olControlScaleLine />
        <olInteractionDragRotateAndZoom />

        {bingstyles.map((style, index) => (
          <olLayerTile
            key={index}
            visible={style === currentStyle}
            preload={Infinity}
          >
            <olSourceBingMaps
              _key="Akdsy2SFch0llm3vlRegzoCtdZEmgD--98xBIXj83gtJyicWSd9vIeH1Qibj_V3U"
              imagerySet={style}
            />
          </olLayerTile>
        ))}

        <olLayerVector>
          <olSourceVector features={[]} ref={vectorSourceRef}>
            <olFeature style={pointStyle}>
              <olGeomPoint args={[[0, 0]]} />
            </olFeature>
            <olFeature style={polygonStyle}>
              <olGeomPolygon
                args={[
                  [
                    [
                      [0, 0],
                      [1000000, 0],
                      [0, 1000000],
                      [0, 0],
                    ],
                  ],
                ]}
              />
            </olFeature>
          </olSourceVector>
        </olLayerVector>
        {vectorSourceRef?.current ? (
          <olInteractionDraw
            type={"Polygon" as GeometryType}
            source={
              vectorSourceRef.current as unknown as VectorSource<Geometry>
            }
            ref={drawRef}
          />
        ) : null}
      </Map>
    </>
  );
};

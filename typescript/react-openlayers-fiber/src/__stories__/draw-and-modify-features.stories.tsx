import React, { useState } from "react";
import { Stroke, Fill } from "ol/style";
import VectorSource from "ol/source/Vector";
import GeometryType from "ol/geom/GeometryType";

import { Map } from "../map";
import { useResource } from "../hooks";

import "ol/ol.css";

export default {
  title: "react-openlayers-fiber/OL Examples",
  component: Map,
};

const fill = new Fill({
  color: "rgba(255, 255, 255, 0.2)",
});
const stroke = new Stroke({
  color: "#ffcc33",
  width: 2,
});
const circleFill = new Fill({
  color: "#ffcc33",
});

export const DrawAndModifyFeatures = () => {
  const [geometryType, setGeometryType] = useState<GeometryType>(
    "Point" as GeometryType
  );
  const vectorSourceRef = useResource<VectorSource>();

  return (
    <>
      <form>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="type">Geometry type &nbsp;</label>
        {/* This example does not work with onBlur */}
        {/* eslint-disable-next-line jsx-a11y/no-onchange */}
        <select
          id="type"
          value={geometryType}
          onChange={(e): void =>
            setGeometryType(e.target.value as GeometryType)
          }
        >
          <option value="Point">Point</option>
          <option value="LineString">LineString</option>
          <option value="Polygon">Polygon</option>
          <option value="Circle">Circle</option>
        </select>
      </form>
      <Map>
        <olView initialCenter={[-11000000, 4600000]} initialZoom={4} />
        <olLayerTile>
          <olSourceOSM />
        </olLayerTile>
        <olLayerVector>
          <olSourceVector ref={vectorSourceRef} />
          <olStyleStyle attach="style" fill={fill} stroke={stroke}>
            <olStyleCircle
              attach="image"
              args={{ radius: 7, fill: circleFill }}
            />
          </olStyleStyle>
        </olLayerVector>
        {vectorSourceRef?.current ? (
          <>
            <olInteractionModify source={vectorSourceRef.current} />
            <olInteractionDraw
              args={{
                type: geometryType,
                source: vectorSourceRef.current,
                snapTolerance: 30,
              }}
            />
            <olInteractionSnap
              source={vectorSourceRef.current}
              args={{ pixelTolerance: 30 }}
            />
          </>
        ) : null}
      </Map>
    </>
  );
};

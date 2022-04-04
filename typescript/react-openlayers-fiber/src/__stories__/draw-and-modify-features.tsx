import React, { useState } from "react";
import { Stroke, Fill } from "ol/style";
import VectorSource from "ol/source/Vector";
import GeometryType from "ol/geom/GeometryType";
import { Geometry } from "ol/geom";
import { Map } from "../map";

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
  const [geometryType, setGeometryType] = useState<string>(GeometryType.POINT);
  const [vectorSource, setVectorSource] = useState<VectorSource<Geometry>>();

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
          onChange={(e): void => setGeometryType(e.target.value as string)}
        >
          <option value={GeometryType.POINT}>Point</option>
          <option value={GeometryType.LINE_STRING}>LineString</option>
          <option value={GeometryType.POLYGON}>Polygon</option>
          <option value={GeometryType.CIRCLE}>Circle</option>
        </select>
      </form>
      <Map>
        <olView initialCenter={[-11000000, 4600000]} initialZoom={4} />
        <olLayerTile>
          <olSourceOSM />
        </olLayerTile>
        <olLayerVector>
          <olSourceVector ref={setVectorSource} />
          <olStyleStyle attach="style" fill={fill} stroke={stroke}>
            <olStyleCircle
              attach="image"
              args={{ radius: 7, fill: circleFill }}
            />
          </olStyleStyle>
        </olLayerVector>
        {vectorSource ? (
          <>
            <olInteractionModify source={vectorSource} />
            <olInteractionDraw
              args={{
                type: geometryType,
                source: vectorSource,
                snapTolerance: 30,
              }}
            />
            <olInteractionSnap
              source={vectorSource}
              args={{ pixelTolerance: 30 }}
            />
          </>
        ) : null}
      </Map>
    </>
  );
};

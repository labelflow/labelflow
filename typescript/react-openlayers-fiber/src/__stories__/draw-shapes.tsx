/* eslint-disable consistent-return */
import React, { useState } from "react";
import {
  createBox,
  createRegularPolygon,
  GeometryFunction,
} from "ol/interaction/Draw";
import OlSourceVector from "ol/source/Vector";
import Polygon from "ol/geom/Polygon";
import GeometryType from "ol/geom/GeometryType";
import { Geometry } from "ol/geom";
import { Map } from "../map";

type ShapeType = "None" | "Circle" | "Square" | "Box" | "Star";
function useGeometryFunction(
  shapeType: ShapeType
): GeometryFunction | undefined {
  if (["None", "Circle"].includes(shapeType)) return;
  if (shapeType === "Square") {
    return createRegularPolygon(4);
  }
  if (shapeType === "Box") {
    return createBox();
  }
  if (shapeType === "Star") {
    return (coordinates, geometry) => {
      const center = coordinates[0] as [number, number];
      const last = coordinates[1] as [number, number];
      const dx = center[0] - last[0];
      const dy = center[1] - last[1];
      const radius = Math.sqrt(dx * dx + dy * dy);
      const rotation = Math.atan2(dy, dx);
      const newCoordinates = [];
      const numPoints = 12;
      for (let i = 0; i < numPoints; i += 1) {
        const angle = rotation + (i * 2 * Math.PI) / numPoints;
        const fraction = i % 2 === 0 ? 1 : 0.5;
        const offsetX = radius * fraction * Math.cos(angle);
        const offsetY = radius * fraction * Math.sin(angle);
        newCoordinates.push([center[0] + offsetX, center[1] + offsetY]);
      }
      newCoordinates.push(newCoordinates[0].slice());
      if (!geometry) {
        // eslint-disable-next-line no-param-reassign
        geometry = new Polygon([newCoordinates]);
      } else {
        geometry.setCoordinates([newCoordinates]);
      }
      return geometry;
    };
  }
}

export const DrawShapes = () => {
  const [shapeType, setShapeType] = useState<ShapeType>("Circle");
  const geometryFunction = useGeometryFunction(shapeType);
  const [vectorSource, setVectorSource] = useState<OlSourceVector<Geometry>>();

  return (
    <>
      <form>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="type">Geometry type &nbsp;</label>
        {/* This example does not work with onBlur */}
        {/* eslint-disable-next-line jsx-a11y/no-onchange */}
        <select
          id="type"
          value={shapeType}
          onChange={(e): void => setShapeType(e.target.value as ShapeType)}
        >
          <option value="Circle">Circle</option>
          <option value="Square">Square</option>
          <option value="Box">Box</option>
          <option value="Star">Star</option>
          <option value="None">None</option>
        </select>
      </form>
      <Map>
        <olView initialCenter={[-11000000, 4600000]} initialZoom={4} />
        <olLayerTile>
          <olSourceOSM />
        </olLayerTile>
        <olLayerVector>
          <olSourceVector ref={setVectorSource} />
        </olLayerVector>
        {vectorSource && shapeType !== "None" ? (
          <olInteractionDraw
            args={{
              source: vectorSource,
              type: GeometryType.CIRCLE,
              geometryFunction,
            }}
          />
        ) : null}
      </Map>
    </>
  );
};

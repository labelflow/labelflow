import React, { useRef } from "react";
import { Fill, Stroke, RegularShape, Style } from "ol/style";
import { Map as OlMap } from "ol";
import { range } from "lodash/fp";
import { getVectorContext } from "ol/render";
import { Point } from "ol/geom";
import RenderEvent from "ol/render/Event";
import { Map } from "../map";

const stroke = new Stroke({ color: "black", width: 2 });
const fill = new Fill({ color: "red" });
const point = new Point([0, 0]);
const styles: Style[] = [];

export const Performance = () => {
  const mapRef = useRef<OlMap>(null);

  const onPostrender = (event: RenderEvent): boolean => {
    const vectorContext = getVectorContext(event);
    range(0, 1000).forEach(() => {
      const coordinates = [
        1000000 * Math.random(), // + i * 10000,
        6000000 + 1000000 * Math.random(), // + i * 10000
      ];

      const radius = Math.floor(Math.random() * 20);
      if (!styles[radius]) {
        styles[radius] = new Style({
          image: new RegularShape({
            fill,
            stroke,
            radius,
            points: 4,
            angle: Math.PI / 4,
          }),
        });
      }
      const style = styles[radius];

      point.setCoordinates(coordinates);
      vectorContext.setStyle(style);
      vectorContext.drawGeometry(point);
    });

    mapRef.current?.render();
    return true;
  };

  return (
    <Map ref={mapRef}>
      <olView initialCenter={[0, 6000000]} initialZoom={2} />
      <olLayerTile onPostrender={onPostrender}>
        <olSourceOSM />
      </olLayerTile>
    </Map>
  );
};

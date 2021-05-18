import React, { useState } from "react";
import proj4 from "proj4";
import { getCenter } from "ol/extent";
import { register } from "ol/proj/proj4";
import { transform } from "ol/proj";

import { Map } from "../map";

import "ol/ol.css";

export default {
  title: "OL Examples/Reprojection image",
  component: Map
};

proj4.defs(
  "EPSG:27700",
  "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 " +
    "+x_0=400000 +y_0=-100000 +ellps=airy " +
    "+towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 " +
    "+units=m +no_defs"
);
register(proj4);

export const ReprojectionImage = () => {
  const [isImageSmooth, setImageSmoothing] = useState(true);
  const imageExtent = [0, 0, 700000, 1300000];

  return (
    <>
      <div>
        <input
          type="checkbox"
          id="imageSmoothing"
          checked={isImageSmooth}
          onChange={e => setImageSmoothing(e.target.checked)}
        />
        Image smoothing
      </div>
      <Map>
        <olView
          initialCenter={transform(
            getCenter(imageExtent),
            "EPSG:27700",
            "EPSG:3857"
          )}
          initialZoom={4}
        />
        <olLayerTile>
          <olSourceOSM />
        </olLayerTile>
        <olLayerImage>
          <olSourceImageStatic
            url="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/British_National_Grid.svg/2000px-British_National_Grid.svg.png"
            crossOrigin=""
            projection="EPSG:27700"
            imageExtent={imageExtent}
            args={{
              imageSmoothing: isImageSmooth
            }}
          />
        </olLayerImage>
      </Map>
    </>
  );
};

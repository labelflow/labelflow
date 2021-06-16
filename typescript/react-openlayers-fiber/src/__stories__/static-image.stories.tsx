import React from "react";
import { Extent, getCenter } from "ol/extent";
import Projection from "ol/proj/Projection";

import { Map } from "../map";

const extent: Extent = [0, 0, 1024, 968];
const attributions = '© <a href="http://xkcd.com/license.html">xkcd</a>';

export const StaticImage = () => {
  const projection = new Projection({
    code: "xkcd-image",
    units: "pixels",
    extent,
  });

  return (
    <Map>
      <olView
        initialCenter={getCenter(extent)}
        initialZoom={2}
        maxZoom={8}
        initialProjection={projection}
      />
      <olLayerImage>
        <olSourceImageStatic
          initialProjection={projection}
          initialUrl="https://imgs.xkcd.com/comics/online_communities.png"
          attributions={attributions}
          imageExtent={extent}
        />
      </olLayerImage>
    </Map>
  );
};

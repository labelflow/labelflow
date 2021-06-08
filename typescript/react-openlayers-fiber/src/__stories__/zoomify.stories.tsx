import React from "react";

import { Map } from "../map";

export const Zoomify = () => {
  const imgWidth = 4000;
  const imgHeight = 3000;

  return (
    <Map>
      <olView
        initialCenter={[imgWidth / 2, -imgHeight / 2]}
        initialZoom={4}
        args={{
          extent: [0, -imgHeight, imgWidth, 0],
          constrainOnlyCenter: true,
          maxResolution: 80,
          minResolution: 0.05,
        }}
      />
      <olLayerTile>
        {/* We have to use the constructor of the object Zoomify because the setUrl method does not do this special behavior: https://github.com/openlayers/openlayers/blob/f3a67e818289282ac71b6d13df96434dd44ace61/src/ol/source/Zoomify.js#L201 */}
        <olSourceZoomify
          // size={[imgWidth, imgHeight]}
          // eslint-disable-next-line react/no-unknown-property
          crossOrigin="anonymous"
          zDirection={-1}
          args={{
            size: [imgWidth, imgHeight],
            url: "https://ol-zoomify.surge.sh/zoomify/",
          }}
        />
      </olLayerTile>
    </Map>
  );
};

import * as React from "react";
import { Extent, getCenter } from "ol/extent";
import { Box } from "@chakra-ui/react";

import Projection from "ol/proj/Projection";

import { Map } from "@labelflow/react-openlayers-fiber";

import "ol/ol.css";

const Toto = () => {
  const extent: Extent = [0, 0, 1024, 968];

  const attributions = '© <a href="http://xkcd.com/license.html">xkcd</a>';
  const projection = new Projection({
    code: "xkcd-image",
    units: "pixels",
    extent,
  });
  console.log(getCenter(extent));
  return (
    <Box flex="1" position="relative">
      <Map args={{ controls: [] }}>
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
    </Box>
  );
};

export default Toto;

import { useMemo } from "react";
import { Extent, getCenter } from "ol/extent";
import { Box } from "@chakra-ui/react";
import memoize from "mem";
import Projection from "ol/proj/Projection";

import { Map } from "@labelflow/react-openlayers-fiber";
import type { Image } from "../../types.generated";
import "ol/ol.css";

const empty: any[] = [];

const getOlObjectsForImage = memoize((imageId, image: Image) => {
  const url = image?.url;
  const extent: Extent = [0, 0, image?.width ?? 640, image?.height ?? 480];
  const center = getCenter(extent);
  const projection = new Projection({
    code: imageId,
    units: "pixels",
    extent,
  });
  return { url, center, extent, projection };
});

type Props = { image: Image };

const Toto = ({ image }: Props) => {
  const { url, extent, projection, center } = getOlObjectsForImage(
    image?.id,
    image
  );

  //   const { url, extent, projection } = {
  //     url: "https://imgs.xkcd.com/comics/online_communities.png",
  //     extent: [0, 0, 1024, 968],
  //     projection: new Projection({
  //       code: "xkcd-image",
  //       units: "pixels",
  //       extent: [0, 0, 1024, 968],
  //     }),
  //   };

  console.log("============================");
  console.log(image);
  console.log({ url, extent, projection });

  return (
    <Map args={{ controls: empty }} style={{ height: "100%", width: "100%" }}>
      <olView args={{ projection, center }} initialZoom={1} maxZoom={8} />
      <olLayerImage>
        <olSourceImageStatic args={{ url, imageExtent: extent, projection }} />
      </olLayerImage>
    </Map>
  );
};

export default Toto;

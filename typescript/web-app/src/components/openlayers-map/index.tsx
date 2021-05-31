import { Extent, getCenter } from "ol/extent";
import { Size } from "ol/size";

import memoize from "mem";
import Projection from "ol/proj/Projection";

import { Map } from "@labelflow/react-openlayers-fiber";
import type { Image } from "../../types.generated";
import "ol/ol.css";

const empty: any[] = [];

/**
 * Memoize openlayers parameters that we pass to the
 */
const getOlObjectsForImage = memoize(
  (
    imageId,
    image?: Pick<Image, "id" | "url" | "name" | "width" | "height">
  ) => {
    const url = image?.url;
    const size: Size = [image?.width ?? 640, image?.height ?? 480];
    const extent: Extent = [0, 0, image?.width ?? 640, image?.height ?? 480];
    const center = getCenter(extent);
    const projection = new Projection({
      code: imageId,
      units: "pixels",
      extent,
    });
    return { url, size, extent, center, projection };
  }
);

type Props = {
  image?: Pick<Image, "id" | "url" | "name" | "width" | "height">;
};

const Toto = ({ image }: Props) => {
  const { url, size, extent, center, projection } = getOlObjectsForImage(
    image?.id,
    image
  );
  return (
    <Map args={{ controls: empty }} style={{ height: "100%", width: "100%" }}>
      <olView args={{ projection, center }} initialZoom={1} maxZoom={8} />
      <olLayerImage extent={extent}>
        {url != null && (
          <olSourceImageStatic
            args={{ url, imageExtent: extent, imageSize: size, projection }}
          />
        )}
      </olLayerImage>
    </Map>
  );
};

export default Toto;

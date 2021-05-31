// import { useEffect, useRef } from "react";
import { Extent, getCenter } from "ol/extent";
import { Size } from "ol/size";
// import { View as OlView } from "ol";
import memoize from "mem";
import Projection from "ol/proj/Projection";
import useMeasure from "react-use-measure";

import { Map } from "@labelflow/react-openlayers-fiber";
import type { Image } from "../../types.generated";
import "ol/ol.css";

const empty: any[] = [];

/**
 * Padding around the openlayers view
 * [top, right, bottom, left] in pixels
 * See https://openlayers.org/en/latest/apidoc/module-ol_View-View.html#padding
 */
const viewPadding = [72, 72, 72, 72];

const standardProjection = new Projection({
  code: "standardImageStaticProjection",
  units: "pixels",
  extent: [0, 0, 10000, 10000],
});

/**
 * Memoize openlayers parameters that we pass to the
 */
const getMemoizedProperties = memoize(
  (
    _imageId,
    image?: Pick<Image, "id" | "url" | "name" | "width" | "height">
  ) => {
    const url = image?.url;
    const imageWidth = image?.width ?? 640;
    const imageHeight = image?.height ?? 480;
    const size: Size = [imageWidth, imageHeight];
    const extent: Extent = [0, 0, imageWidth, imageHeight];
    const center = getCenter(extent);
    const projection = standardProjection;
    // const projection = new Projection({
    //   code: imageId,
    //   units: "pixels",
    //   extent,
    // });

    return { url, size, extent, center, projection };
  }
);

type Props = {
  image?: Pick<Image, "id" | "url" | "name" | "width" | "height">;
};

const OpenlayersMap = ({ image }: Props) => {
  const [ref, bounds] = useMeasure();

  const { url, size, extent, center, projection } = getMemoizedProperties(
    image?.id,
    image
  );

  const resolution = Math.max(
    size[0] / (bounds.width - viewPadding[1] - viewPadding[3]),
    size[1] / (bounds.height - viewPadding[0] - viewPadding[2])
  );

  return (
    <Map
      args={{ controls: empty }}
      style={{ height: "100%", width: "100%" }}
      containerRef={ref}
    >
      {
        // Before useMeasure has time to properly measure the div, we have a negative resolution,
        // There is no point rendering the view in that case
        resolution > 0 && (
          <olView
            args={{ extent }}
            center={center}
            initialProjection={projection}
            resolution={resolution}
            minResolution={1.0 / 16.0}
            maxResolution={resolution}
            constrainOnlyCenter
            showFullExtent
            padding={viewPadding}
          />
        )
      }
      <olLayerImage extent={extent}>
        {url != null && (
          <olSourceImageStatic
            args={{
              url,
              imageExtent: extent,
              imageSize: size,
              projection,
              crossOrigin: "anonymous",
            }}
          />
        )}
      </olLayerImage>
    </Map>
  );
};

export default OpenlayersMap;

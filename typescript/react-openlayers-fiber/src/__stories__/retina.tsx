import React from "react";

import { Map } from "../map";

export const Retina = () => (
  <Map>
    <olView initialCenter={[0, 0]} initialZoom={2} />
    <olLayerTile preload={Infinity}>
      <olSourceXYZ
        url="https://tile.osmand.net/hd/{z}/{x}/{y}.png"
        // eslint-disable-next-line react/no-unknown-property
        crossOrigin={null as unknown as undefined} // See https://github.com/DefinitelyTyped/DefinitelyTyped/pull/53409
        maxZoom={19}
        tilePixelRatio={2}
      />
    </olLayerTile>
  </Map>
);

import React, { useRef } from "react";
import { View } from "ol";

import { Map } from "../map";

export const AccessibleMap = () => {
  const viewRef = useRef<View>();
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          viewRef.current?.setZoom(viewRef.current.getZoom() - 1);
        }}
      >
        Zoom out
      </button>
      <button
        type="button"
        onClick={() => {
          viewRef.current?.setZoom(viewRef.current.getZoom() + 1);
        }}
      >
        Zoom in
      </button>
      <Map>
        <olView ref={viewRef} initialCenter={[0, 0]} initialZoom={2} />
        <olLayerTile>
          <olSourceOSM />
        </olLayerTile>
      </Map>
    </div>
  );
};

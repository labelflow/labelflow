import React, { useState } from "react";
import { Overlay, Map as OlMap } from "ol";

import OverlayPositioning from "ol/OverlayPositioning";
import IconAnchorUnits from "ol/style/IconAnchorUnits";
import { Point } from "ol/geom";
import { Map } from "../map";

import icon from "./icon.png";

export const Icon = () => {
  const [displayPopup, setDisplayPopup] = useState(false);

  const [map, setMap] = useState<OlMap | null>(null);
  const [popup, setPopup] = useState<HTMLDivElement | null>(null);
  const [overlay, setOverlay] = useState<Overlay>();

  const onClick = (evt: any): void => {
    if (!map) return;
    const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
    if (feature) {
      if (!overlay) return;
      const coordinates = (feature.getGeometry() as Point).getCoordinates();
      overlay.setPosition(coordinates);
      setDisplayPopup(true);
    } else {
      setDisplayPopup(false);
    }
  };

  const onPointermove = (e: any) => {
    if (!map) return;
    if (e.dragging) {
      setDisplayPopup(false);
      return;
    }
    const pixel = map.getEventPixel(e.originalEvent);
    const hit = map.hasFeatureAtPixel(pixel);
    (map.getTarget() as HTMLElement).style.cursor = hit ? "pointer" : "";
  };

  return (
    <div>
      <div ref={setPopup}>
        {displayPopup ? (
          <p style={{ backgroundColor: "white" }}>Null Island</p>
        ) : null}
      </div>
      <Map ref={setMap} onPointermove={onPointermove} onClick={onClick}>
        {popup ? (
          <olOverlay
            ref={setOverlay}
            offset={[0, -50]}
            positioning={OverlayPositioning.BOTTOM_CENTER}
            element={popup}
            args={{
              stopEvent: false,
            }}
          />
        ) : null}
        <olView initialCenter={[0, 0]} initialZoom={3} />
        <olLayerTile>
          <olSourceTileJSON
            args={{
              url: "https://a.tiles.mapbox.com/v3/aj.1x1-degrees.json?secure=1",
              crossOrigin: "",
            }}
          />
        </olLayerTile>
        <olLayerVector>
          <olSourceVector>
            <olFeature>
              <olStyleStyle attach="style">
                <olStyleIcon
                  attach="image"
                  args={{
                    anchor: [0.5, 46],
                    anchorXUnits: IconAnchorUnits.FRACTION,
                    anchorYUnits: IconAnchorUnits.PIXELS,
                    src: icon,
                  }}
                />
              </olStyleStyle>
              <olGeomPoint coordinates={[0, 0]} />
            </olFeature>
          </olSourceVector>
        </olLayerVector>
      </Map>
    </div>
  );
};

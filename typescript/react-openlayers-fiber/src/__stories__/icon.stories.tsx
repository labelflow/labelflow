import React, { useState } from "react";
import { Overlay, Map as OlMap } from "ol";

import OverlayPositioning from "ol/OverlayPositioning";
import IconAnchorUnits from "ol/style/IconAnchorUnits";
import { Point } from "ol/geom";
import { Map } from "../map";
import { useResource } from "../hooks";
import icon from "./icon.png";

export default {
  title: "react-openlayers-fiber/OL Examples",
  component: Map,
};

export const Icon = () => {
  const [displayPopup, setDisplayPopup] = useState(false);
  const mapRef = useResource<OlMap>();
  const popupRef = useResource<HTMLDivElement>();
  const overlayRef = useResource<Overlay>();

  const onClick = (evt: any): void => {
    const feature = mapRef.current.forEachFeatureAtPixel(evt.pixel, (f) => f);
    if (feature) {
      const coordinates = (feature.getGeometry() as Point).getCoordinates();
      overlayRef.current.setPosition(coordinates);
      setDisplayPopup(true);
    } else {
      setDisplayPopup(false);
    }
  };

  const onPointermove = (e: any) => {
    if (e.dragging) {
      setDisplayPopup(false);
      return;
    }
    const pixel = mapRef.current.getEventPixel(e.originalEvent);
    const hit = mapRef.current.hasFeatureAtPixel(pixel);
    (mapRef.current.getTarget() as HTMLElement).style.cursor = hit
      ? "pointer"
      : "";
  };

  return (
    <div>
      <div ref={popupRef}>
        {displayPopup ? (
          <p style={{ backgroundColor: "white" }}>Null Island</p>
        ) : null}
      </div>
      <Map ref={mapRef} onPointermove={onPointermove} onClick={onClick}>
        {popupRef?.current ? (
          <olOverlay
            ref={overlayRef}
            offset={[0, -50]}
            positioning={"bottom-center" as OverlayPositioning}
            element={popupRef.current}
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
                    anchorXUnits: "fraction" as IconAnchorUnits,
                    anchorYUnits: "pixels" as IconAnchorUnits,
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

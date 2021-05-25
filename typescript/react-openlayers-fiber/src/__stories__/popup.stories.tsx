import React, { useState } from "react";
import { toLonLat } from "ol/proj";
import { toStringHDMS, Coordinate } from "ol/coordinate";
import { Overlay } from "ol";

import { Map } from "../map";
import { useResource } from "../hooks";

import "ol/ol.css";

export default {
  title: "OL Examples/Popup",
  component: Map,
};

export const Popup = () => {
  const [coordinates, setCoordinates] = useState<Coordinate>(undefined);
  const [displayPopup, setDisplayPopup] = useState(false);
  const popupRef = useResource<HTMLElement>();
  const overlayRef = useResource<Overlay>();

  const onSingleclick = (evt) => {
    const coordinate = evt.coordinate;
    setCoordinates(coordinate);
    overlayRef.current.setPosition(coordinate);
    setDisplayPopup(true);
  };

  return (
    <div>
      <div
        ref={popupRef}
        style={{
          backgroundColor: "white",
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          padding: "15px",
          borderRadius: "10px",
          border: "1px solid #cccccc",
          minWidth: "280px",
        }}
      >
        {displayPopup ? (
          <>
            <button
              onClick={(): void => {
                setDisplayPopup(false);
                setCoordinates(undefined);
              }}
              style={{
                textDecoration: "none",
                position: "absolute",
                top: "2px",
                right: "8px",
              }}
            >
              X
            </button>
            <div id="popup-content">
              <p>You clicked here:</p>
              <code>{toStringHDMS(toLonLat(coordinates))}</code>
            </div>
          </>
        ) : null}
      </div>
      <Map onSingleclick={onSingleclick}>
        {popupRef?.current ? (
          <olOverlay
            ref={overlayRef}
            element={popupRef.current}
            autoPan
            autoPanAnimation={{
              duration: 250,
            }}
          />
        ) : null}
        <olView initialCenter={[-472202, 7530279]} initialZoom={12} />
        <olLayerTile>
          <olSourceXYZ
            attributions={
              '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
            }
            url="https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            tileSize={512}
          />
        </olLayerTile>
      </Map>
    </div>
  );
};

import React, { useState } from "react";
import { toLonLat } from "ol/proj";
import { toStringHDMS, Coordinate } from "ol/coordinate";
import { MapBrowserEvent, Overlay } from "ol";

import { Map } from "../map";

export const Popup = () => {
  const [coordinates, setCoordinates] =
    useState<Coordinate | undefined>(undefined);
  const [displayPopup, setDisplayPopup] = useState(false);
  const [popup, setPopup] = useState<HTMLDivElement | null>();
  const [overlay, setOverlay] = useState<Overlay>();

  const onSingleclick = (evt: MapBrowserEvent<UIEvent>) => {
    if (!overlay) return;
    const { coordinate } = evt;
    setCoordinates(coordinate);
    overlay.setPosition(coordinate);
    setDisplayPopup(true);
  };

  return (
    <div>
      <div
        ref={setPopup}
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
              type="button"
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
              <code>{coordinates && toStringHDMS(toLonLat(coordinates))}</code>
            </div>
          </>
        ) : null}
      </div>
      <Map onSingleclick={onSingleclick}>
        {popup ? (
          <olOverlay
            ref={setOverlay}
            element={popup}
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

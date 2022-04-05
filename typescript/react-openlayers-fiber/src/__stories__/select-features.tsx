import React, { useState } from "react";
import GeoJSON from "ol/format/GeoJSON";
import { click, pointerMove, altKeyOnly } from "ol/events/condition";
import { SelectEvent } from "ol/interaction/Select";
import VectorSource from "ol/source/Vector";
import { Geometry } from "ol/geom";
import { MapBrowserEvent } from "ol";
import { Map } from "../map";

export const SelectFeatures = () => {
  const [displayText, setDisplayText] = useState("0 selected features");
  const [selectMethod, setSelectMethod] = useState("singleClick");

  const getSelectCondition = () => {
    switch (selectMethod) {
      case "singleClick":
        return click;
      case "pointerMove":
        return pointerMove;
      case "altClick":
        return (mapBrowserEvent: MapBrowserEvent<UIEvent>) => {
          return click(mapBrowserEvent) && altKeyOnly(mapBrowserEvent);
        };
      default:
        return () => false;
    }
  };
  return (
    <>
      <Map>
        <olView initialCenter={[0, 0]} initialZoom={2} />
        <olLayerTile>
          <olSourceOSM />
        </olLayerTile>
        <olLayerVector>
          <olSourceVector
            url="https://openlayers.org/en/latest/examples/data/geojson/countries.geojson"
            format={new GeoJSON()}
          />
        </olLayerVector>
        <olInteractionSelect
          args={{ condition: getSelectCondition() }}
          onSelect={(e: SelectEvent) => {
            setDisplayText(
              ` ${(e.target as VectorSource<Geometry>)
                .getFeaturesCollection()
                .getLength()} selected features (last operation selected ${
                e.selected.length
              } and deselected  ${e.deselected.length} features)`
            );
          }}
        />
      </Map>
      <form className="form-inline">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="type">Action type &nbsp;</label>
        <select id="type" onChange={(e) => setSelectMethod(e.target.value)}>
          <option value="click" selected>
            Click
          </option>
          <option value="singleClick">Single-click</option>
          <option value="pointerMove">Hover</option>
          <option value="altClick">Alt+Click</option>
          <option value="none">None</option>
        </select>
        <span>{displayText}</span>
      </form>
    </>
  );
};

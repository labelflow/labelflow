import React from "react";
import { useInterval } from "react-use";
import { Map } from "../map";

/**
 * In this story we prefix the props with initial for the view, so it should be initially at these values
 * and allow free movement after, never reseting the view position
 */
export const BasicConstructorArgs = () => (
  <Map style={{ width: "100%", height: "640px" }}>
    <olView initialCenter={[0, 6000000]} initialZoom={6} />
    <olLayerTile>
      <olSourceOSM />
    </olLayerTile>
  </Map>
);
BasicConstructorArgs.parameters = { chromatic: { disableSnapshot: true } };

/**
 * In this story we only provide props for the view, so it should load with default values
 * and go a bit north every second, forcing the view to recenter every second
 */
export const BasicProps = () => {
  const [latitude, setLatitude] = React.useState(6000000);

  useInterval(() => {
    setLatitude(latitude + 10000);
  }, 1000);

  return (
    <Map style={{ width: "100%", height: "640px" }}>
      <olView center={[0, latitude]} zoom={6} />
      <olLayerTile>
        <olSourceOSM />
      </olLayerTile>
    </Map>
  );
};
BasicProps.parameters = { chromatic: { disableSnapshot: true } };

/**
 * In this story we provide props and initial props for the view, so it should behave like the Basic Props example values.
 * It loads with the initial values and immediatly the position get changed with the position from props
 */
export const BasicBoth = () => {
  const [latitude, setLatitude] = React.useState(6000000);

  useInterval(() => {
    setLatitude(latitude + 10000);
  }, 1000);

  return (
    <Map>
      <olView
        initialCenter={[0, 6000000]}
        initialZoom={6}
        center={[0, latitude]}
      />
      <olLayerTile>
        <olSourceOSM />
      </olLayerTile>
    </Map>
  );
};

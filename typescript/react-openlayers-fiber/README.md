# React OpenLayers Fiber

## Install

```sh
yarn add @sterblue/react-openlayers-fiber
```

## Usage

```tsx
import { Map } from "@sterblue/react-openlayers-fiber";

function MyMap() {
  return (
    <Map style={{ width: "100%", height: "640px" }}>
      <olView center={[0, 6000000]} zoom={6} />
      <olLayerTile>
        <olSourceOSM />
      </olLayerTile>
    </Map>
  );
}
```

## Examples

To see more examples you must start storybook:

```sh
yarn start
```

Most of the examples comes from [openlayers examples section](https://openlayers.org/en/latest/examples/).

## Props lifecycle

The openlayers components take three differents kind of props:

- classic ones
- the args prop
- props prefixed with initial

The classic ones behave like any prop in React but the openlayer object must have a setter for the prop to work fine (or being settable by the generic setter `set(key, value)`.

### args

If a property of an openlayers object doesn't have a specific setter or isn't updatable through the generic setter you must use the `args` prop. Here is an example:

```tsx
function MyMap() {
  return (
    <Map style={{ width: "100%", height: "640px" }}>
      <olView initialCenter={[0, 6000000]} initialZoom={6} />
      <olLayerTile>
        <olSourceOSM />
      </olLayerTile>
      <olLayerVector>
        <olSourceVector>
          <olFeature>
            <olStyleStyle attach="style">
              <olStyleRegularShape
                attach="image"
                args={{
                  fill,
                  stroke,
                  radius: 20,
                  points: 4,
                  angle: Math.PI / 4
                }}
              />
            </olStyleStyle>
            <olGeomPoint coordinates={[0, 6000000]} />
          </olFeature>
        </olSourceVector>
      </olLayerVector>
    </Map>
  );
}
```

The args's properties are directly passed in the openlayers object's constructor. If a property value changed during you component lifecycle it trigger a special behavior that delete the openlayers object and create a new one with the upated args property value.

### initial prefix

The initial prefix only applies to classic props. It gives you the ability to set a default value to a prop so it behaves as a uncontrolled input. Here is an example:

```tsx
import { Map } from "@sterblue/react-openlayers-fiber";

function MyMap() {
  return (
    <Map style={{ width: "100%", height: "640px" }}>
      <olView initialCenter={[0, 6000000]} initialZoom={6} />
      <olLayerTile>
        <olSourceOSM />
      </olLayerTile>
    </Map>
  );
}
```

By using the `initial` prefix here the map won't reset the position and the zoom each time the component `MyMap` is rerendered.

# LabelFlow web

## Installation

```sh
yarn
```

## Usage

```sh
yarn dev
```

## Build service worker

```sh
yarn node -e 'require("./build-service-worker-webpack-swc")()'
```

## Serve wasm-vips

For use in the service worker. See https://github.com/kleisauke/wasm-vips#browser

```sh
cp -R "../../node_modules/wasm-vips/lib/node" "./public/static/wasm-vips"
```
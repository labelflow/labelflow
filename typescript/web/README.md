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

For use in the service worker. See https://github.com/kleisauke/wasm-vips#browser

```sh
yarn webpack --config ./webpack-config-worker.js --progress
```

## Serve wasm-vips

For use in the service worker. See https://github.com/kleisauke/wasm-vips#browser

```sh
cp -R "../../node_modules/wasm-vips/lib/node" "./public/static/wasm-vips"
```
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

You have two choices

- SWC: `rm -rf public/static/sw && npx spack`
- Esbuild (Does not work) `npx esbuild src/worker/index.ts --bundle --outdir=public/statc/sw/ --target=browser`
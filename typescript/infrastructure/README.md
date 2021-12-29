# Infrastructure

This package implements the infrastructure (as code, using Pulumi) to deploy the Auto-Polygon aka IOG server in `python/iog` that is stored on our docker registry. The server is hosted on Google Cloud, inside a Kubernetes cluster.

## Deploy

```console
yarn deploy
```

Warning: take care about the instructions at the top of `index.ts`in case you deploy from scratch.

## Destroy

Removes all instances.

```console
yarn destroy
```

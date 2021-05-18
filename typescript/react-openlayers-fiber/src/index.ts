import {
  Catalogue as CatalogueBase,
  CatalogueItem as CatalogueItemBase,
  CatalogueKey as CatalogueKeyBase,
  Kind as KindBase,
} from "./catalogue";

export { catalogue, extend } from "./catalogue";

export type Catalogue = CatalogueBase;
export type CatalogueItem<T> = CatalogueItemBase<T>;
export type CatalogueKey = CatalogueKeyBase;
export type Kind = KindBase;

export { MapContext, MapProvider, MapConsumer, useMap } from "./context";

export { Map } from "./map";

export { useResource, useUpdate } from "./hooks";

export * from "./types";

// /////////////////////////////////////////////////////////////////////////////
// The catalogue is the list of object from openlayers that are supported
// it is generated automatically, and is strongly typed
// /////////////////////////////////////////////////////////////////////////////

import {
  upperFirst,

  // lowerFirst,
  // isObject,
  omit,
} from "lodash/fp";

// /////////////////////////////////////////////////////////////////////////////
// Import stuff we want to use from Openlayers

import * as olRaw from "ol";
import * as olLayerRaw from "ol/layer";
import * as olControlRaw from "ol/control";
import * as olInteractionRaw from "ol/interaction";
import * as olSourceRaw from "ol/source";
import * as olGeomRaw from "ol/geom";
import * as olStyleRaw from "ol/style";

// /////////////////////////////////////////////////////////////////////////////
// Here we define what we omit: abstract base classes, utility classes and other weird stuff

const olOmitKeys = [
  "defaults",
  "AssertionError",
  "Disposable",
  "Graticule",
  "Image",
  "ImageBase",
  "ImageCanvas",
  "ImageTile",
  "Kinetic",
  "MapBrowserEvent",
  "MapBrowserEventHandler",
  "MapEvent",
  "Tile",
  "TileQueue",
  "TileRange",
  "VectorRenderTile",
  "VectorTile",
  "getUid",
  "VERSION",
] as const;
const olLayerOmitKeys = [] as const;
const olControlOmitKeys = ["defaults"] as const;
const olInteractionOmitKeys = ["defaults"] as const;
const olSourceOmitKeys = ["Image", "Source", "Tile"] as const;
const olGeomOmitKeys = ["Geometry", "SimpleGeometry"] as const;
const olStyleOmitKeys = ["Image", "IconImage"] as const;

// /////////////////////////////////////////////////////////////////////////////
// Here we do omit things listed above

const ol = omit(olOmitKeys, olRaw) as Omit<
  typeof olRaw,
  typeof olOmitKeys[number]
>;
const olLayer = omit(olLayerOmitKeys, olLayerRaw) as Omit<
  typeof olLayerRaw,
  typeof olLayerOmitKeys[number]
>;
const olControl = omit(olControlOmitKeys, olControlRaw) as Omit<
  typeof olControlRaw,
  typeof olControlOmitKeys[number]
>;
const olInteraction = omit(olInteractionOmitKeys, olInteractionRaw) as Omit<
  typeof olInteractionRaw,
  typeof olInteractionOmitKeys[number]
>;
const olSource = omit(olSourceOmitKeys, olSourceRaw) as Omit<
  typeof olSourceRaw,
  typeof olSourceOmitKeys[number]
>;
const olGeom = omit(olGeomOmitKeys, olGeomRaw) as Omit<
  typeof olGeomRaw,
  typeof olGeomOmitKeys[number]
>;
const olStyle = omit(olStyleOmitKeys, olStyleRaw) as Omit<
  typeof olStyleRaw,
  typeof olStyleOmitKeys[number]
>;

// /////////////////////////////////////////////////////////////////////////////

// type OlSourceRaw = typeof olSourceRaw;
// // type OlSourceRawKey = keyof OlSourceRaw;
// type OlSourceOmitKey = typeof olSourceOmitKeys[number];
// // type OlSourceKey = Exclude<OlSourceRawKey, OlSourceOmitKey>;
// // type OlSourceElement = OlSourceRaw[OlSourceKey];
// type OlSource = Omit<OlSourceRaw, OlSourceOmitKey>;

// const olSource = Object.fromEntries(
//   Object.entries(olSourceRaw).filter(
//     ([key]) => !olSourceOmitKeys.includes(key as OlSourceOmitKey)
//   ) // as [OlSourceKey, OlSourceElement]
// ) as OlSource;

// /////////////////////////////////////////////////////////////////////////////
// Now we generate the types automatically (This parts needs typescript >=4.1)

type CatalogueOl = {
  [K in keyof typeof ol as `ol${Capitalize<K>}`]: {
    kind: K;
    type: `ol${Capitalize<K>}`;
    object: typeof ol[K];
  };
};
type CatalogueOlLayer = {
  [K in keyof typeof olLayer as `olLayer${Capitalize<K>}`]: {
    kind: "Layer";
    type: `olLayer${Capitalize<K>}`;
    object: typeof olLayer[K];
  };
};
type CatalogueOlControl = {
  [K in keyof typeof olControl as `olControl${Capitalize<K>}`]: {
    kind: "Control";
    type: `olControl${Capitalize<K>}`;
    object: typeof olControl[K];
  };
};
type CatalogueOlInteraction = {
  [K in keyof typeof olInteraction as `olInteraction${Capitalize<K>}`]: {
    kind: "Interaction";
    type: `olInteraction${Capitalize<K>}`;
    object: typeof olInteraction[K];
  };
};
type CatalogueOlSource = {
  [K in keyof typeof olSource as `olSource${Capitalize<K>}`]: {
    kind: "Source";
    type: `olSource${Capitalize<K>}`;
    object: typeof olSource[K];
  };
};
type CatalogueOlGeom = {
  [K in keyof typeof olGeom as `olGeom${Capitalize<K>}`]: {
    kind: "Geom";
    type: `olGeom${Capitalize<K>}`;
    object: typeof olGeom[K];
  };
};
type CatalogueOlStyle = {
  [K in keyof typeof olStyle as `olStyle${Capitalize<K>}`]: {
    kind: "Style";
    type: `olStyle${Capitalize<K>}`;
    object: typeof olStyle[K];
  };
};

// /////////////////////////////////////////////////////////////////////////////
// With typescript <4.1 we have to do this:

// // /////////////////////////////////////////////////////////////////////////////
// // Catalogue Type
// export type Kind =
//   // Elements of Ol that we picked manually
//   | keyof typeof ol
//   // Or the categories of Ol items explained in https://openlayers.org/en/latest/apidoc/
//   | "Layer"
//   | "Control"
//   | "Interaction"
//   | "Source"
//   | "Geom"
//   | "Style";

// export type NewCatalogueItem<K extends Kind, T extends string, O> = {
//   kind: K;
//   type: T;
//   object: O;
// };

// type CatalogueOl = {
//   olCollection: NewCatalogueItem<
//     "Collection",
//     "olCollection",
//     typeof olRaw.Collection
//   >;
//   olFeature: NewCatalogueItem<"Feature", "olFeature", typeof olRaw.Feature>;
//   olGeolocation: NewCatalogueItem<
//     "Geolocation",
//     "olGeolocation",
//     typeof olRaw.Geolocation
//   >;
//   olMap: NewCatalogueItem<"Map", "olMap", typeof olRaw.Map>;
//   olObject: NewCatalogueItem<"Object", "olObject", typeof olRaw.Object>;
//   olObservable: NewCatalogueItem<
//     "Observable",
//     "olObservable",
//     typeof olRaw.Observable
//   >;
//   olOverlay: NewCatalogueItem<"Overlay", "olOverlay", typeof olRaw.Overlay>;
//   olPluggableMap: NewCatalogueItem<
//     "PluggableMap",
//     "olPluggableMap",
//     typeof olRaw.PluggableMap
//   >;
//   olTileCache: NewCatalogueItem<
//     "TileCache",
//     "olTileCache",
//     typeof olRaw.TileCache
//   >;
//   olView: NewCatalogueItem<"View", "olView", typeof olRaw.View>;
// };
// type CatalogueOlLayer = {
//   olLayerGraticule: NewCatalogueItem<
//     "Layer",
//     "olLayerGraticule",
//     typeof olLayerRaw.Graticule
//   >;
//   olLayerGroup: NewCatalogueItem<
//     "Layer",
//     "olLayerGroup",
//     typeof olLayerRaw.Group
//   >;
//   olLayerHeatmap: NewCatalogueItem<
//     "Layer",
//     "olLayerHeatmap",
//     typeof olLayerRaw.Heatmap
//   >;
//   olLayerImage: NewCatalogueItem<
//     "Layer",
//     "olLayerImage",
//     typeof olLayerRaw.Image
//   >;
//   olLayerLayer: NewCatalogueItem<
//     "Layer",
//     "olLayerLayer",
//     typeof olLayerRaw.Layer
//   >;
//   olLayerMapboxVector: NewCatalogueItem<
//     "Layer",
//     "olLayerMapboxVector",
//     typeof olLayerRaw.MapboxVector
//   >;
//   olLayerTile: NewCatalogueItem<"Layer", "olLayerTile", typeof olLayerRaw.Tile>;
//   olLayerVector: NewCatalogueItem<
//     "Layer",
//     "olLayerVector",
//     typeof olLayerRaw.Vector
//   >;
//   olLayerVectorImage: NewCatalogueItem<
//     "Layer",
//     "olLayerVectorImage",
//     typeof olLayerRaw.VectorImage
//   >;
//   olLayerVectorTile: NewCatalogueItem<
//     "Layer",
//     "olLayerVectorTile",
//     typeof olLayerRaw.VectorTile
//   >;
//   olLayerWebGLPoints: NewCatalogueItem<
//     "Layer",
//     "olLayerWebGLPoints",
//     typeof olLayerRaw.WebGLPoints
//   >;
// };
// type CatalogueOlControl = {
//   olControlAttribution: NewCatalogueItem<
//     "Control",
//     "olControlAttribution",
//     typeof olControlRaw.Attribution
//   >;
//   olControlControl: NewCatalogueItem<
//     "Control",
//     "olControlControl",
//     typeof olControlRaw.Control
//   >;
//   olControlFullScreen: NewCatalogueItem<
//     "Control",
//     "olControlFullScreen",
//     typeof olControlRaw.FullScreen
//   >;
//   olControlMousePosition: NewCatalogueItem<
//     "Control",
//     "olControlMousePosition",
//     typeof olControlRaw.MousePosition
//   >;
//   olControlOverviewMap: NewCatalogueItem<
//     "Control",
//     "olControlOverviewMap",
//     typeof olControlRaw.OverviewMap
//   >;
//   olControlRotate: NewCatalogueItem<
//     "Control",
//     "olControlRotate",
//     typeof olControlRaw.Rotate
//   >;
//   olControlScaleLine: NewCatalogueItem<
//     "Control",
//     "olControlScaleLine",
//     typeof olControlRaw.ScaleLine
//   >;
//   olControlZoom: NewCatalogueItem<
//     "Control",
//     "olControlZoom",
//     typeof olControlRaw.Zoom
//   >;
//   olControlZoomSlider: NewCatalogueItem<
//     "Control",
//     "olControlZoomSlider",
//     typeof olControlRaw.ZoomSlider
//   >;
//   olControlZoomToExtent: NewCatalogueItem<
//     "Control",
//     "olControlZoomToExtent",
//     typeof olControlRaw.ZoomToExtent
//   >;
// };
// type CatalogueOlInteraction = {
//   olInteractionDoubleClickZoom: NewCatalogueItem<
//     "Interaction",
//     "olInteractionDoubleClickZoom",
//     typeof olInteractionRaw.DoubleClickZoom
//   >;
//   olInteractionDragAndDrop: NewCatalogueItem<
//     "Interaction",
//     "olInteractionDragAndDrop",
//     typeof olInteractionRaw.DragAndDrop
//   >;
//   olInteractionDragBox: NewCatalogueItem<
//     "Interaction",
//     "olInteractionDragBox",
//     typeof olInteractionRaw.DragBox
//   >;
//   olInteractionDragPan: NewCatalogueItem<
//     "Interaction",
//     "olInteractionDragPan",
//     typeof olInteractionRaw.DragPan
//   >;
//   olInteractionDragRotate: NewCatalogueItem<
//     "Interaction",
//     "olInteractionDragRotate",
//     typeof olInteractionRaw.DragRotate
//   >;
//   olInteractionDragRotateAndZoom: NewCatalogueItem<
//     "Interaction",
//     "olInteractionDragRotateAndZoom",
//     typeof olInteractionRaw.DragRotateAndZoom
//   >;
//   olInteractionDragZoom: NewCatalogueItem<
//     "Interaction",
//     "olInteractionDragZoom",
//     typeof olInteractionRaw.DragZoom
//   >;
//   olInteractionDraw: NewCatalogueItem<
//     "Interaction",
//     "olInteractionDraw",
//     typeof olInteractionRaw.Draw
//   >;
//   olInteractionExtent: NewCatalogueItem<
//     "Interaction",
//     "olInteractionExtent",
//     typeof olInteractionRaw.Extent
//   >;
//   olInteractionInteraction: NewCatalogueItem<
//     "Interaction",
//     "olInteractionInteraction",
//     typeof olInteractionRaw.Interaction
//   >;
//   olInteractionKeyboardPan: NewCatalogueItem<
//     "Interaction",
//     "olInteractionKeyboardPan",
//     typeof olInteractionRaw.KeyboardPan
//   >;
//   olInteractionKeyboardZoom: NewCatalogueItem<
//     "Interaction",
//     "olInteractionKeyboardZoom",
//     typeof olInteractionRaw.KeyboardZoom
//   >;
//   olInteractionModify: NewCatalogueItem<
//     "Interaction",
//     "olInteractionModify",
//     typeof olInteractionRaw.Modify
//   >;
//   olInteractionMouseWheelZoom: NewCatalogueItem<
//     "Interaction",
//     "olInteractionMouseWheelZoom",
//     typeof olInteractionRaw.MouseWheelZoom
//   >;
//   olInteractionPinchRotate: NewCatalogueItem<
//     "Interaction",
//     "olInteractionPinchRotate",
//     typeof olInteractionRaw.PinchRotate
//   >;
//   olInteractionPinchZoom: NewCatalogueItem<
//     "Interaction",
//     "olInteractionPinchZoom",
//     typeof olInteractionRaw.PinchZoom
//   >;
//   olInteractionPointer: NewCatalogueItem<
//     "Interaction",
//     "olInteractionPointer",
//     typeof olInteractionRaw.Pointer
//   >;
//   olInteractionSelect: NewCatalogueItem<
//     "Interaction",
//     "olInteractionSelect",
//     typeof olInteractionRaw.Select
//   >;
//   olInteractionSnap: NewCatalogueItem<
//     "Interaction",
//     "olInteractionSnap",
//     typeof olInteractionRaw.Snap
//   >;
//   olInteractionTranslate: NewCatalogueItem<
//     "Interaction",
//     "olInteractionTranslate",
//     typeof olInteractionRaw.Translate
//   >;
// };
// type CatalogueOlSource = {
//   olSourceBingMaps: NewCatalogueItem<
//     "Source",
//     "olSourceBingMaps",
//     typeof olSourceRaw.BingMaps
//   >;
//   olSourceCartoDB: NewCatalogueItem<
//     "Source",
//     "olSourceCartoDB",
//     typeof olSourceRaw.CartoDB
//   >;
//   olSourceCluster: NewCatalogueItem<
//     "Source",
//     "olSourceCluster",
//     typeof olSourceRaw.Cluster
//   >;
//   olSourceIIIF: NewCatalogueItem<
//     "Source",
//     "olSourceIIIF",
//     typeof olSourceRaw.IIIF
//   >;
//   // olSourceImage: NewCatalogueItem<"Source","olSourceImage",typeof olSourceRaw.Image>;
//   olSourceImageArcGISRest: NewCatalogueItem<
//     "Source",
//     "olSourceImageArcGISRest",
//     typeof olSourceRaw.ImageArcGISRest
//   >;
//   olSourceImageCanvas: NewCatalogueItem<
//     "Source",
//     "olSourceImageCanvas",
//     typeof olSourceRaw.ImageCanvas
//   >;
//   olSourceImageMapGuide: NewCatalogueItem<
//     "Source",
//     "olSourceImageMapGuide",
//     typeof olSourceRaw.ImageMapGuide
//   >;
//   olSourceImageStatic: NewCatalogueItem<
//     "Source",
//     "olSourceImageStatic",
//     typeof olSourceRaw.ImageStatic
//   >;
//   olSourceImageWMS: NewCatalogueItem<
//     "Source",
//     "olSourceImageWMS",
//     typeof olSourceRaw.ImageWMS
//   >;
//   olSourceOSM: NewCatalogueItem<
//     "Source",
//     "olSourceOSM",
//     typeof olSourceRaw.OSM
//   >;
//   olSourceRaster: NewCatalogueItem<
//     "Source",
//     "olSourceRaster",
//     typeof olSourceRaw.Raster
//   >;
//   // olSourceSource: NewCatalogueItem<"Source","olSourceSource",typeof olSourceRaw.Source>;
//   olSourceStamen: NewCatalogueItem<
//     "Source",
//     "olSourceStamen",
//     typeof olSourceRaw.Stamen
//   >;
//   // olSourceTile: NewCatalogueItem<"Source","olSourceTile",typeof olSourceRaw.Tile>;
//   olSourceTileArcGISRest: NewCatalogueItem<
//     "Source",
//     "olSourceTileArcGISRest",
//     typeof olSourceRaw.TileArcGISRest
//   >;
//   olSourceTileDebug: NewCatalogueItem<
//     "Source",
//     "olSourceTileDebug",
//     typeof olSourceRaw.TileDebug
//   >;
//   olSourceTileImage: NewCatalogueItem<
//     "Source",
//     "olSourceTileImage",
//     typeof olSourceRaw.TileImage
//   >;
//   olSourceTileJSON: NewCatalogueItem<
//     "Source",
//     "olSourceTileJSON",
//     typeof olSourceRaw.TileJSON
//   >;
//   olSourceTileWMS: NewCatalogueItem<
//     "Source",
//     "olSourceTileWMS",
//     typeof olSourceRaw.TileWMS
//   >;
//   olSourceUrlTile: NewCatalogueItem<
//     "Source",
//     "olSourceUrlTile",
//     typeof olSourceRaw.UrlTile
//   >;
//   olSourceUTFGrid: NewCatalogueItem<
//     "Source",
//     "olSourceUTFGrid",
//     typeof olSourceRaw.UTFGrid
//   >;
//   olSourceVector: NewCatalogueItem<
//     "Source",
//     "olSourceVector",
//     typeof olSourceRaw.Vector
//   >;
//   olSourceVectorTile: NewCatalogueItem<
//     "Source",
//     "olSourceVectorTile",
//     typeof olSourceRaw.VectorTile
//   >;
//   olSourceWMTS: NewCatalogueItem<
//     "Source",
//     "olSourceWMTS",
//     typeof olSourceRaw.WMTS
//   >;
//   olSourceXYZ: NewCatalogueItem<
//     "Source",
//     "olSourceXYZ",
//     typeof olSourceRaw.XYZ
//   >;
//   olSourceZoomify: NewCatalogueItem<
//     "Source",
//     "olSourceZoomify",
//     typeof olSourceRaw.Zoomify
//   >;
// };
// type CatalogueOlGeom = {
//   olGeomCircle: NewCatalogueItem<
//     "Geom",
//     "olGeomCircle",
//     typeof olGeomRaw.Circle
//   >;
//   // olGeomGeometry: NewCatalogueItem<"Geom","olGeomGeometry",typeof olGeomRaw.Geometry>;
//   olGeomGeometryCollection: NewCatalogueItem<
//     "Geom",
//     "olGeomGeometryCollection",
//     typeof olGeomRaw.GeometryCollection
//   >;
//   olGeomLinearRing: NewCatalogueItem<
//     "Geom",
//     "olGeomLinearRing",
//     typeof olGeomRaw.LinearRing
//   >;
//   olGeomLineString: NewCatalogueItem<
//     "Geom",
//     "olGeomLineString",
//     typeof olGeomRaw.LineString
//   >;
//   olGeomMultiLineString: NewCatalogueItem<
//     "Geom",
//     "olGeomMultiLineString",
//     typeof olGeomRaw.MultiLineString
//   >;
//   olGeomMultiPoint: NewCatalogueItem<
//     "Geom",
//     "olGeomMultiPoint",
//     typeof olGeomRaw.MultiPoint
//   >;
//   olGeomMultiPolygon: NewCatalogueItem<
//     "Geom",
//     "olGeomMultiPolygon",
//     typeof olGeomRaw.MultiPolygon
//   >;
//   olGeomPoint: NewCatalogueItem<"Geom", "olGeomPoint", typeof olGeomRaw.Point>;
//   olGeomPolygon: NewCatalogueItem<
//     "Geom",
//     "olGeomPolygon",
//     typeof olGeomRaw.Polygon
//   >;
//   // olGeomSimpleGeometry: NewCatalogueItem<"Geom","olGeomSimpleGeometry",typeof olGeomRaw.SimpleGeometry>;
// };
// type CatalogueOlStyle = {
//   olStyleCircle: NewCatalogueItem<
//     "Style",
//     "olStyleCircle",
//     typeof olStyleRaw.Circle
//   >;
//   olStyleFill: NewCatalogueItem<"Style", "olStyleFill", typeof olStyleRaw.Fill>;
//   olStyleIcon: NewCatalogueItem<"Style", "olStyleIcon", typeof olStyleRaw.Icon>;
//   // olStyleIconImage: NewCatalogueItem<"Style","olStyleIconImage",typeof olStyleRaw.IconImage>;
//   // olStyleImage: NewCatalogueItem<"Style","olStyleImage",typeof olStyleRaw.Image>;
//   olStyleRegularShape: NewCatalogueItem<
//     "Style",
//     "olStyleRegularShape",
//     typeof olStyleRaw.RegularShape
//   >;
//   olStyleStroke: NewCatalogueItem<
//     "Style",
//     "olStyleStroke",
//     typeof olStyleRaw.Stroke
//   >;
//   olStyleStyle: NewCatalogueItem<
//     "Style",
//     "olStyleStyle",
//     typeof olStyleRaw.Style
//   >;
//   olStyleText: NewCatalogueItem<"Style", "olStyleText", typeof olStyleRaw.Text>;
// };

// /////////////////////////////////////////////////////////////////////////////
// Finished, now some additional stuff

export type Catalogue = CatalogueOl &
  CatalogueOlLayer &
  CatalogueOlControl &
  CatalogueOlInteraction &
  CatalogueOlSource &
  CatalogueOlGeom &
  CatalogueOlStyle;

export type CatalogueKey = keyof Catalogue;
export type CatalogueItem = Catalogue[CatalogueKey];

// /////////////////////////////////////////////////////////////////////////////
// Catalogue Value

const catalogueOl = Object.fromEntries(
  Object.entries(ol).map(([key, value]) => [
    `ol${upperFirst(key)}`,
    {
      kind: key,
      type: `ol${upperFirst(key)}`,
      object: value,
    },
  ])
) as CatalogueOl;

const catalogueOlLayer = Object.fromEntries(
  Object.entries(olLayer).map(([key, value]) => [
    `olLayer${upperFirst(key)}`,
    {
      kind: "Layer",
      type: `olLayer${upperFirst(key)}`,
      object: value,
    },
  ])
) as CatalogueOlLayer;

const catalogueOlControl = Object.fromEntries(
  Object.entries(olControl).map(([key, value]) => [
    `olControl${upperFirst(key)}`,
    {
      kind: "Control",
      type: `olControl${upperFirst(key)}`,
      object: value,
    },
  ])
) as CatalogueOlControl;

const catalogueOlInteraction = Object.fromEntries(
  Object.entries(olInteraction).map(([key, value]) => [
    `olInteraction${upperFirst(key)}`,
    {
      kind: "Interaction",
      type: `olInteraction${upperFirst(key)}`,
      object: value,
    },
  ])
) as CatalogueOlInteraction;

const catalogueOlSource = Object.fromEntries(
  Object.entries(olSource).map(([key, value]) => [
    `olSource${upperFirst(key)}`,
    {
      kind: "Source",
      type: `olSource${upperFirst(key)}`,
      object: value,
    },
  ])
) as CatalogueOlSource;

const catalogueOlGeom = Object.fromEntries(
  Object.entries(olGeom).map(([key, value]) => [
    `olGeom${upperFirst(key)}`,
    {
      kind: "Geom",
      type: `olGeom${upperFirst(key)}`,
      object: value,
    },
  ])
) as CatalogueOlGeom;

const catalogueOlStyle = Object.fromEntries(
  Object.entries(olStyle).map(([key, value]) => [
    `olStyle${upperFirst(key)}`,
    {
      kind: "Style",
      type: `olStyle${upperFirst(key)}`,
      object: value,
    },
  ])
) as CatalogueOlStyle;

// eslint-disable-next-line import/no-mutable-exports
export const catalogue: Catalogue = {
  ...catalogueOl,
  ...catalogueOlLayer,
  ...catalogueOlControl,
  ...catalogueOlInteraction,
  ...catalogueOlSource,
  ...catalogueOlGeom,
  ...catalogueOlStyle,
};

/// ////////////////////////////////////////////////////////////////////////////

// /// ////////////////////////////////////////////////////////////////////////////
// // A way to extend the catalogue
// export const extend = <T>(objects: { [key: string]: T }): void => {
//   // Cleanup the input
//   const cleanedUpObjects = fromPairs(
//     map(<U>([key, value]: [string, U | CatalogueItem<U>]): [
//       string,
//       CatalogueItem<U>
//     ] => {
//       if (!isObject((value as CatalogueItem<U>).object)) {
//         // If it's directly an object we put it nicely in a catalogue item
//         return [
//           lowerFirst(key),
//           {
//             type: lowerFirst(key),
//             kind: null,
//             object: value as U,
//           },
//         ];
//       }
//       // If it's already a catalogue item it's good
//       return [
//         lowerFirst(key),
//         { kind: null, ...(value as CatalogueItem<U>), type: lowerFirst(key) },
//       ];
//     }, toPairs(objects))
//   );
//   // Update the catalogue
//   catalogue = { ...catalogue, ...cleanedUpObjects };
// };

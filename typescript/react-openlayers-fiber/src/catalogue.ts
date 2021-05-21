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
// Here we omit abstract base classes, utility classes and other weird stuff
const ol = omit(
  [
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
  ],
  olRaw
);
const olLayer = omit(["defaults"], olLayerRaw);
const olControl = omit(["defaults"], olControlRaw);
const olInteraction = omit(["defaults"], olInteractionRaw);
const olSource = omit(["defaults", "Image", "Source", "Tile"], olSourceRaw);
const olGeom = omit(["defaults", "Geometry", "SimpleGeometry"], olGeomRaw);
const olStyle = omit(["defaults", "Image", "IconImage"], olStyleRaw);

// /////////////////////////////////////////////////////////////////////////////
// Catalogue Type
export type Kind =
  // Elements of Ol that we picked manually
  | keyof typeof ol
  // Or the categories of Ol items explained in https://openlayers.org/en/latest/apidoc/
  | "Layer"
  | "Control"
  | "Interaction"
  | "Source"
  | "Geom"
  | "Style";
// | null;

export type CatalogueItem<T> = {
  kind: Kind;
  type: string;
  object: T;
};

// Now we generate the types automatically (This parts needs typescript >=4.1)
type CatalogueOl = {
  [K in keyof typeof ol as `ol${Capitalize<K>}`]: CatalogueItem<typeof ol[K]>;
};
type CatalogueOlLayer = {
  [K in keyof typeof olLayer as `olLayer${Capitalize<K>}`]: CatalogueItem<
    typeof olLayer[K]
  >;
};
type CatalogueOlControl = {
  [K in keyof typeof olControl as `olControl${Capitalize<K>}`]: CatalogueItem<
    typeof olControl[K]
  >;
};
type CatalogueOlInteraction = {
  [K in keyof typeof olInteraction as `olInteraction${Capitalize<K>}`]: CatalogueItem<
    typeof olInteraction[K]
  >;
};
type CatalogueOlSource = {
  [K in keyof typeof olSource as `olSource${Capitalize<K>}`]: CatalogueItem<
    typeof olSource[K]
  >;
};
type CatalogueOlGeom = {
  [K in keyof typeof olGeom as `olGeom${Capitalize<K>}`]: CatalogueItem<
    typeof olGeom[K]
  >;
};
type CatalogueOlStyle = {
  [K in keyof typeof olStyle as `olStyle${Capitalize<K>}`]: CatalogueItem<
    typeof olStyle[K]
  >;
};

// With typescript <4.1 we have to do this:
// type CatalogueOl = {
//   olCollection: CatalogueItem<typeof olRaw.Collection>;
//   olFeature: CatalogueItem<typeof olRaw.Feature>;
//   olGeolocation: CatalogueItem<typeof olRaw.Geolocation>;
//   olMap: CatalogueItem<typeof olRaw.Map>;
//   olObject: CatalogueItem<typeof olRaw.Object>;
//   olObservable: CatalogueItem<typeof olRaw.Observable>;
//   olOverlay: CatalogueItem<typeof olRaw.Overlay>;
//   olPluggableMap: CatalogueItem<typeof olRaw.PluggableMap>;
//   olTileCache: CatalogueItem<typeof olRaw.TileCache>;
//   olView: CatalogueItem<typeof olRaw.View>;
// };
// type CatalogueOlLayer = {
//   olLayerGraticule: CatalogueItem<typeof olLayerRaw.Graticule>;
//   olLayerGroup: CatalogueItem<typeof olLayerRaw.Group>;
//   olLayerHeatmap: CatalogueItem<typeof olLayerRaw.Heatmap>;
//   olLayerImage: CatalogueItem<typeof olLayerRaw.Image>;
//   olLayerLayer: CatalogueItem<typeof olLayerRaw.Layer>;
//   olLayerMapboxVector: CatalogueItem<typeof olLayerRaw.MapboxVector>;
//   olLayerTile: CatalogueItem<typeof olLayerRaw.Tile>;
//   olLayerVector: CatalogueItem<typeof olLayerRaw.Vector>;
//   olLayerVectorImage: CatalogueItem<typeof olLayerRaw.VectorImage>;
//   olLayerVectorTile: CatalogueItem<typeof olLayerRaw.VectorTile>;
//   olLayerWebGLPoints: CatalogueItem<typeof olLayerRaw.WebGLPoints>;
// };
// type CatalogueOlControl = {
//   olControlAttribution: CatalogueItem<typeof olControlRaw.Attribution>;
//   olControlControl: CatalogueItem<typeof olControlRaw.Control>;
//   olControlFullScreen: CatalogueItem<typeof olControlRaw.FullScreen>;
//   olControlMousePosition: CatalogueItem<typeof olControlRaw.MousePosition>;
//   olControlOverviewMap: CatalogueItem<typeof olControlRaw.OverviewMap>;
//   olControlRotate: CatalogueItem<typeof olControlRaw.Rotate>;
//   olControlScaleLine: CatalogueItem<typeof olControlRaw.ScaleLine>;
//   olControlZoom: CatalogueItem<typeof olControlRaw.Zoom>;
//   olControlZoomSlider: CatalogueItem<typeof olControlRaw.ZoomSlider>;
//   olControlZoomToExtent: CatalogueItem<typeof olControlRaw.ZoomToExtent>;
// };
// type CatalogueOlInteraction = {
//   olInteractionDoubleClickZoom: CatalogueItem<
//     typeof olInteractionRaw.DoubleClickZoom
//   >;
//   olInteractionDragAndDrop: CatalogueItem<typeof olInteractionRaw.DragAndDrop>;
//   olInteractionDragBox: CatalogueItem<typeof olInteractionRaw.DragBox>;
//   olInteractionDragPan: CatalogueItem<typeof olInteractionRaw.DragPan>;
//   olInteractionDragRotate: CatalogueItem<typeof olInteractionRaw.DragRotate>;
//   olInteractionDragRotateAndZoom: CatalogueItem<
//     typeof olInteractionRaw.DragRotateAndZoom
//   >;
//   olInteractionDragZoom: CatalogueItem<typeof olInteractionRaw.DragZoom>;
//   olInteractionDraw: CatalogueItem<typeof olInteractionRaw.Draw>;
//   olInteractionExtent: CatalogueItem<typeof olInteractionRaw.Extent>;
//   olInteractionInteraction: CatalogueItem<typeof olInteractionRaw.Interaction>;
//   olInteractionKeyboardPan: CatalogueItem<typeof olInteractionRaw.KeyboardPan>;
//   olInteractionKeyboardZoom: CatalogueItem<
//     typeof olInteractionRaw.KeyboardZoom
//   >;
//   olInteractionModify: CatalogueItem<typeof olInteractionRaw.Modify>;
//   olInteractionMouseWheelZoom: CatalogueItem<
//     typeof olInteractionRaw.MouseWheelZoom
//   >;
//   olInteractionPinchRotate: CatalogueItem<typeof olInteractionRaw.PinchRotate>;
//   olInteractionPinchZoom: CatalogueItem<typeof olInteractionRaw.PinchZoom>;
//   olInteractionPointer: CatalogueItem<typeof olInteractionRaw.Pointer>;
//   olInteractionSelect: CatalogueItem<typeof olInteractionRaw.Select>;
//   olInteractionSnap: CatalogueItem<typeof olInteractionRaw.Snap>;
//   olInteractionTranslate: CatalogueItem<typeof olInteractionRaw.Translate>;
// };
// type CatalogueOlSource = {
//   olSourceBingMaps: CatalogueItem<typeof olSourceRaw.BingMaps>;
//   olSourceCartoDB: CatalogueItem<typeof olSourceRaw.CartoDB>;
//   olSourceCluster: CatalogueItem<typeof olSourceRaw.Cluster>;
//   olSourceIIIF: CatalogueItem<typeof olSourceRaw.IIIF>;
//   // olSourceImage: CatalogueItem<typeof olSourceRaw.Image>;
//   olSourceImageArcGISRest: CatalogueItem<typeof olSourceRaw.ImageArcGISRest>;
//   olSourceImageCanvas: CatalogueItem<typeof olSourceRaw.ImageCanvas>;
//   olSourceImageMapGuide: CatalogueItem<typeof olSourceRaw.ImageMapGuide>;
//   olSourceImageStatic: CatalogueItem<typeof olSourceRaw.ImageStatic>;
//   olSourceImageWMS: CatalogueItem<typeof olSourceRaw.ImageWMS>;
//   olSourceOSM: CatalogueItem<typeof olSourceRaw.OSM>;
//   olSourceRaster: CatalogueItem<typeof olSourceRaw.Raster>;
//   // olSourceSource: CatalogueItem<typeof olSourceRaw.Source>;
//   olSourceStamen: CatalogueItem<typeof olSourceRaw.Stamen>;
//   // olSourceTile: CatalogueItem<typeof olSourceRaw.Tile>;
//   olSourceTileArcGISRest: CatalogueItem<typeof olSourceRaw.TileArcGISRest>;
//   olSourceTileDebug: CatalogueItem<typeof olSourceRaw.TileDebug>;
//   olSourceTileImage: CatalogueItem<typeof olSourceRaw.TileImage>;
//   olSourceTileJSON: CatalogueItem<typeof olSourceRaw.TileJSON>;
//   olSourceTileWMS: CatalogueItem<typeof olSourceRaw.TileWMS>;
//   olSourceUrlTile: CatalogueItem<typeof olSourceRaw.UrlTile>;
//   olSourceUTFGrid: CatalogueItem<typeof olSourceRaw.UTFGrid>;
//   olSourceVector: CatalogueItem<typeof olSourceRaw.Vector>;
//   olSourceVectorTile: CatalogueItem<typeof olSourceRaw.VectorTile>;
//   olSourceWMTS: CatalogueItem<typeof olSourceRaw.WMTS>;
//   olSourceXYZ: CatalogueItem<typeof olSourceRaw.XYZ>;
//   olSourceZoomify: CatalogueItem<typeof olSourceRaw.Zoomify>;
// };
// type CatalogueOlGeom = {
//   olGeomCircle: CatalogueItem<typeof olGeomRaw.Circle>;
//   // olGeomGeometry: CatalogueItem<typeof olGeomRaw.Geometry>;
//   olGeomGeometryCollection: CatalogueItem<typeof olGeomRaw.GeometryCollection>;
//   olGeomLinearRing: CatalogueItem<typeof olGeomRaw.LinearRing>;
//   olGeomLineString: CatalogueItem<typeof olGeomRaw.LineString>;
//   olGeomMultiLineString: CatalogueItem<typeof olGeomRaw.MultiLineString>;
//   olGeomMultiPoint: CatalogueItem<typeof olGeomRaw.MultiPoint>;
//   olGeomMultiPolygon: CatalogueItem<typeof olGeomRaw.MultiPolygon>;
//   olGeomPoint: CatalogueItem<typeof olGeomRaw.Point>;
//   olGeomPolygon: CatalogueItem<typeof olGeomRaw.Polygon>;
//   // olGeomSimpleGeometry: CatalogueItem<typeof olGeomRaw.SimpleGeometry>;
// };
// type CatalogueOlStyle = {
//   olStyleCircle: CatalogueItem<typeof olStyleRaw.Circle>;
//   olStyleFill: CatalogueItem<typeof olStyleRaw.Fill>;
//   olStyleIcon: CatalogueItem<typeof olStyleRaw.Icon>;
//   // olStyleIconImage: CatalogueItem<typeof olStyleRaw.IconImage>;
//   // olStyleImage: CatalogueItem<typeof olStyleRaw.Image>;
//   olStyleRegularShape: CatalogueItem<typeof olStyleRaw.RegularShape>;
//   olStyleStroke: CatalogueItem<typeof olStyleRaw.Stroke>;
//   olStyleStyle: CatalogueItem<typeof olStyleRaw.Style>;
//   olStyleText: CatalogueItem<typeof olStyleRaw.Text>;
// };

// Finished, now some additional stuff
export type Catalogue = CatalogueOl &
  CatalogueOlLayer &
  CatalogueOlControl &
  CatalogueOlInteraction &
  CatalogueOlSource &
  CatalogueOlGeom &
  CatalogueOlStyle;
export type CatalogueKey = keyof Catalogue;

// /////////////////////////////////////////////////////////////////////////////
// Catalogue Value
const catalogueOl: CatalogueOl = Object.fromEntries(
  Object.entries(ol).map(([key, value]) => [
    `ol${upperFirst(key)}`,
    {
      kind: key,
      type: `ol${upperFirst(key)}`,
      object: value,
    },
  ])
);

const catalogueOlLayer: CatalogueOlLayer = Object.fromEntries(
  Object.entries(olLayer).map(([key, value]) => [
    `olLayer${upperFirst(key)}`,
    {
      kind: "Layer",
      type: `olLayer${upperFirst(key)}`,
      object: value,
    },
  ])
);

const catalogueOlControl: CatalogueOlControl = Object.fromEntries(
  Object.entries(olControl).map(([key, value]) => [
    `olControl${upperFirst(key)}`,
    {
      kind: "Control",
      type: `olControl${upperFirst(key)}`,
      object: value,
    },
  ])
) as CatalogueOlControl; // FIXME: Not sure why it is needed here

const catalogueOlInteraction: CatalogueOlInteraction = Object.fromEntries(
  Object.entries(olInteraction).map(([key, value]) => [
    `olInteraction${upperFirst(key)}`,
    {
      kind: "Interaction",
      type: `olInteraction${upperFirst(key)}`,
      object: value,
    },
  ])
) as CatalogueOlInteraction; // FIXME: Not sure why it is needed here

const catalogueOlSource: CatalogueOlSource = Object.fromEntries(
  Object.entries(olSource).map(([key, value]) => [
    `olSource${upperFirst(key)}`,
    {
      kind: "Source",
      type: `olSource${upperFirst(key)}`,
      object: value,
    },
  ])
);

const catalogueOlGeom: CatalogueOlGeom = Object.fromEntries(
  Object.entries(olGeom).map(([key, value]) => [
    `olGeom${upperFirst(key)}`,
    {
      kind: "Geom",
      type: `olGeom${upperFirst(key)}`,
      object: value,
    },
  ])
);

const catalogueOlStyle: CatalogueOlStyle = Object.fromEntries(
  Object.entries(olStyle).map(([key, value]) => [
    `olStyle${upperFirst(key)}`,
    {
      kind: "Style",
      type: `olStyle${upperFirst(key)}`,
      object: value,
    },
  ])
);

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

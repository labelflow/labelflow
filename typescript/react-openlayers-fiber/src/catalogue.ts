// /////////////////////////////////////////////////////////////////////////////
// The catalogue is the list of object from openlayers that are supported
// it is generated automatically, and is strongly typed
//
import {
  upperFirst,
  toPairs,
  fromPairs,
  map,
  lowerFirst,
  isObject,
  omit,
} from "lodash/fp";
// /////////////////////////////////////////////////////////////////////////////
// Import stuff we want to use from Openlayers
// Here we omit abstract base classes, utility classes and other weird stuff
import * as olTemp from "ol";
//
import * as olLayerTemp from "ol/layer";
//
import * as olControlTemp from "ol/control";
//
import * as olInteractionTemp from "ol/interaction";
//
import * as olSourceTemp from "ol/source";
//
import * as olGeomTemp from "ol/geom";
//
import * as olStyleTemp from "ol/style";

const ol = omit(
  [
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
  olTemp
);
const olLayer = olLayerTemp;
const olControl = omit(["defaults"], olControlTemp);
const olInteraction = omit(["defaults"], olInteractionTemp);
const olSource = omit(["Image", "Source", "Tile"], olSourceTemp);
const olGeom = omit(["Geometry", "SimpleGeometry"], olGeomTemp);

const olStyle = omit(["Image", "IconImage"], olStyleTemp);

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
  | "Style"
  | null;

export type CatalogueItem<T> = {
  kind: Kind;
  type: string;
  object: T;
};

// Now we generate the types automatically (This parts needs typescript >=4.1)
// type CatalogueOl = {
//   [K in keyof typeof ol as `ol${Capitalize<K>}`]: CatalogueItem<typeof ol[K]>
// }
// type CatalogueOlLayer = {
//   [K in keyof typeof olLayer as `olLayer${Capitalize<K>}`]: CatalogueItem<typeof olLayer[K]>
// }
// type CatalogueOlControl = {
//   [K in keyof typeof olControl as `olControl${Capitalize<K>}`]: CatalogueItem<typeof olControl[K]>
// }
// type CatalogueOlInteraction = {
//   [K in keyof typeof olInteraction as `olInteraction${Capitalize<K>}`]: CatalogueItem<typeof olInteraction[K]>
// }
// type CatalogueOlSource = {
//   [K in keyof typeof olSource as `olSource${Capitalize<K>}`]: CatalogueItem<typeof olSource[K]>
// }
// type CatalogueOlGeom = {
//   [K in keyof typeof olGeom as `olGeom${Capitalize<K>}`]: CatalogueItem<typeof olGeom[K]>
// }
// type CatalogueOlStyle = {
//   [K in keyof typeof olStyle as `olStyle${Capitalize<K>}`]: CatalogueItem<typeof olStyle[K]>
// }

// With typescript <4.1 we have to do this:
type CatalogueOl = {
  olCollection: CatalogueItem<typeof olTemp.Collection>;
  olFeature: CatalogueItem<typeof olTemp.Feature>;
  olGeolocation: CatalogueItem<typeof olTemp.Geolocation>;
  olMap: CatalogueItem<typeof olTemp.Map>;
  olObject: CatalogueItem<typeof olTemp.Object>;
  olObservable: CatalogueItem<typeof olTemp.Observable>;
  olOverlay: CatalogueItem<typeof olTemp.Overlay>;
  olPluggableMap: CatalogueItem<typeof olTemp.PluggableMap>;
  olTileCache: CatalogueItem<typeof olTemp.TileCache>;
  olView: CatalogueItem<typeof olTemp.View>;
};
type CatalogueOlLayer = {
  olLayerGraticule: CatalogueItem<typeof olLayerTemp.Graticule>;
  olLayerGroup: CatalogueItem<typeof olLayerTemp.Group>;
  olLayerHeatmap: CatalogueItem<typeof olLayerTemp.Heatmap>;
  olLayerImage: CatalogueItem<typeof olLayerTemp.Image>;
  olLayerLayer: CatalogueItem<typeof olLayerTemp.Layer>;
  olLayerMapboxVector: CatalogueItem<typeof olLayerTemp.MapboxVector>;
  olLayerTile: CatalogueItem<typeof olLayerTemp.Tile>;
  olLayerVector: CatalogueItem<typeof olLayerTemp.Vector>;
  olLayerVectorImage: CatalogueItem<typeof olLayerTemp.VectorImage>;
  olLayerVectorTile: CatalogueItem<typeof olLayerTemp.VectorTile>;
  olLayerWebGLPoints: CatalogueItem<typeof olLayerTemp.WebGLPoints>;
};
type CatalogueOlControl = {
  olControlAttribution: CatalogueItem<typeof olControlTemp.Attribution>;
  olControlControl: CatalogueItem<typeof olControlTemp.Control>;
  olControlFullScreen: CatalogueItem<typeof olControlTemp.FullScreen>;
  olControlMousePosition: CatalogueItem<typeof olControlTemp.MousePosition>;
  olControlOverviewMap: CatalogueItem<typeof olControlTemp.OverviewMap>;
  olControlRotate: CatalogueItem<typeof olControlTemp.Rotate>;
  olControlScaleLine: CatalogueItem<typeof olControlTemp.ScaleLine>;
  olControlZoom: CatalogueItem<typeof olControlTemp.Zoom>;
  olControlZoomSlider: CatalogueItem<typeof olControlTemp.ZoomSlider>;
  olControlZoomToExtent: CatalogueItem<typeof olControlTemp.ZoomToExtent>;
};
type CatalogueOlInteraction = {
  olInteractionDoubleClickZoom: CatalogueItem<
    typeof olInteractionTemp.DoubleClickZoom
  >;
  olInteractionDragAndDrop: CatalogueItem<typeof olInteractionTemp.DragAndDrop>;
  olInteractionDragBox: CatalogueItem<typeof olInteractionTemp.DragBox>;
  olInteractionDragPan: CatalogueItem<typeof olInteractionTemp.DragPan>;
  olInteractionDragRotate: CatalogueItem<typeof olInteractionTemp.DragRotate>;
  olInteractionDragRotateAndZoom: CatalogueItem<
    typeof olInteractionTemp.DragRotateAndZoom
  >;
  olInteractionDragZoom: CatalogueItem<typeof olInteractionTemp.DragZoom>;
  olInteractionDraw: CatalogueItem<typeof olInteractionTemp.Draw>;
  olInteractionExtent: CatalogueItem<typeof olInteractionTemp.Extent>;
  olInteractionInteraction: CatalogueItem<typeof olInteractionTemp.Interaction>;
  olInteractionKeyboardPan: CatalogueItem<typeof olInteractionTemp.KeyboardPan>;
  olInteractionKeyboardZoom: CatalogueItem<
    typeof olInteractionTemp.KeyboardZoom
  >;
  olInteractionModify: CatalogueItem<typeof olInteractionTemp.Modify>;
  olInteractionMouseWheelZoom: CatalogueItem<
    typeof olInteractionTemp.MouseWheelZoom
  >;
  olInteractionPinchRotate: CatalogueItem<typeof olInteractionTemp.PinchRotate>;
  olInteractionPinchZoom: CatalogueItem<typeof olInteractionTemp.PinchZoom>;
  olInteractionPointer: CatalogueItem<typeof olInteractionTemp.Pointer>;
  olInteractionSelect: CatalogueItem<typeof olInteractionTemp.Select>;
  olInteractionSnap: CatalogueItem<typeof olInteractionTemp.Snap>;
  olInteractionTranslate: CatalogueItem<typeof olInteractionTemp.Translate>;
};
type CatalogueOlSource = {
  olSourceBingMaps: CatalogueItem<typeof olSourceTemp.BingMaps>;
  olSourceCartoDB: CatalogueItem<typeof olSourceTemp.CartoDB>;
  olSourceCluster: CatalogueItem<typeof olSourceTemp.Cluster>;
  olSourceIIIF: CatalogueItem<typeof olSourceTemp.IIIF>;
  // olSourceImage: CatalogueItem<typeof olSourceTemp.Image>;
  olSourceImageArcGISRest: CatalogueItem<typeof olSourceTemp.ImageArcGISRest>;
  olSourceImageCanvas: CatalogueItem<typeof olSourceTemp.ImageCanvas>;
  olSourceImageMapGuide: CatalogueItem<typeof olSourceTemp.ImageMapGuide>;
  olSourceImageStatic: CatalogueItem<typeof olSourceTemp.ImageStatic>;
  olSourceImageWMS: CatalogueItem<typeof olSourceTemp.ImageWMS>;
  olSourceOSM: CatalogueItem<typeof olSourceTemp.OSM>;
  olSourceRaster: CatalogueItem<typeof olSourceTemp.Raster>;
  // olSourceSource: CatalogueItem<typeof olSourceTemp.Source>;
  olSourceStamen: CatalogueItem<typeof olSourceTemp.Stamen>;
  // olSourceTile: CatalogueItem<typeof olSourceTemp.Tile>;
  olSourceTileArcGISRest: CatalogueItem<typeof olSourceTemp.TileArcGISRest>;
  olSourceTileDebug: CatalogueItem<typeof olSourceTemp.TileDebug>;
  olSourceTileImage: CatalogueItem<typeof olSourceTemp.TileImage>;
  olSourceTileJSON: CatalogueItem<typeof olSourceTemp.TileJSON>;
  olSourceTileWMS: CatalogueItem<typeof olSourceTemp.TileWMS>;
  olSourceUrlTile: CatalogueItem<typeof olSourceTemp.UrlTile>;
  olSourceUTFGrid: CatalogueItem<typeof olSourceTemp.UTFGrid>;
  olSourceVector: CatalogueItem<typeof olSourceTemp.Vector>;
  olSourceVectorTile: CatalogueItem<typeof olSourceTemp.VectorTile>;
  olSourceWMTS: CatalogueItem<typeof olSourceTemp.WMTS>;
  olSourceXYZ: CatalogueItem<typeof olSourceTemp.XYZ>;
  olSourceZoomify: CatalogueItem<typeof olSourceTemp.Zoomify>;
};
type CatalogueOlGeom = {
  olGeomCircle: CatalogueItem<typeof olGeomTemp.Circle>;
  // olGeomGeometry: CatalogueItem<typeof olGeomTemp.Geometry>;
  olGeomGeometryCollection: CatalogueItem<typeof olGeomTemp.GeometryCollection>;
  olGeomLinearRing: CatalogueItem<typeof olGeomTemp.LinearRing>;
  olGeomLineString: CatalogueItem<typeof olGeomTemp.LineString>;
  olGeomMultiLineString: CatalogueItem<typeof olGeomTemp.MultiLineString>;
  olGeomMultiPoint: CatalogueItem<typeof olGeomTemp.MultiPoint>;
  olGeomMultiPolygon: CatalogueItem<typeof olGeomTemp.MultiPolygon>;
  olGeomPoint: CatalogueItem<typeof olGeomTemp.Point>;
  olGeomPolygon: CatalogueItem<typeof olGeomTemp.Polygon>;
  // olGeomSimpleGeometry: CatalogueItem<typeof olGeomTemp.SimpleGeometry>;
};
type CatalogueOlStyle = {
  olStyleCircle: CatalogueItem<typeof olStyleTemp.Circle>;
  olStyleFill: CatalogueItem<typeof olStyleTemp.Fill>;
  olStyleIcon: CatalogueItem<typeof olStyleTemp.Icon>;
  // olStyleIconImage: CatalogueItem<typeof olStyleTemp.IconImage>;
  // olStyleImage: CatalogueItem<typeof olStyleTemp.Image>;
  olStyleRegularShape: CatalogueItem<typeof olStyleTemp.RegularShape>;
  olStyleStroke: CatalogueItem<typeof olStyleTemp.Stroke>;
  olStyleStyle: CatalogueItem<typeof olStyleTemp.Style>;
  olStyleText: CatalogueItem<typeof olStyleTemp.Text>;
};

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
const catalogueOl = fromPairs(
  map(
    <T>([key, value]: [string, T]): [string, CatalogueItem<T>] => [
      `ol${upperFirst(key)}`,
      { kind: key as Kind, type: `ol${upperFirst(key)}`, object: value },
    ],
    toPairs(ol)
  )
) as CatalogueOl;

const catalogueOlLayer = fromPairs(
  map(
    <T>([key, value]: [string, T]): [string, CatalogueItem<T>] => [
      `olLayer${upperFirst(key)}`,
      {
        kind: "Layer" as Kind,
        type: `olLayer${upperFirst(key)}`,
        object: value,
      },
    ],
    toPairs(olLayer)
  )
) as CatalogueOlLayer;

const catalogueOlControl = fromPairs(
  map(
    <T>([key, value]: [string, T]): [string, CatalogueItem<T>] => [
      `olControl${upperFirst(key)}`,
      {
        kind: "Control" as Kind,
        type: `olControl${upperFirst(key)}`,
        object: value,
      },
    ],
    toPairs(olControl)
  )
) as CatalogueOlControl;

const catalogueOlInteraction = fromPairs(
  map(
    <T>([key, value]: [string, T]): [string, CatalogueItem<T>] => [
      `olInteraction${upperFirst(key)}`,
      {
        kind: "Interaction" as Kind,
        type: `olInteraction${upperFirst(key)}`,
        object: value,
      },
    ],
    toPairs(olInteraction)
  )
) as CatalogueOlInteraction;

const catalogueOlSource = fromPairs(
  map(
    <T>([key, value]: [string, T]): [string, CatalogueItem<T>] => [
      `olSource${upperFirst(key)}`,
      {
        kind: "Source" as Kind,
        type: `olSource${upperFirst(key)}`,
        object: value,
      },
    ],
    toPairs(olSource)
  )
) as unknown as CatalogueOlSource;

const catalogueOlGeom = fromPairs(
  map(
    <T>([key, value]: [string, T]): [string, CatalogueItem<T>] => [
      `olGeom${upperFirst(key)}`,
      { kind: "Geom" as Kind, type: `olGeom${upperFirst(key)}`, object: value },
    ],
    toPairs(olGeom)
  )
) as unknown as CatalogueOlGeom;

const catalogueOlStyle = fromPairs(
  map(
    <T>([key, value]: [string, T]): [string, CatalogueItem<T>] => [
      `olStyle${upperFirst(key)}`,
      {
        kind: "Style" as Kind,
        type: `olStyle${upperFirst(key)}`,
        object: value,
      },
    ],
    toPairs(olStyle)
  )
) as unknown as CatalogueOlStyle;

// eslint-disable-next-line import/no-mutable-exports
export let catalogue: Catalogue = {
  ...catalogueOl,
  ...catalogueOlLayer,
  ...catalogueOlControl,
  ...catalogueOlInteraction,
  ...catalogueOlSource,
  ...catalogueOlGeom,
  ...catalogueOlStyle,
};

/// ////////////////////////////////////////////////////////////////////////////

/// ////////////////////////////////////////////////////////////////////////////
// A way to extend the catalogue
export const extend = <T>(objects: { [key: string]: T }): void => {
  // Cleanup the input
  const cleanedUpObjects = fromPairs(
    map(<U>([key, value]: [string, U | CatalogueItem<U>]): [
      string,
      CatalogueItem<U>
    ] => {
      if (!isObject((value as CatalogueItem<U>).object)) {
        // If it's directly an object we put it nicely in a catalogue item
        return [
          lowerFirst(key),
          {
            type: lowerFirst(key),
            kind: null,
            object: value as U,
          },
        ];
      }
      // If it's already a catalogue item it's good
      return [
        lowerFirst(key),
        { type: lowerFirst(key), kind: null, ...(value as CatalogueItem<U>) },
      ];
    }, toPairs(objects))
  );
  // Update the catalogue
  catalogue = { ...catalogue, ...cleanedUpObjects };
};

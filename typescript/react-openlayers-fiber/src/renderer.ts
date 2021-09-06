/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import ReactReconciler from "react-reconciler";
import { unstable_now as now } from "scheduler";
import {
  isFunction,
  isNil,
  isString,
  isArray,
  mapKeys,
  startsWith,
  upperFirst,
  size,
  keys,
  forEach,
  isPlainObject,
  has,
  lowerFirst,
  pickBy,
  flow,
} from "lodash/fp";

// Imports from the imperative lib
import { Map as OlMap, Object as OlObject } from "ol";

import { ReactOlFiber } from "./types";
import { catalogue, CatalogueKey, CatalogueItem, Catalogue } from "./catalogue";

export interface ObjectHash {
  [name: string]: OlObject;
}

export type Detach<
  ParentItem extends CatalogueItem,
  ChildItem extends CatalogueItem
> = (
  parent: Instance<ParentItem>,
  child: Instance<ChildItem, ParentItem> //  | TextInstance // But not used
) => void;

export type Attach<
  ParentItem extends CatalogueItem,
  ChildItem extends CatalogueItem
> =
  | string
  | ((
      parent: Omit<Instance<ParentItem>, typeof MetaOlFiber>,
      child: Omit<Instance<ChildItem, ParentItem>, typeof MetaOlFiber>,
      parentInstance: Instance<ParentItem>,
      childInstance: Instance<ChildItem, ParentItem>
    ) => Detach<ParentItem, ChildItem>);

// export type Attach =
//   | string
//   | ((
//       container: OlObject,
//       child: OlObject,
//       parentInstance: Instance,
//       childInstance: Instance
//     ) => Detach);

export type Type = keyof ReactOlFiber.IntrinsicElements;

export type Props = ReactOlFiber.IntrinsicElements[Type];

const MetaOlFiber = Symbol("MetaOlFiber");

export type Instance<
  SelfItem extends CatalogueItem = CatalogueItem,
  ParentItem extends CatalogueItem = CatalogueItem
> = InstanceType<SelfItem["object"]> & {
  [MetaOlFiber]: {
    kind: SelfItem["kind"];
    type: SelfItem["type"];
    parent?: Instance<ParentItem>;
    attach?: Attach<ParentItem, SelfItem>;
    detach?: Detach<ParentItem, SelfItem>;
  };
};

export type Container<Item extends CatalogueItem = CatalogueItem> =
  Instance<Item>;

// export type OpaqueHandle = Fiber;
export type OpaqueHandle = any;
export type TextInstance = null;
export type HydratableInstance<
  Item extends CatalogueItem = CatalogueItem,
  ParentItem extends CatalogueItem = CatalogueItem
> = Instance<Item, ParentItem>;
export type PublicInstance<
  Item extends CatalogueItem = CatalogueItem,
  ParentItem extends CatalogueItem = CatalogueItem
> = Instance<Item, ParentItem>;
export type SuspenseInstance<
  Item extends CatalogueItem = CatalogueItem,
  ParentItem extends CatalogueItem = CatalogueItem
> = Instance<Item, ParentItem>;
export type HostContext = {};
export type UpdatePayload = boolean;
export type ChildSet = void;
export type TimeoutHandle = number;
export type NoTimeout = number;

// export type Reconciler = HostConfig<
//   Type,
//   Props,
//   Container,
//   Instance,
//   TextInstance,
//   HydratableInstance,
//   PublicInstance,
//   HostContext,
//   UpdatePayload,
//   ChildSet,
//   TimeoutHandle,
//   NoTimeout
// >;

const instances = new Map<HTMLElement, OlMap>();
const emptyObject = {};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noOp = () => {};

const error002 = (containerType = "", childType = "") =>
  new Error(
    `React-Openlayers-Fiber Error: Couldn't add this child to this container. You can specify how to attach this type of child ("${childType}") to this type of container ("${containerType}") using the "attach" props. If you think this should be done automatically, open an issue here https://github.com/labelflow/react-openlayers-fiber/issues/new?title=Support+${childType}+in+${containerType}&body=Support+${childType}+in+${containerType}`
  );

const error001 = () =>
  new Error(
    `React-Openlayers-Fiber Error: Instance is null, is it a TextInstance ?`
  );

/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////
// Util functions
/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

const applyProp = (
  olObject: OlObject,
  olKey: string,
  propValue: unknown
): void => {
  const setterGeneric = olObject.set;
  const keySetter = `set${upperFirst(olKey)}`;
  const setterSpecificKey = (olObject as any)[keySetter];
  if (isFunction(setterSpecificKey)) {
    setterSpecificKey.bind(olObject)(propValue);
  } else if (isFunction(setterGeneric)) {
    setterGeneric.bind(olObject)(olKey, propValue);
  } else if (has(olKey, olObject)) {
    console.warn(
      `React-Openlayers-Fiber Warning: Setting the property "${olKey}" brutally because there is no setter on the object`
    );
    console.warn(olObject);
    // eslint-disable-next-line no-param-reassign
    (olObject as any)[olKey] = propValue;
  } else {
    console.error(
      `React-Openlayers-Fiber Error: Setting the property "${olKey}" very brutally because there is no setter on the object nor the object has this key... This is probably an error`
    );
    console.error(olObject);
    // eslint-disable-next-line no-param-reassign
    (olObject as any)[olKey] = propValue;
  }
};

/**
 *
 * This code checks, for every given props,
 * if the ol entity has a setter for the prop.
 * If it has one, it sets the value to the ol object,
 * but it only sets it if it changed from the previous props.
 *
 * @param olObject The ol object to update
 * @param newProps The newProps potentially containing new changes
 */
const applyProps = (
  olObject: OlObject,
  newProps: Props,
  oldProps: Props = {},
  isNewInstance = false
): void => {
  forEach((key) => {
    if (isNewInstance && key.substr(0, 7) === "initial") {
      const realKey = lowerFirst(key.substr(7));
      const olKey = startsWith("_", realKey) ? realKey.substring(1) : realKey;
      applyProp(olObject, olKey, newProps[key]);
    } else if (
      oldProps[key] !== newProps[key] &&
      key.substr(0, 7) !== "initial"
    ) {
      // For special cases (for example ol objects that have an option called "key"), we can add a "_" before.
      if (key.substr(0, 2) === "on") {
        const eventType = lowerFirst(key.substr(2).replace("_", ":"));
        if (isFunction(oldProps[key])) {
          olObject.un(
            eventType as any, // Not enough typing in ol to be precise enough here
            oldProps[key]
          );
        }
        if (isFunction(newProps[key])) {
          olObject.on(
            eventType as any, // Not enough typing in ol to be precise enough here
            newProps[key]
          );
        }
      } else {
        const olKey = startsWith("_", key) ? key.substring(1) : key;
        applyProp(olObject, olKey, newProps[key]);
      }
    }
  }, keys(newProps));
};

/**
 * This function is a no-op, it's just a type guard
 * It allows to force an instance to be considered by typescript
 * as being of a type from the catalogue
 * @param type
 * @param instance
 * @returns
 */
const getAs = <
  A extends CatalogueItem,
  B extends CatalogueItem,
  K extends CatalogueKey
>(
  _type: K,
  instance: Instance<A, B>
): Instance<Catalogue[K], B> => {
  return instance as unknown as Instance<Catalogue[K], B>;
};

const defaultAttach = <
  ParentItem extends CatalogueItem,
  ChildItem extends CatalogueItem
>(
  parent: Instance<ParentItem>,
  child: Instance<ChildItem, ParentItem>
): Detach<ParentItem, ChildItem> => {
  if (!child) throw error001();

  const { kind: parentKind } = parent[MetaOlFiber];
  const { kind: childKind } = child[MetaOlFiber];

  switch (parentKind) {
    case "Map": {
      switch (childKind) {
        case "View":
          getAs("olMap", parent).setView(getAs("olView", child));
          return (newParent) => getAs("olMap", newParent).unset("view"); // Dubious at best
        case "Layer":
          getAs("olMap", parent).addLayer(getAs("olLayerLayer", child));
          return (newParent, newChild) =>
            getAs("olMap", newParent).removeLayer(
              getAs("olLayerLayer", newChild)
            );
        case "Control":
          getAs("olMap", parent).addControl(getAs("olControlControl", child));
          return (newParent, newChild) =>
            getAs("olMap", newParent).removeControl(
              getAs("olControlControl", newChild)
            );
        case "Interaction":
          getAs("olMap", parent).addInteraction(
            getAs("olInteractionInteraction", child)
          );
          return (newParent, newChild) =>
            getAs("olMap", newParent).removeInteraction(
              getAs("olInteractionInteraction", newChild)
            );
        case "Overlay":
          getAs("olMap", parent).addOverlay(getAs("olOverlay", child));
          return (newParent, newChild) =>
            getAs("olMap", newParent).removeOverlay(
              getAs("olOverlay", newChild)
            );
        default:
          throw error002(parentKind, childKind);
      }
    }
    case "Layer": {
      switch (childKind) {
        case "Source":
          getAs("olLayerLayer", parent).setSource(
            // getAs("olSourceSource", child)
            getAs("olSourceVector", child)
          );
          return (newParent, _newChild) =>
            getAs("olLayerLayer", newParent).unset("source"); // Dubious at best
        default:
          throw error002(parentKind, childKind);
      }
    }
    case "Source": {
      switch (childKind) {
        case "Feature":
          getAs("olSourceVector", parent).addFeature(getAs("olFeature", child));
          return (newParent, newChild) =>
            getAs("olSourceVector", newParent).removeFeature(
              getAs("olFeature", newChild)
            ); // Dubious at best
        case "Source":
          getAs("olSourceCluster", parent).setSource(
            getAs("olSourceVector", child)
          );
          return (newParent, _newChild) =>
            getAs("olSourceCluster", newParent).unset("source"); // Dubious at best
        default:
          throw error002(parentKind, childKind);
      }
    }
    case "Feature": {
      switch (childKind) {
        case "Geom":
          getAs("olFeature", parent).setGeometry(
            // getAs("olGeomGeometry", child)
            getAs("olGeomGeometryCollection", child)
          );
          return (newParent, _newChild) =>
            getAs("olFeature", newParent).unset("geometry"); // Dubious at best
        default:
          throw error002(parentKind, childKind);
      }
    }
    default:
      throw error002(parentKind, childKind);
  }
};

/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////
// Hot Config functions
/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

const getPublicInstance = (
  instance: Instance | TextInstance
): PublicInstance => {
  if (!instance) throw error001();
  return instance;
};

// Not used as of today, feel free to implement something cool instead of this
const getRootHostContext = (_rootContainerInstance: Container): HostContext =>
  emptyObject;

// Not used as of today, feel free to implement something cool instead of this
const getChildHostContext = (
  parentHostContext: HostContext,
  type: Type,
  _rootContainerInstance: Container
): HostContext => {
  return typeof parentHostContext === "string"
    ? `${parentHostContext}.${type}`
    : type;
};

const prepareForCommit = (
  _containerInfo: Container
): Record<string, any> | null => {
  return null;
};

const resetAfterCommit = (_containerInfo: Container): void => {};

const createInstance = <SelfItem extends CatalogueItem>(
  type: SelfItem["type"] | "primitive" | "new",
  props: Props,
  _rootContainerInstance: Container | null,
  _hostContext: HostContext | null,
  _internalInstanceHandle: OpaqueHandle
): Instance<SelfItem> => {
  let olObject;
  let kind;

  if (type === "primitive") {
    // <primitive/> Elements like in react three fiber
    const { object } = props as ReactOlFiber.IntrinsicElements["primitive"];
    olObject = object;
    kind = null;
  } else if (type === "new") {
    // <new/> Elements like in react three fiber
    const { object: TheObjectClass, args } =
      props as ReactOlFiber.IntrinsicElements["new"];
    olObject = new TheObjectClass(...args);
    kind = null;
  } else {
    // <olMap/> and all other similar elements from ol
    const { args, constructFrom, attach, onUpdate, children, ...otherProps } =
      props as ReactOlFiber.IntrinsicElementsArgsObject[keyof ReactOlFiber.IntrinsicElementsArgsObject];

    const target = catalogue[type as CatalogueKey];
    if (isNil(target)) {
      // Not found
      throw new Error(
        `React-Openlayers-Fiber Error: ${type} is not exported by ol. Use extend to add it if needed.`
      );
    } else if (isNil(constructFrom)) {
      // No constructFrom prop (most common)
      const initialProps = flow(
        pickBy((_value, propKey) => propKey.substr(0, 7) === "initial"),
        mapKeys((propKey: string) => lowerFirst(propKey.substr(7)))
      )(otherProps);

      const objectProps = {
        ...initialProps,
        ...mapKeys(
          (propKey: string) =>
            startsWith("_", propKey) ? propKey.substring(1) : propKey,
          pickBy(
            (_value, propKey) => propKey.substr(0, 7) !== "initial",
            otherProps
          )
        ),
      };

      if (isNil(args)) {
        // No args, simple ol object with a single options object arg
        olObject = new (target.object as new (arg: any) => any)(objectProps);
        kind = target.kind;
      } else if (isArray(args)) {
        // Args array
        olObject = new (target.object as new (...args2: any[]) => any)(...args);
        kind = target.kind;
      } else {
        // Single argument
        olObject = new (target.object as new (arg: any) => any)({
          ...objectProps,
          ...args,
        });
        kind = target.kind;
      }
    } else if (isFunction(target.object[constructFrom])) {
      // constructFrom prop is present
      // The static field exists on the class
      olObject = (
        target.object[constructFrom] as unknown as (
          ...t: typeof args
        ) => Instance
      )(...args);
      kind = target.kind;
    } else {
      // Static constructForm does not exist
      throw new Error(
        `React-Openlayers-Fiber Error: ${constructFrom} is not a constructor for ${target}`
      );
    }

    olObject[MetaOlFiber] = {
      kind,
      type,
      attach,
    };

    applyProps(olObject, otherProps, {}, true);
  }
  return olObject;
};

const finalizeInitialChildren = (
  _parentInstance: Instance,
  _type: Type,
  _props: Props,
  _rootContainerInstance: Container,
  _hostContext: HostContext
): boolean => {
  return false;
};

const prepareUpdate = (
  _instance: Instance,
  _type: Type,
  oldProps: Props,
  newProps: Props,
  _rootContainerInstance: Container,
  _hostContext: HostContext
): null | UpdatePayload => {
  const oldKeys = keys(oldProps);
  const newKeys = keys(newProps);

  // keys have same length
  if (size(oldKeys) !== size(newKeys)) {
    return true;
  } // keys are the same
  if (oldKeys.some((value, index) => newKeys[index] !== value)) {
    return true;
  }
  return oldKeys
    .filter((key) => key !== "children")
    .some((key) => oldProps[key] !== newProps[key]);
};

const shouldSetTextContent = (_type: Type, _props: Props): boolean => {
  return false;
};

// const shouldDeprioritizeSubtree = (_type: Type, _props: Props): boolean => {
//   return false;
// };

const createTextInstance = (
  _text: string,
  _rootContainerInstance: Container,
  _hostContext: HostContext,
  _internalInstanceHandle: OpaqueHandle
): TextInstance => {
  return null;
};

// const scheduleTimeout:
//   | ((handler: TimerHandler, timeout: number) => TimeoutHandle | NoTimeout)
//   | null = isFunction(setTimeout) ? setTimeout : null;

// const cancelTimeout: ((handle: TimeoutHandle | NoTimeout) => void) | null =
//   isFunction(clearTimeout) ? clearTimeout : null;

const scheduleTimeout = setTimeout;

const cancelTimeout = clearTimeout;

const noTimeout: NoTimeout = -1;

const commitTextUpdate = (
  _textInstance: TextInstance,
  _oldText: string,
  _newText: string
): void => {};

const commitMount = (
  _instance: Instance,
  _type: Type,
  _newProps: Props,
  _internalInstanceHandle: OpaqueHandle
): void => {};

const removeChild = <
  ParentItem extends CatalogueItem,
  ChildItem extends CatalogueItem
>(
  parent: Instance<ParentItem>,
  child: Instance<ChildItem, ParentItem> // | TextInstance | SuspenseInstance // FIXME one day
): void => {
  if (!child) throw error001();
  const { attach, detach } = child[MetaOlFiber];
  if (isFunction(detach)) {
    detach(parent, child);
  } else if (isString(attach)) {
    // eslint-disable-next-line no-param-reassign
    (parent as Record<string, any>)[attach] = undefined;
    // eslint-disable-next-line no-param-reassign
    delete (parent as Record<string, any>)[attach];
  } else {
    throw new Error(
      `React-Openlayers-Fiber Error: Couldn't remove this child from this container. You can specify how to detach this type of child ("${child.constructor.name}") from this type of container ("${parent.constructor.name}") using the "attach" props.`
    );
  }
};

const removeChildFromContainer = (
  _container: Container,
  child: Instance | TextInstance | SuspenseInstance
): void => {
  // Probably not neded
  // There can only be one map in its parent div
  (child as OlMap).setTarget(undefined);
  (child as OlMap).unset("target");
};

const appendChild = <
  ParentItem extends CatalogueItem,
  ChildItem extends CatalogueItem
>(
  parent: Instance<ParentItem>,
  child: Instance<ChildItem, ParentItem> | TextInstance
): void => {
  if (!child) throw error001();

  const { attach } = child[MetaOlFiber];

  // eslint-disable-next-line no-param-reassign
  child[MetaOlFiber].parent = parent;
  if (isNil(attach)) {
    // eslint-disable-next-line no-param-reassign
    child[MetaOlFiber].detach = defaultAttach(parent, child);
  } else if (isString(attach)) {
    const setterGeneric = (parent as any)?.set;
    const setterSpecific = (parent as any)?.[`set${upperFirst(attach)}`];
    if (isFunction(setterSpecific)) {
      // Example:   source.setLayer(x)
      setterSpecific.bind(parent)(child);
      // eslint-disable-next-line no-param-reassign
      child[MetaOlFiber].detach = (newParent, newChild) => {
        const unsetterSpecific = (newParent as any)?.[
          `unset${upperFirst(attach)}`
        ];
        if (isFunction(unsetterSpecific)) {
          unsetterSpecific.bind(newParent)(newChild);
        } else {
          setterSpecific.bind(newParent)(undefined);
        }
      };
    } else if (isFunction(setterGeneric)) {
      // Example:   source.set("layer",x)
      setterGeneric.bind(parent)(attach, child);
      // eslint-disable-next-line no-param-reassign
      child[MetaOlFiber].detach = (newParent, newChild) => {
        const unsetterGeneric = (newParent as any)?.unset;
        if (isFunction(unsetterGeneric)) {
          unsetterGeneric.bind(newParent)(attach, newChild);
        } else {
          setterGeneric.bind(newParent)(attach, undefined);
        }
      };
    } else {
      // Example:   source["layer"] = x
      console.warn(
        `React-Openlayers-Fiber Warning: Attaching the child ${attach} brutally because there is no setter on the object`
      );
      // eslint-disable-next-line no-param-reassign
      (parent as Record<string, any>)[attach] = child;
      // eslint-disable-next-line no-param-reassign
      child[MetaOlFiber].detach = (newParent, _newChild) => {
        // eslint-disable-next-line no-param-reassign
        (newParent as Record<string, any>)[attach] = undefined;
        // eslint-disable-next-line no-param-reassign
        delete (newParent as Record<string, any>)[attach];
      };
    }
  } else if (isFunction(attach)) {
    // eslint-disable-next-line no-param-reassign
    child[MetaOlFiber].detach = attach(parent, child, parent, child);
  } else {
    throw new Error(`React-Openlayers-Fiber Error: Unsupported "attach" type.`);
  }
};

// Code from react-three-fiber : https://github.com/pmndrs/react-three-fiber/blob/master/src/renderer.tsx#L450
function switchInstance<
  SelfItem extends CatalogueItem,
  ParentItem extends CatalogueItem
>(
  instance: Instance<SelfItem, ParentItem>,
  type: SelfItem["type"] | "primitive" | "new",
  newProps: any,
  fiber: ReactReconciler.Fiber
) {
  const { parent } = instance[MetaOlFiber];
  const newInstance = createInstance(type, newProps, null, null, fiber);
  if (isNil(parent)) {
    if (type === "olMap") {
      console.warn(
        `React-Openlayers-Fiber Warning: Trying to switch olMap! This is poorly supported for now, it will only cause problems if you change the args of the olMap between renders.`
      );
    } else {
      throw new Error(
        `React-Openlayers-Fiber Error: Trying to switch instance which has no parent!`
      );
    }
  } else {
    removeChild(parent, instance);
    appendChild(parent, newInstance as Instance<SelfItem, ParentItem>);
  }

  // This evil hack switches the react-internal fiber node
  // https://github.com/facebook/react/issues/14983
  // https://github.com/facebook/react/pull/15021
  [fiber, fiber.alternate].forEach((theFiber: any) => {
    if (theFiber !== null) {
      // eslint-disable-next-line no-param-reassign
      theFiber.stateNode = newInstance;
      if (theFiber.ref) {
        if (typeof theFiber.ref === "function") theFiber.ref(newInstance);
        // eslint-disable-next-line no-param-reassign
        else (theFiber.ref as ReactReconciler.RefObject).current = newInstance;
      }
    }
  });
}

const commitUpdate = (
  instance: Instance,
  _updatePayload: UpdatePayload,
  type: Type,
  oldProps: Props,
  newProps: Props,
  internalInstanceHandle: OpaqueHandle
): void => {
  const olObject = instance;

  // This is a data object, let's extract critical information about it
  const {
    args: argsNew = [],
    onUpdate,
    children,
    ...restNew
  } = newProps as any; // Had to add the "as any" after moving to ol 6.6.0, which uses its own type definitions

  const { args: argsOld = [], ...restOld } = oldProps as any; // Had to add the "as any" after moving to ol 6.6.0, which uses its own type definitions;
  // If it has new props or arguments, then it needs to be re-instanciated

  let hasNewArgs = false;
  if (isArray(argsNew)) {
    if (!isArray(argsOld)) {
      hasNewArgs = true;
    } else {
      hasNewArgs = argsNew.some((value: any, index: number) =>
        isPlainObject(value)
          ? Object.entries(value).some(
              ([key, val]) => val !== argsOld[index][key]
            )
          : value !== argsOld[index]
      );
    }
  } else if (isPlainObject(argsNew)) {
    if (Array.isArray(argsOld)) {
      hasNewArgs = true;
    } else {
      hasNewArgs = Object.entries(argsNew).some(
        ([key, val]) => val !== argsOld[key]
      );
    }
  } else {
    throw Error("Args should be an Array or an object");
  }

  if (hasNewArgs) {
    // Next we create a new instance and append it again
    switchInstance(instance, type, newProps, internalInstanceHandle);
  } else {
    // Otherwise just overwrite props
    applyProps(olObject as OlObject, restNew, restOld, false);
  }

  if (typeof onUpdate === "function") {
    onUpdate(olObject);
  }
};

const insertInContainerBefore = (
  container: Container,
  child: Instance | TextInstance,
  _beforeChild: Instance | TextInstance
): void => {
  if (!child) throw error001();
  // eslint-disable-next-line no-param-reassign
  child[MetaOlFiber].parent = container;
  // There can only be one map in its parent div
};

const resetTextContent = (_instance: Instance): void => {};

const insertBefore = (
  parentInstance: Instance,
  childInstance: Instance | TextInstance,
  _beforeChild: Instance | TextInstance
): void => {
  appendChild(parentInstance, childInstance);
};

const appendInitialChild = (
  parentInstance: Instance,
  childInstance: Instance | TextInstance
): void => {
  return appendChild(parentInstance, childInstance);
};

const appendChildToContainer = (
  _container: Container,
  _child: Instance | TextInstance
): void => {
  // This would link the map to it's parent div container.
  // But this is already done in the Map component anyway so not needed here
};

const hideInstance = (instance: Instance) => {
  const { kind } = instance[MetaOlFiber];
  switch (kind) {
    case "Layer": {
      getAs("olLayerLayer", instance).setVisible(false);
      break;
    }
    default: {
      throw new Error(
        "React-Openlayers-Fiber Error: Can't hide things that are not layers"
      );
    }
  }
};

const unhideInstance = (instance: Instance, _props: Props) => {
  const { kind } = instance[MetaOlFiber];
  switch (kind) {
    case "Layer": {
      getAs("olLayerLayer", instance).setVisible(true);
      break;
    }
    default: {
      throw new Error(
        "React-Openlayers-Fiber Error: Can't unhide things that are not layers"
      );
    }
  }
};

const hideTextInstance = () => {
  throw new Error(
    "React-Openlayers-Fiber Error: Text is not allowed in the react-openlayers-fiber tree. You may have extraneous whitespace between components."
  );
};

const unhideTextInstance = () => {
  throw new Error(
    "React-Openlayers-Fiber Error: Text is not allowed in the react-openlayers-fiber tree. You may have extraneous whitespace between components."
  );
};

const reconciler = ReactReconciler<
  Type,
  Props,
  Container,
  Instance,
  TextInstance,
  SuspenseInstance,
  HydratableInstance,
  PublicInstance,
  HostContext,
  UpdatePayload,
  ChildSet,
  TimeoutHandle,
  NoTimeout
>({
  // List from ./node_modules/react-reconciler/cjs/react-reconciler-persistent.development.js
  // -------------------
  getPublicInstance,
  getRootHostContext,
  getChildHostContext,
  prepareForCommit,
  resetAfterCommit,
  createInstance,
  appendInitialChild,
  finalizeInitialChildren,
  prepareUpdate,
  shouldSetTextContent,
  // shouldDeprioritizeSubtree,
  createTextInstance,
  // -------------------
  scheduleTimeout,
  cancelTimeout,
  noTimeout,
  now,
  // -------------------
  isPrimaryRenderer: false,
  // warnsIfNotActing: true,
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  // -------------------
  // DEPRECATED_mountResponderInstance: noOp,
  // DEPRECATED_unmountResponderInstance: noOp,
  // getFundamentalComponentInstance: noOp,
  // mountFundamentalComponent: noOp,
  // shouldUpdateFundamentalComponent: noOp,
  // getInstanceFromNode: noOp,
  // getInstanceFromScope: () => noOp,
  // beforeRemoveInstance: noOp,
  // -------------------
  //      Mutation
  //     (optional)
  // -------------------
  appendChild,
  appendChildToContainer,
  commitTextUpdate,
  commitMount,
  commitUpdate,
  insertBefore,
  insertInContainerBefore,
  removeChild,
  removeChildFromContainer,
  resetTextContent,
  hideInstance,
  hideTextInstance,
  unhideInstance,
  unhideTextInstance,
  preparePortalMount: noOp,
  queueMicrotask,
  // updateFundamentalComponent: noOp,
  // unmountFundamentalComponent: noOp,
  // // -------------------
  // //     Persistence
  // //     (optional)
  // // -------------------
  // cloneInstance?(
  //     instance: Instance,
  //     updatePayload: null | UpdatePayload,
  //     type: Type,
  //     oldProps: Props,
  //     newProps: Props,
  //     internalInstanceHandle: OpaqueHandle,
  //     keepChildren: boolean,
  //     recyclableInstance: Instance,
  // ): Instance;
  // createContainerChildSet?(container: Container): ChildSet;
  // appendChildToContainerChildSet?(childSet: ChildSet, child: Instance | TextInstance): void;
  // finalizeContainerChildren?(container: Container, newChildren: ChildSet): void;
  // replaceContainerChildren?(container: Container, newChildren: ChildSet): void;
  // cloneHiddenInstance,
  // cloneHiddenTextInstance,
  // cloneFundamentalInstance,
  // // -------------------
  // //     Hydration
  // //     (optional)
  // // -------------------
  // canHydrateInstance?(instance: HydratableInstance, type: Type, props: Props): null | Instance;
  // canHydrateTextInstance?(instance: HydratableInstance, text: string): null | TextInstance;
  // canHydrateSuspenseInstance:noOp,
  // isSuspenseInstancePending:noOp,
  // isSuspenseInstanceFallback:noOp,
  // registerSuspenseInstanceRetry:noOp,
  // getNextHydratableSibling?(instance: Instance | TextInstance | HydratableInstance): null | HydratableInstance;
  // getFirstHydratableChild?(parentInstance: Instance | Container): null | HydratableInstance;
  // hydrateInstance?(
  //     instance: Instance,
  //     type: Type,
  //     props: Props,
  //     rootContainerInstance: Container,
  //     hostContext: HostContext,
  //     internalInstanceHandle: OpaqueHandle,
  // ): null | UpdatePayload;
  // hydrateTextInstance?(
  //     textInstance: TextInstance,
  //     text: string,
  //     internalInstanceHandle: OpaqueHandle,
  // ): boolean;
  // hydrateSuspenseInstance:noOp,
  // getNextHydratableInstanceAfterSuspenseInstance:noOp,
  // commitHydratedContainer:noOp,
  // commitHydratedSuspenseInstance:noOp,
  // clearSuspenseBoundary:noOp,
  // clearSuspenseBoundaryFromContainer:noOp,
  // didNotMatchHydratedContainerTextInstance?(
  //     parentContainer: Container,
  //     textInstance: TextInstance,
  //     text: string,
  // ): void;
  // didNotMatchHydratedTextInstance?(
  //     parentType: Type,
  //     parentProps: Props,
  //     parentInstance: Instance,
  //     textInstance: TextInstance,
  //     text: string,
  // ): void;
  // didNotHydrateContainerInstance?(parentContainer: Container, instance: Instance | TextInstance): void;
  // didNotHydrateInstance?(
  //     parentType: Type,
  //     parentProps: Props,
  //     parentInstance: Instance,
  //     instance: Instance | TextInstance,
  // ): void;
  // didNotFindHydratableContainerInstance?(
  //     parentContainer: Container,
  //     type: Type,
  //     props: Props,
  // ): void;
  // didNotFindHydratableContainerTextInstance?(
  //     parentContainer: Container,
  //     text: string,
  // ): void;
  // didNotFindHydratableContainerSuspenseInstance:noOp,
  // didNotFindHydratableInstance?(
  //     parentType: Type,
  //     parentProps: Props,
  //     parentInstance: Instance,
  //     type: Type,
  //     props: Props,
  // ): void;
  // didNotFindHydratableTextInstance?(
  //     parentType: Type,
  //     parentProps: Props,
  //     parentInstance: Instance,
  //     text: string,
  // ): void;
  // didNotFindHydratableSuspenseInstance:noOp,
  // // -------------------
});

export function render(what: React.ReactNode, where: HTMLElement) {
  let container;
  if (instances.has(where)) {
    container = instances.get(where);
  } else {
    container = reconciler.createContainer(
      where as unknown as Container<CatalogueItem>, // FIXME
      0,
      false,
      null
    );
    instances.set(where, container);
  }

  reconciler.updateContainer(what, container, null, () => null);
  return reconciler.getPublicRootInstance(container);
}

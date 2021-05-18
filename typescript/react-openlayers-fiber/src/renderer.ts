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
import {
  Map as OlMap,
  Object as OlObject,
  View as OlView,
  Feature as OlFeature,
} from "ol";
import Layer from "ol/layer/Layer";
import Control from "ol/control/Control";
import Interaction from "ol/interaction/Interaction";
import Overlay from "ol/Overlay";
import Source from "ol/source/Source";
import SourceVector from "ol/source/Vector";
import SourceCluster from "ol/source/Cluster";
import Geometry from "ol/geom/Geometry";

import { ReactOlFiber } from "./types";
import { catalogue, CatalogueKey } from "./catalogue";

export interface ObjectHash {
  [name: string]: OlObject;
}

export type Detach = (container: OlObject, child: OlObject) => void;
export type Attach =
  | string
  | ((
      container: OlObject,
      child: OlObject,
      parentInstance: Instance,
      childInstance: Instance
    ) => Detach);

export type Type = keyof ReactOlFiber.IntrinsicElements;

export type Props = ReactOlFiber.IntrinsicElements[Type];

export type Container = OlObject;

const MetaOlFiber = Symbol("MetaOlFiber");

export type Instance = OlObject & {
  [MetaOlFiber]: {
    kind: string;
    type: string;
    parent?: Instance;
    attach?: Attach;
    detach?: (container: Container, child: Container) => void;
  };
};

// export type OpaqueHandle = Fiber;
export type OpaqueHandle = any;
export type TextInstance = null;
export type HydratableInstance = Instance;
export type PublicInstance = OlObject;
export type HostContext = {};
export type UpdatePayload = boolean;
export type ChildSet = void;
export type TimeoutHandle = TimerHandler;
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
  const setterSpecificKey = olObject[keySetter];
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
    olObject[olKey] = propValue;
  } else {
    console.error(
      `React-Openlayers-Fiber Error: Setting the property "${olKey}" very brutally because there is no setter on the object nor the object has this key... This is probably an error`
    );
    console.error(olObject);
    // eslint-disable-next-line no-param-reassign
    olObject[olKey] = propValue;
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
  oldProps: object = {},
  newProps: object,
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
          olObject.un(eventType, oldProps[key]);
        }
        if (isFunction(newProps[key])) {
          olObject.on(eventType, newProps[key]);
        }
      } else {
        const olKey = startsWith("_", key) ? key.substring(1) : key;
        applyProp(olObject, olKey, newProps[key]);
      }
    }
  }, keys(newProps));
};

const defaultAttach = (
  parent: PublicInstance,
  child: PublicInstance,
  parentInstance: Instance,
  childInstance: Instance | TextInstance
): Detach => {
  const containerOlObject = parentInstance;
  const { kind: containerKind } = parentInstance[MetaOlFiber];
  const childOlObject = childInstance;
  const { kind: childKind } = childInstance[MetaOlFiber];

  switch (containerKind) {
    case "Map": {
      switch (childKind) {
        case "View":
          (containerOlObject as OlMap).setView(childOlObject as OlView);
          return (containerOlObject) =>
            (containerOlObject as OlMap).unset("view"); // Dubious at best
        case "Layer":
          (containerOlObject as OlMap).addLayer(childOlObject as Layer);
          return (containerOlObject, childOlObject) =>
            (containerOlObject as OlMap).removeLayer(childOlObject as Layer);
        case "Control":
          (containerOlObject as OlMap).addControl(childOlObject as Control);
          return (containerOlObject, childOlObject) =>
            (containerOlObject as OlMap).removeControl(
              childOlObject as Control
            );
        case "Interaction":
          (containerOlObject as OlMap).addInteraction(
            childOlObject as Interaction
          );
          return (containerOlObject, childOlObject) =>
            (containerOlObject as OlMap).removeInteraction(
              childOlObject as Interaction
            );
        case "Overlay":
          (containerOlObject as OlMap).addOverlay(childOlObject as Overlay);
          return (containerOlObject, childOlObject) =>
            (containerOlObject as OlMap).removeOverlay(
              childOlObject as Overlay
            );
        default:
          throw error002(containerKind, childKind);
      }
    }
    case "Layer": {
      switch (childKind) {
        case "Source":
          (containerOlObject as Layer).setSource(childOlObject as Source);
          return (containerOlObject, childOlObject) =>
            (containerOlObject as Layer).unset("source"); // Dubious at best
        default:
          throw error002(containerKind, childKind);
      }
    }
    case "Source": {
      switch (childKind) {
        case "Feature":
          (containerOlObject as SourceVector).addFeature(
            childOlObject as OlFeature
          );
          return (containerOlObject, childOlObject) =>
            (containerOlObject as SourceVector).removeFeature(
              childOlObject as OlFeature
            ); // Dubious at best
        case "Source":
          (containerOlObject as SourceCluster).setSource(
            childOlObject as SourceVector
          );
          return (containerOlObject, childOlObject) =>
            (containerOlObject as SourceCluster).unset("source"); // Dubious at best
        default:
          throw error002(containerKind, childKind);
      }
    }
    case "Feature": {
      switch (childKind) {
        case "Geom":
          (containerOlObject as OlFeature).setGeometry(
            childOlObject as Geometry
          );
          return (containerOlObject, childOlObject) =>
            (containerOlObject as OlFeature).unset("geometry"); // Dubious at best
        default:
          throw error002(containerKind, childKind);
      }
    }
    default:
      throw error002(containerKind, childKind);
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
  return instance;
};

// Not used as of today, feel free to implement something cool instead of this
const getRootHostContext = (rootContainerInstance: Container): HostContext =>
  emptyObject;

// Not used as of today, feel free to implement something cool instead of this
const getChildHostContext = (
  parentHostContext: HostContext,
  type: Type,
  rootContainerInstance: Container
): HostContext => {
  return typeof parentHostContext === "string"
    ? `${parentHostContext}.${type}`
    : type;
};

const prepareForCommit = (containerInfo: Container): void => {
  return null;
};

const resetAfterCommit = (containerInfo: Container): void => {
  return null;
};

const createInstance = (
  type: Type,
  props: Props,
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: OpaqueHandle
): Instance => {
  let olObject;
  let kind;

  if (type === "primitive") {
    // <primitive/> Elements like in react three fiber
    const { object } = props as ReactOlFiber.IntrinsicElements["primitive"];
    olObject = object;
    kind = null;
  } else if (type === "new") {
    // <new/> Elements like in react three fiber
    const { object, args } = props as ReactOlFiber.IntrinsicElements["new"];
    olObject = new object(...args);
    kind = null;
  } else {
    // <olMap/> and all other similar elements from ol
    const {
      args,
      constructFrom,
      attach,
      onUpdate,
      children,
      ref,
      key,
      ...otherProps
    } = props as ReactOlFiber.IntrinsicElementsArgsObject[keyof ReactOlFiber.IntrinsicElementsArgsObject];

    const target = catalogue[type as CatalogueKey];
    if (isNil(target)) {
      // Not found
      new Error(
        `React-Openlayers-Fiber Error: ${type} is not exported by ol. Use extend to add it if needed.`
      );
    } else if (isNil(constructFrom)) {
      // No constructFrom prop (most common)
      const initialProps = flow(
        pickBy((value, key) => key.substr(0, 7) === "initial"),
        mapKeys((key) => lowerFirst(key.substr(7)))
      )(otherProps);

      const props = {
        ...initialProps,
        ...mapKeys(
          (key) => (startsWith("_", key) ? key.substring(1) : key),
          pickBy((value, key) => key.substr(0, 7) !== "initial", otherProps)
        ),
      };

      if (isNil(args)) {
        // No args, simple ol object with a single options object arg
        olObject = new (target.object as new (arg: any) => any)(props);
        kind = target.kind;
      } else if (isArray(args)) {
        // Args array
        olObject = new (target.object as new (...args: any[]) => any)(...args);
        kind = target.kind;
      } else {
        // Single argument
        olObject = new (target.object as new (arg: any) => any)({
          ...props,
          ...args,
        });
        kind = target.kind;
      }
    } else {
      // constructFrom prop is present
      if (isFunction(target[constructFrom])) {
        // The static field exists on the class
        olObject = target[constructFrom](...args);
        kind = target.kind;
      } else {
        // Static constructForm does not exist
        throw new Error(
          `React-Openlayers-Fiber Error: ${constructFrom} is not a constructor for ${target}`
        );
      }
    }

    olObject[MetaOlFiber] = {
      kind,
      type,
      attach,
    };

    applyProps(olObject, {}, otherProps, true);

    return olObject;
  }
};

const finalizeInitialChildren = (
  parentInstance: Instance,
  type: Type,
  props: Props,
  rootContainerInstance: Container,
  hostContext: HostContext
): boolean => {
  return false;
};

const prepareUpdate = (
  instance: Instance,
  type: Type,
  oldProps: Props,
  newProps: Props,
  rootContainerInstance: Container,
  hostContext: HostContext
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

const shouldSetTextContent = (type: Type, props: Props): boolean => {
  return false;
};

const shouldDeprioritizeSubtree = (type: Type, props: Props): boolean => {
  return false;
};

const createTextInstance = (
  text: string,
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: OpaqueHandle
): TextInstance => {
  return null;
};

const scheduleTimeout:
  | ((
      handler: (...args: any[]) => void,
      timeout: number
    ) => TimeoutHandle | NoTimeout)
  | null = isFunction(setTimeout) ? setTimeout : null;

const cancelTimeout: ((handle: TimeoutHandle | NoTimeout) => void) | null =
  isFunction(clearTimeout) ? clearTimeout : null;
const noTimeout: NoTimeout = -1;

const commitTextUpdate = (
  textInstance: TextInstance,
  oldText: string,
  newText: string
): void => {
  return null;
};

const commitMount = (
  instance: Instance,
  type: Type,
  newProps: Props,
  internalInstanceHandle: OpaqueHandle
): void => {
  return null;
};

const removeChild = (
  parentInstance: Instance,
  childInstance: Instance | TextInstance
): void => {
  const container = parentInstance;
  const child = childInstance;
  const { attach, detach } = child[MetaOlFiber];
  if (isFunction(detach)) {
    detach(container, child);
  } else if (isString(attach)) {
    container[attach] = null;
  } else {
    new Error(
      `React-Openlayers-Fiber Error: Couldn't remove this child from this container. You can specify how to detach this type of child ("${child.constructor.name}") from this type of container ("${container.constructor.name}") using the "attach" props.`
    );
  }
};

const removeChildFromContainer = (
  container: Container,
  child: Instance | TextInstance
): void => {
  // Probably not neded
  // There can only be one map in its parent div
  (child as OlMap).setTarget(null);
};

const commitUpdate = (
  instance: Instance,
  updatePayload: UpdatePayload,
  type: Type,
  oldProps: Props,
  newProps: Props,
  internalInstanceHandle: OpaqueHandle
): void => {
  const olObject = instance;

  // This is a data object, let's extract critical information about it
  const { args: argsNew = [], onUpdate, children, ...restNew } = newProps;
  const { args: argsOld = [], ...restOld } = oldProps;
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
    applyProps(olObject, restOld, restNew);
  }

  if (typeof onUpdate === "function") {
    onUpdate(olObject);
  }
};

const insertInContainerBefore = (
  container: Container,
  child: Instance | TextInstance,
  beforeChild: Instance | TextInstance
): void => {
  child[MetaOlFiber].parent = container;
  // There can only be one map in its parent div
};

const resetTextContent = (instance: Instance): void => {
  return null;
};

const appendChild = (
  parentInstance: Instance,
  childInstance: Instance | TextInstance
): void => {
  const containerOlObject = parentInstance;
  const childOlObject = childInstance;
  const { attach } = childInstance[MetaOlFiber];

  childInstance[MetaOlFiber].parent = parentInstance;
  if (isNil(attach)) {
    childInstance[MetaOlFiber].detach = defaultAttach(
      containerOlObject,
      childOlObject,
      parentInstance,
      childInstance
    );
  } else if (isString(attach)) {
    containerOlObject[attach] = childOlObject;
    childInstance[MetaOlFiber].detach = (containerOlObject, childOlObject) => {
      delete containerOlObject[attach];
    };
    const setterGeneric = containerOlObject.set;
    // From there, the code is very similar to the function applyProps
    const keySetter = `set${upperFirst(attach)}`;
    const setterSpecificKey = containerOlObject[keySetter];
    if (isFunction(setterSpecificKey)) {
      setterSpecificKey.bind(containerOlObject)(childOlObject);
    } else if (isFunction(setterGeneric)) {
      setterGeneric.bind(containerOlObject)(attach, childOlObject);
    } else {
      console.warn(
        `React-Openlayers-Fiber Warning: Attaching the child ${attach} brutally because there is no setter on the object`
      );
      console.warn(containerOlObject);
      console.warn(childOlObject);
      containerOlObject[attach] = childOlObject;
    }
  } else if (isFunction(attach)) {
    childInstance[MetaOlFiber].detach = attach(
      containerOlObject,
      childOlObject,
      parentInstance,
      childInstance
    );
  } else {
    throw new Error(`React-Openlayers-Fiber Error: Unsupported "attach" type.`);
  }
};

const insertBefore = (
  parentInstance: Instance,
  childInstance: Instance | TextInstance,
  beforeChild: Instance | TextInstance
): void => {
  appendChild(parentInstance, childInstance);
};

const appendInitialChild = (
  parentInstance: Instance,
  child: Instance | TextInstance
): void => {
  return appendChild(parentInstance, child);
};

const appendChildToContainer = (
  container: Container,
  child: Instance | TextInstance
): void => {
  // This would link the map to it's parent div container.
  // But this is already done in the Map component anyway so not needed here
};

// Code from react-three-fiber : https://github.com/pmndrs/react-three-fiber/blob/master/src/renderer.tsx#L450
function switchInstance(
  instance: Instance,
  type: Type,
  newProps: any,
  fiber: ReactReconciler.Fiber
) {
  const { parent } = instance[MetaOlFiber];
  const newInstance = createInstance(type, newProps, null, null, fiber);
  removeChild(parent, instance);
  appendChild(parent, newInstance);
  // This evil hack switches the react-internal fiber node
  // https://github.com/facebook/react/issues/14983
  // https://github.com/facebook/react/pull/15021
  [fiber, fiber.alternate].forEach((fiber: any) => {
    if (fiber !== null) {
      fiber.stateNode = newInstance;
      if (fiber.ref) {
        if (typeof fiber.ref === "function") fiber.ref(newInstance);
        else (fiber.ref as ReactReconciler.RefObject).current = newInstance;
      }
    }
  });
}

const hideInstance = (instance: Instance) => {
  const kind = instance[MetaOlFiber];
  switch (kind) {
    case "Layer": {
      (instance as Layer).setVisible(false);
      break;
    }
    default: {
      throw new Error(
        "React-Openlayers-Fiber Error: Can't hide things that are not layers"
      );
    }
  }
};

const unhideInstance = (instance: Instance, props: Props) => {
  const kind = instance[MetaOlFiber];
  switch (kind) {
    case "Layer": {
      (instance as Layer).setVisible(true);
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

const reconciler = ReactReconciler({
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
  shouldDeprioritizeSubtree,
  createTextInstance,
  // -------------------
  scheduleTimeout,
  cancelTimeout,
  noTimeout,
  now,
  // -------------------
  isPrimaryRenderer: false,
  warnsIfNotActing: true,
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  // -------------------
  DEPRECATED_mountResponderInstance: noOp,
  DEPRECATED_unmountResponderInstance: noOp,
  getFundamentalComponentInstance: noOp,
  mountFundamentalComponent: noOp,
  shouldUpdateFundamentalComponent: noOp,
  getInstanceFromNode: noOp,
  getInstanceFromScope: () => noOp,
  beforeRemoveInstance: noOp,
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
  updateFundamentalComponent: noOp,
  unmountFundamentalComponent: noOp,
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
    container = reconciler.createContainer(where, false, false);
    instances.set(where, container);
  }

  reconciler.updateContainer(what, container, null, () => null);
  return reconciler.getPublicRootInstance(container);
}

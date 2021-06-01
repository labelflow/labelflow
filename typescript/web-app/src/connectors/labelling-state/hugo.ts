import { undoMiddleware } from "zundo";
import create, { State, StateCreator } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { SideEffectState, sideEffect } from "./side-effect-middleware";

/**
 * The state type. Note that it extends UndoState
 */
export interface StoreState extends SideEffectState {
  bears: number;
}

// creates a store with undo/redo capability
const domainStore = create<StoreState>((set) => ({
  bears: 0,
  //   setState: (newState)=> set((state) => newState
  //   increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  //   decreasePopulation: () => set((state) => ({ bears: state.bears - 1 })),
}));

/**
 * The state creator and resolver functions
 */
const undoStore = createSuperUndoStore((set, get) => ({}));

undoStore.perform(() => {
  //   const stateBefore = domainStore.getState();
  let stateBefore;
  return {
    do: () => {
      domainStore.setState((state) => ({ bears: state.bears + 1 }));
    },
    undo: () => {
      domainStore.setState(stateBefore);
      //   domainStore.setState((state) => ({ bears: state.bears - 1 }));
    },
    redo: () => {
      domainStore.setState((state) => ({ bears: state.bears + 1 }));
    },
  };
});

// use immer patches? https://immerjs.github.io/immer/patches/

export interface UndoStoreState {
  prevStates: any[];
  futureStates: any[];
  undo: () => void;
  redo: () => void;
  clear: () => void;
  // handle on the parent store's setter
  setStore: Function;
  // handle on the parent store's getter
  getStore: Function;
}

// factory to create undoStore. contains memory about past and future states and has methods to traverse states
export const createUndoStore = () => {
  return createVanilla<UndoStoreState>((set, get) => {
    return {
      prevStates: [],
      futureStates: [],
      undo: () => {
        const { prevStates, futureStates, setStore, getStore } = get();
        if (prevStates.length > 0) {
          futureStates.push(getStore());
          const prevState = prevStates.pop();
          setStore(prevState);
        }
      },
      redo: () => {
        const { prevStates, futureStates, setStore, getStore } = get();
        if (futureStates.length > 0) {
          prevStates.push(getStore());
          const futureState = futureStates.pop();
          setStore(futureState);
        }
      },
      clear: () => {
        set({ prevStates: [], futureStates: [] });
      },
      setStore: () => {},
      getStore: () => {},
    };
  });
};

/**
 * The log middleware
 * See https://github.com/pmndrs/zustand#middleware
 */
const log =
  <T extends State>(config: StateCreator<T>): StateCreator<T> =>
  (set, get, api) =>
    config(
      (args) => {
        // console.log("LOG: applying", args);
        set(args);
        // console.log("LOG: new state", get());
      },
      get,
      api
    );

/**
 * Create a store with a undo middleware
 * See https://github.com/charkour/zundo#first-create-a-store-with-undo-middleware
 * See https://github.com/pmndrs/zustand#middleware
 */
export const useStore = create<StoreState>(
  devtools(
    sideEffect(
      log(
        persist(
          // `undoMiddleware` must be inside `persist`, otherwise we could undo
          // the rehydration event on login.
          undoMiddleware(stateCreator),
          {
            // unique name
            name: "labelling-state",
            // (optional) by default the `localStorage` is used,
            // we could use `sessionStorage` or other
            getStorage: () => localStorage,
          }
        )
      )
    )
  )
);

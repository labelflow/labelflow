import { undoMiddleware } from "zundo";
import create, { State, StateCreator } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { SideEffectState, sideEffect } from "./side-effect-middleware";

/**
 * The state type. Note that it extends UndoState
 */
export interface StoreState extends SideEffectState {
  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
}

/**
 * The state creator and resolver functions
 */
const stateCreator: StateCreator<StoreState> = (set, get) => ({
  bears: 0,
  noSideEffect: () =>
    set((state) => ({
      bears: state.bears + 1,
    })),
  onlySideEffect: () => {
    const index = get().bears;
    // const index = 1;
    console.log(`BEAR: Do beeaarrrrr++ from ${index} to ${index + 1}`);
    set((state) => ({
      unperformEffect: () => {
        console.log(`BEAR: Undo beeaarrrrr++ from ${index} to ${index + 1}`);
      },
      reperformEffect: () => {
        console.log(`BEAR: Redo beeaarrrrr++ from ${index} to ${index + 1}`);
      },
    }));
  },
  increasePopulation: () => {
    const index = get().bears;
    // const index = 1;
    console.log(`BEAR: Do beeaarrrrr++ from ${index} to ${index + 1}`);
    set((state) => ({
      bears: state.bears + 1,
      unperformEffect: () => {
        console.log(`BEAR: Undo beeaarrrrr++ from ${index} to ${index + 1}`);
      },
      reperformEffect: () => {
        console.log(`BEAR: Redo beeaarrrrr++ from ${index} to ${index + 1}`);
      },
    }));
  },
  removeAllBears: () => set({ bears: 0 }),
  undoEffect: () => undefined,
  redoEffect: () => undefined,
});

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

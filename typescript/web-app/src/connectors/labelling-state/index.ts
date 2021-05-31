import { undoMiddleware, UndoState } from "zundo";
import create, { State, StateCreator } from "zustand";
import { persist, devtools } from "zustand/middleware";

/**
 * The state type. Note that it extends UndoState
 */
export interface StoreState extends UndoState {
  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
  effect: () => () => void;
}

/**
 * The state creator and resolver functions
 */
const stateCreator: StateCreator<StoreState> = (set) => ({
  bears: 0,
  increasePopulation: () => {
    console.log("Do beeaarrrrr++");
    set((state) => ({
      bears: state.bears + 1,
      effect: () => {
        console.log("Undo beeaarrrrr++");
        return () => console.log("REDO beeaarrrrr++");
      },
    }));
  },
  removeAllBears: () => set({ bears: 0 }),
  effect: () => () => undefined,
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
        // console.log("applying", args);
        set(args);
        // console.log("new state", get());
      },
      get,
      api
    );

/**
 * The side-effect middleware
 */
const sideEffect =
  <T extends UndoState>(config: StateCreator<T>): StateCreator<T> =>
  (set, get, api) =>
    config(
      (args) => {
        console.log("WOOOWWW a: ", args);
        console.log("WOOOWWW   b: ", api);
        set(args);
        console.log("LOLLLLL:", get());
      },
      () => {
        console.log("GETTT");
        const state = get();
        return {
          ...state,
          undo: () => {
            console.log("Undooooo=======================");
            return state?.undo?.();
          },
        };
      },
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

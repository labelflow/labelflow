import { undoMiddleware, UndoState } from "zundo";
import create, { State, StateCreator } from "zustand";
import { persist, devtools } from "zustand/middleware";

/**
 * The state type. Note that it extends UndoState
 */
export interface SideEffectState extends UndoState {
  undoEffect?: () => void;
  redoEffect?: () => void;

  unperformEffect?: () => void;
  reperformEffect?: () => void;
}

/**
 * The side-effect middleware
 */
export const sideEffect =
  <T extends SideEffectState>(config: StateCreator<T>): StateCreator<T> =>
  (set, get, api) =>
    config(
      // New `set`
      (args) => {
        // console.log("SIDE: args ", args);
        set(args);
        // console.log("SIDE: state", get());
      },

      // New `get`
      () => {
        const state = get();
        // console.log("SIDE: GETTT ", state);
        return {
          ...state,
          undoEffect: () => {
            console.log("SIDE: Undooooo=======================", state);
            state?.unperformEffect?.();
            // return state?.undo?.();
          },
          redoEffect: () => {
            console.log("SIDE: REEEEdooooo=======================", state);
            state?.reperformEffect?.();
            // return state?.redo?.();
          },
        };
      },

      api
    );

import createVanilla from "zustand/vanilla";

type StoredState<Payload extends any = any> = {
  payload: Payload;
  undo: (previousPayload: Payload) => Promise<Payload> | Payload;
  redo: (previousPayload: Payload) => Promise<Payload> | Payload;
};

export interface UndoStoreState {
  prevEffects: StoredState[];
  futureEffects: StoredState[];
  undo: () => void;
  redo: () => void;
  clear: () => void;
  perform: (effect: Effect) => void;
  // handle on the parent store's setter
  setStore: Function;
  // handle on the parent store's getter
  getStore: Function;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export type Effect<Payload extends any = any> = {
  do: () => Promise<Payload> | Payload;
  undo: (previousPayload: Payload) => Promise<Payload> | Payload;
  redo?: (previousPayload: Payload) => Promise<Payload> | Payload;
};

// factory to create undoStore. contains memory about past and future states and has methods to traverse states
export const createUndoStore = () => {
  // @ts-ignore
  return createVanilla<UndoStoreState>((set, get) => {
    return {
      prevEffects: [],
      futureEffects: [],

      perform: (effect: Effect) => {
        const { prevEffects } = get();
        const payload = effect.do();
        const redo = effect?.redo ?? effect.do;
        prevEffects.push({ payload, redo, undo: effect.undo });
      },

      undo: () => {
        const { prevEffects, futureEffects } = get();
        if (prevEffects.length > 0) {
          const prevState = prevEffects.pop() as StoredState;
          const payload = prevState.undo(prevState.payload);
          futureEffects.push({ ...prevState, payload });
        }
      },
      redo: () => {
        const { prevEffects, futureEffects } = get();
        if (futureEffects.length > 0) {
          const futureState = futureEffects.pop() as StoredState;
          const payload = futureState.redo(futureState.payload);

          prevEffects.push({ ...futureState, payload });
        }
      },
      clear: () => {
        set({ prevEffects: [], futureEffects: [] });
      },
      canUndo: () => {
        const { prevEffects } = get();
        return prevEffects.length > 0;
      },
      canRedo: () => {
        const { futureEffects } = get();
        return futureEffects.length > 0;
      },
      setStore: () => {},
      getStore: () => {},
    };
  });
};

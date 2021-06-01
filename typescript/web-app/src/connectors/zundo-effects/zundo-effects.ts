import createVanilla from "zustand/vanilla";

type StoredState<Payload extends any = any> = {
  payload: Promise<Payload>;
  undo: (previousPayload: Payload) => Promise<Payload> | Payload;
  redo: (previousPayload: Payload) => Promise<Payload> | Payload;
};

export interface UndoStoreState {
  pastEffects: StoredState[];
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
      pastEffects: [],
      futureEffects: [],

      perform: async (effect: Effect) => {
        const { pastEffects } = get();
        set({ futureEffects: [] });
        const payload = effect.do();
        const redo = effect?.redo ?? effect.do;
        pastEffects.push({ payload, redo, undo: effect.undo });
        await payload;
      },

      undo: async () => {
        const { pastEffects, futureEffects } = get();
        if (pastEffects.length > 0) {
          const prevState = pastEffects.pop() as StoredState;
          const payload = (async () =>
            prevState.undo(await prevState.payload))();
          futureEffects.push({ ...prevState, payload });
          await payload;
        }
      },
      redo: async () => {
        const { pastEffects, futureEffects } = get();
        if (futureEffects.length > 0) {
          const futureState = futureEffects.pop() as StoredState;
          const payload = (async () =>
            futureState.redo(await futureState.payload))();

          pastEffects.push({ ...futureState, payload });
          await payload;
        }
      },
      clear: () => {
        set({ pastEffects: [], futureEffects: [] });
      },
      canUndo: () => {
        const { pastEffects } = get();
        return pastEffects.length > 0;
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

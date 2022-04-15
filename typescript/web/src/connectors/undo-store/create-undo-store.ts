import createVanilla from "zustand/vanilla";
import { filter } from "lodash/fp";
import { v4 as uuidv4 } from "uuid";

type StoredState<Payload extends any = any> = {
  id: string; // Needed in order to retrieve and remove failed operations from the queue
  payload: Promise<Payload>;
  undo: (previousPayload: Payload) => Promise<Payload> | Payload;
  redo: (previousPayload: Payload) => Promise<Payload> | Payload;
};

type UndoStoreState = {
  pastEffects: StoredState[];
  futureEffects: StoredState[];
  perform: (effect: Effect) => Promise<string>;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  clear: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
};

export type Effect<Payload extends any = any> = {
  do: () => Promise<Payload> | Payload;
  undo: (previousPayload: Payload) => Promise<Payload> | Payload;
  redo?: (previousPayload: Payload) => Promise<Payload> | Payload;
};

// factory to create undoStore. contains memory about past and future states and has methods to traverse states
export const createUndoStore = () => {
  return createVanilla<UndoStoreState>((set, get) => {
    return {
      pastEffects: [],
      futureEffects: [],

      perform: async (effect: Effect) => {
        set({ futureEffects: [] });
        const payload = effect.do();
        const redo = effect?.redo ?? effect.do;
        const effectId = uuidv4();
        set((state) => ({
          pastEffects: [
            ...state.pastEffects,
            { payload, redo, undo: effect.undo, id: effectId },
          ],
        }));
        try {
          await payload;
        } catch (error) {
          // Remove effect from queue as it was not executed properly
          set((state) => ({
            pastEffects: filter<StoredState>(
              (effectElement) => effectElement?.id !== effectId,
              state.pastEffects
            ),
          }));

          throw error;
        }
        return effectId;
      },

      undo: async () => {
        const { pastEffects } = get();
        if (pastEffects.length > 0) {
          const pastState = pastEffects[pastEffects.length - 1];
          const payload = (async () =>
            pastState.undo(await pastState.payload))();
          set((state) => ({
            pastEffects: state.pastEffects.slice(0, -1),
            futureEffects: [...state.futureEffects, { ...pastState, payload }],
          }));

          await payload;
        }
      },
      redo: async () => {
        const { futureEffects } = get();
        if (futureEffects.length > 0) {
          const futureState = futureEffects[futureEffects.length - 1];
          const payload = (async () =>
            futureState.redo(await futureState.payload))();
          set((state) => ({
            futureEffects: state.futureEffects.slice(0, -1),
            pastEffects: [...state.pastEffects, { ...futureState, payload }],
          }));
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
    };
  });
};

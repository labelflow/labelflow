import createVanilla from "zustand/vanilla";

export interface UndoStoreState {
  prevEffects: any[];
  futureEffects: any[];
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
      prevEffects: [],
      futureEffects: [],

      perform: (effect) => {
        const performedEffect = effect();
        performedEffect.do();
        prevEffects.push(performedEffect);
      },

      undo: () => {
        const { prevEffects, futureEffects, setStore, getStore } = get();
        if (prevEffects.length > 0) {
          futureEffects.push(getStore());
          const prevState = prevEffects.pop();
          setStore(prevState);
        }
      },
      redo: () => {
        const { prevEffects, futureEffects, setStore, getStore } = get();
        if (futureEffects.length > 0) {
          prevEffects.push(getStore());
          const futureState = futureEffects.pop();
          setStore(futureState);
        }
      },
      clear: () => {
        set({ prevEffects: [], futureEffects: [] });
      },
      setStore: () => {},
      getStore: () => {},
    };
  });
};

import create from "zustand";
import { persist } from "zustand/middleware";

export type LabellingState = {
  fishes: number;
  addAFish: () => void;
};

export const useLabellingStore = create<LabellingState>(
  persist(
    (set, get) => ({
      fishes: 0,
      addAFish: () => set({ fishes: get().fishes + 1 }),
    }),
    {
      name: "labelling-state", // unique name
      getStorage: () => localStorage, // (optional) by default the 'localStorage' is used
    }
  )
);

import create from "zustand";
import { persist } from "zustand/middleware";

export enum Tools {
  SELECTION = "SELECTION",
  BOUNDING_BOX = "BOUNDING_BOX",
}

export type LabellingState = {
  selectedTool: Tools;
  setSelectedTool: (tool: Tools) => void;
};

export const useLabellingStore = create<LabellingState>(
  persist(
    (set) => ({
      selectedTool: Tools.SELECTION,
      setSelectedTool: (tool) => set({ selectedTool: tool }),
    }),
    {
      name: "labelling-state",
    }
  )
);

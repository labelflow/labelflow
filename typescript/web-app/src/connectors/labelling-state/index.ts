import create from "zustand";
import { persist } from "zustand/middleware";

export enum Tools {
  SELECTION = "SELECTION",
  BOUNDING_BOX = "BOUNDING_BOX",
}

export type LabellingState = {
  selectedTool: Tools;
  selectedLabelId: string | null;
  setSelectedTool: (tool: Tools) => void;
  setSelectedLabelId: (labelId: string | null) => void;
};

export const useLabellingStore = create<LabellingState>(
  persist(
    (set) => ({
      selectedTool: Tools.SELECTION,
      selectedLabelId: null,
      setSelectedTool: (tool) => set({ selectedTool: tool }),
      setSelectedLabelId: (labelId) => set({ selectedLabelId: labelId }),
    }),
    {
      name: "labelling-state",
    }
  )
);

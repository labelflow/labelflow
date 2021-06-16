import create from "zustand-store-addons";

import {
  getRouterValue,
  setRouterValue,
} from "../../utils/query-param-get-set";

export enum Tools {
  SELECTION = "select",
  BOUNDING_BOX = "box",
}

export type LabellingState = {
  selectedTool: Tools;
  selectedLabelId: string | null;
  setSelectedTool: (tool: Tools) => void;
  setSelectedLabelId: (labelId: string | null) => void;
};

export const useLabellingStore = create(
  (set) => ({
    selectedTool: getRouterValue("selectedTool") ?? Tools.SELECTION,
    selectedLabelId: getRouterValue("selectedLabelId") ?? null,
    setSelectedTool: (tool: Tools) => set({ selectedTool: tool }),
    setSelectedLabelId: (labelId: string) => set({ selectedLabelId: labelId }),
  }),
  {
    watchers: {
      selectedTool: setRouterValue("selectedTool"),
      selectedLabelId: setRouterValue("selectedLabelId"),
    },
  }
);

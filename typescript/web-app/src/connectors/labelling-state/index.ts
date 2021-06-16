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
  canZoomIn: boolean;
  canZoomOut: boolean;
  selectedTool: Tools;
  selectedLabelId: string | null;
  setCanZoomIn: (canZoomIn: boolean) => void;
  setCanZoomOut: (canZoomOut: boolean) => void;
  setSelectedTool: (tool: Tools) => void;
  setSelectedLabelId: (labelId: string | null) => void;
};

export const useLabellingStore = create(
  (set) => ({
    canZoomIn: true,
    canZoomOut: false,
    selectedTool: getRouterValue("selectedTool") ?? Tools.SELECTION,
    selectedLabelId: getRouterValue("selectedLabelId") ?? null,
    setSelectedTool: (tool: Tools) => set({ selectedTool: tool }),
    setSelectedLabelId: (labelId: string) => set({ selectedLabelId: labelId }),
    setCanZoomIn: (canZoomIn: boolean) => set({ canZoomIn }),
    setCanZoomOut: (canZoomOut: boolean) => set({ canZoomOut }),
  }),
  {
    watchers: {
      selectedTool: setRouterValue("selectedTool"),
      selectedLabelId: setRouterValue("selectedLabelId"),
    },
  }
);

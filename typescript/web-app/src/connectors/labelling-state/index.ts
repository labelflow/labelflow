import { View as OlView } from "ol";
import { zoomByDelta as olZoomByDelta } from "ol/interaction/Interaction";
// import type ZustandCreate from "zustand";
import create from "zustand-store-addons";

import {
  getRouterValue,
  setRouterValue,
} from "../../utils/query-param-get-set";

export enum Tools {
  SELECTION = "select",
  BOX = "box",
}

export enum BoxDrawingToolState {
  IDLE = "idle",
  DRAWING = "drawing",
}

export type LabellingState = {
  zoomFactor: number;
  view: OlView | null;
  setView: (view: OlView) => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
  selectedLabelId: string | null;
  selectedTool: Tools;
  boxDrawingToolState: BoxDrawingToolState;
  setBoxDrawingToolState: (state: BoxDrawingToolState) => void;
  setCanZoomIn: (canZoomIn: boolean) => void;
  setCanZoomOut: (canZoomOut: boolean) => void;
  setSelectedTool: (tool: Tools) => void;
  setSelectedLabelId: (labelId: string | null) => void;
  zoomByDelta: (ratio: number) => void;
};

export const useLabellingStore = create<LabellingState>(
  (set, get) => ({
    view: null,
    zoomFactor: 0.5,
    canZoomIn: true,
    canZoomOut: false,
    selectedTool: getRouterValue("selectedTool") ?? Tools.SELECTION,
    selectedLabelId: getRouterValue("selectedLabelId") ?? null,
    boxDrawingToolState: BoxDrawingToolState.IDLE,
    setBoxDrawingToolState: (boxDrawingToolState: BoxDrawingToolState) =>
      set({ boxDrawingToolState }),
    setView: (view: OlView) => set({ view }),
    setSelectedTool: (tool: Tools) => set({ selectedTool: tool }),
    setSelectedLabelId: (labelId: string) => set({ selectedLabelId: labelId }),
    setCanZoomIn: (canZoomIn: boolean) => set({ canZoomIn }),
    setCanZoomOut: (canZoomOut: boolean) => set({ canZoomOut }),
    zoomByDelta: (ratio: number) => {
      const { view } = get();
      if (!view) return;
      /* eslint-disable-next-line consistent-return */
      return olZoomByDelta(view, ratio);
    },
  }),
  {
    watchers: {
      selectedTool: setRouterValue("selectedTool"),
      selectedLabelId: setRouterValue("selectedLabelId"),
    },
  }
);

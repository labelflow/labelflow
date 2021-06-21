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
  isContextMenuOpen: boolean;
  setIsContextMenuOpen: (isContextMenuOpen: boolean) => void;
  selectedLabelId: string | null;
  selectedTool: Tools;
  boxDrawingToolState: BoxDrawingToolState;
  setBoxDrawingToolState: (state: BoxDrawingToolState) => void;
  setCanZoomIn: (canZoomIn: boolean) => void;
  setCanZoomOut: (canZoomOut: boolean) => void;
  setSelectedTool: (selectedTool: Tools) => void;
  setSelectedLabelId: (selectedLabelId: string | null) => void;
  zoomByDelta: (ratio: number) => void;
};

export const useLabellingStore = create<LabellingState>(
  (set, get) => ({
    view: null,
    zoomFactor: 0.5,
    canZoomIn: true,
    canZoomOut: false,
    isContextMenuOpen: false,
    setIsContextMenuOpen: (isContextMenuOpen: boolean) =>
      set((state) => ({ ...state, isContextMenuOpen })),
    selectedTool: getRouterValue("selectedTool") ?? Tools.SELECTION,
    selectedLabelId: getRouterValue("selectedLabelId") ?? null,
    boxDrawingToolState: BoxDrawingToolState.IDLE,
    setBoxDrawingToolState: (boxDrawingToolState: BoxDrawingToolState) =>
      set((state) => ({ ...state, boxDrawingToolState })),
    setView: (view: OlView) => set((state) => ({ ...state, view })),
    setSelectedTool: (selectedTool: Tools) =>
      set((state) => ({ ...state, selectedTool })),
    setSelectedLabelId: (selectedLabelId: string | null) =>
      set((state) => ({ ...state, selectedLabelId })),
    setCanZoomIn: (canZoomIn: boolean) =>
      set((state) => ({ ...state, canZoomIn })),
    setCanZoomOut: (canZoomOut: boolean) =>
      set((state) => ({ ...state, canZoomOut })),
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

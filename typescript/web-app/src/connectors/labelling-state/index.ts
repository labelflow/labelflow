import { View as OlView } from "ol";
import { zoomByDelta as olZoomByDelta } from "ol/interaction/Interaction";
// Needed to correct https://github.com/Diablow/zustand-store-addons/issues/2
import type { UseStore } from "zustand";
import create from "zustand-store-addons";

import {
  getRouterValue,
  setRouterValue,
} from "../../utils/query-param-get-set";

export enum Tools {
  SELECTION = "select",
  BOX = "box",
  POLYGON = "polygon",
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
  isImageLoading: boolean;
  isContextMenuOpen: boolean;
  setIsContextMenuOpen: (isContextMenuOpen: boolean) => void;
  selectedTool: Tools;
  selectedLabelId: string | null;
  selectedLabelClassId: string | null;
  boxDrawingToolState: BoxDrawingToolState;
  setBoxDrawingToolState: (state: BoxDrawingToolState) => void;
  setIsImageLoading: (isImageLoading: boolean) => void;
  setCanZoomIn: (canZoomIn: boolean) => void;
  setCanZoomOut: (canZoomOut: boolean) => void;
  setSelectedTool: (selectedTool: Tools) => void;
  setSelectedLabelId: (labelId: string | null) => void;
  setSelectedLabelClassId: (selectedLabelClassId: string | null) => void;
  zoomByDelta: (ratio: number) => void;
};

export const useLabellingStore = create<LabellingState>(
  (set, get) => ({
    view: null,
    isImageLoading: true,
    zoomFactor: 0.5,
    canZoomIn: true,
    canZoomOut: false,
    isContextMenuOpen: false,
    setIsContextMenuOpen: (isContextMenuOpen: boolean) =>
      // @ts-ignore See https://github.com/Diablow/zustand-store-addons/issues/2
      set({ isContextMenuOpen }),
    selectedTool: getRouterValue("selectedTool") ?? Tools.SELECTION,
    selectedLabelId: getRouterValue("selectedLabelId") ?? null,
    selectedLabelClassId: getRouterValue("selectedLabelClassId") ?? null,
    boxDrawingToolState: BoxDrawingToolState.IDLE,
    setBoxDrawingToolState: (boxDrawingToolState: BoxDrawingToolState) =>
      // @ts-ignore See https://github.com/Diablow/zustand-store-addons/issues/2
      set({ boxDrawingToolState }),
    // @ts-ignore See https://github.com/Diablow/zustand-store-addons/issues/2
    setView: (view: OlView) => set({ view }),
    // @ts-ignore See https://github.com/Diablow/zustand-store-addons/issues/2
    setSelectedTool: (selectedTool: Tools) => set({ selectedTool }),
    setSelectedLabelId: (selectedLabelId: string | null) =>
      // @ts-ignore See https://github.com/Diablow/zustand-store-addons/issues/2
      set({ selectedLabelId }),
    setSelectedLabelClassId: (labelClassId: string | null) =>
      // @ts-ignore See https://github.com/Diablow/zustand-store-addons/issues/2
      set({ selectedLabelClassId: labelClassId }),
    // @ts-ignore See https://github.com/Diablow/zustand-store-addons/issues/2
    setCanZoomIn: (canZoomIn: boolean) => set({ canZoomIn }),
    // @ts-ignore See https://github.com/Diablow/zustand-store-addons/issues/2
    setCanZoomOut: (canZoomOut: boolean) => set({ canZoomOut }),
    // @ts-ignore See https://github.com/Diablow/zustand-store-addons/issues/2
    setIsImageLoading: (isImageLoading: boolean) => set({ isImageLoading }),
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
      selectedLabelClassId: setRouterValue("selectedLabelClassId"),
    },
  }
) as UseStore<LabellingState>; // Needed to correct https://github.com/Diablow/zustand-store-addons/issues/2

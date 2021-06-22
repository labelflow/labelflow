import { View as OlView } from "ol";
import { zoomByDelta as olZoomByDelta } from "ol/interaction/Interaction";
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
  zoomFactor: number;
  view: OlView | null;
  canZoomIn: boolean;
  canZoomOut: boolean;
  selectedTool: Tools;
  selectedLabelId: string | null;
  selectedLabelClassId: string | null;
  setCanZoomIn: (canZoomIn: boolean) => void;
  setCanZoomOut: (canZoomOut: boolean) => void;
  setSelectedTool: (tool: Tools) => void;
  setSelectedLabelId: (labelId: string | null) => void;
  setSelectedLabelClassId: (selectedLabelClassId: string | null) => void;
  zoomByDelta: (ratio: number) => void;
};

export const useLabellingStore = create(
  (set, get) => ({
    view: null,
    zoomFactor: 0.5,
    canZoomIn: true,
    canZoomOut: false,
    selectedTool: getRouterValue("selectedTool") ?? Tools.SELECTION,
    selectedLabelId: getRouterValue("selectedLabelId") ?? null,
    selectedLabelClassId: getRouterValue("selectedLabelClassId") ?? null,
    setView: (view: OlView) => set({ view }),
    setSelectedTool: (tool: Tools) => set({ selectedTool: tool }),
    setSelectedLabelId: (labelId: string) => set({ selectedLabelId: labelId }),
    setSelectedLabelClassId: (labelClassId: string) =>
      set({ selectedLabelClassId: labelClassId }),
    setCanZoomIn: (canZoomIn: boolean) => set({ canZoomIn }),
    setCanZoomOut: (canZoomOut: boolean) => set({ canZoomOut }),
    zoomByDelta: (ratio: number) => {
      const { view } = get();
      if (!view) return;
      /* eslint-disable-next-line consistent-return */
      return olZoomByDelta(view, ratio);
    },
    isClassSelectionPopoverOpenedOnRightClick: false,
    setIsClassSelectionPopoverOpenedOnRightClick: (
      isClassSelectionPopoverOpenedOnRightClick: boolean
    ) => set({ isClassSelectionPopoverOpenedOnRightClick }),
  }),
  {
    watchers: {
      selectedTool: setRouterValue("selectedTool"),
      selectedLabelId: setRouterValue("selectedLabelId"),
      selectedLabelClassId: setRouterValue("selectedLabelClassId"),
    },
  }
);

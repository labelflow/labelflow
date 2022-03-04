import { View as OlView } from "ol";
import { zoomByDelta as olZoomByDelta } from "ol/interaction/Interaction";
// Needed to correct https://github.com/Diablow/zustand-store-addons/issues/2
import type { UseStore } from "zustand";
import create from "zustand-store-addons";
import { Coordinate } from "ol/coordinate";

import {
  getRouterValue,
  setRouterValue,
} from "../../utils/query-param-get-set";

export enum Tools {
  SELECTION = "select",
  CLASSIFICATION = "classification",
  BOX = "box",
  POLYGON = "polygon",
  IOG = "iog",
  FREEHAND = "freehand",
}

export enum DrawingToolState {
  IDLE = "idle",
  DRAWING = "drawing",
}

export enum SelectionToolState {
  DEFAULT = "default",
  IOG = "iog",
}

export type LabelingState = {
  zoomFactor: number;
  view: OlView | null;
  setView: (view: OlView) => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
  isImageLoading: boolean;
  iogProcessingLabels: Set<string>;
  iogSpinnerPosition: Coordinate | null;
  iogSpinnerPositions: { [timestamp: number]: Coordinate };
  registerIogJob: (
    timestamp: number,
    idLabel: string | null,
    iogSpinnerPosition: Coordinate | null
  ) => void;
  unregisterIogJob: (timestamp: number, idLabel: string | null) => void;
  isContextMenuOpen: boolean;
  setIsContextMenuOpen: (isContextMenuOpen: boolean) => void;
  contextMenuLocation: Coordinate | undefined;
  setContextMenuLocation: (contextMenuLocation: Coordinate | undefined) => void;
  selectedTool: Tools;
  selectedLabelId: string | null;
  selectedLabelClassId: string | null;
  boxDrawingToolState: DrawingToolState;
  setDrawingToolState: (state: DrawingToolState) => void;
  selectionToolState: SelectionToolState;
  setSelectionToolState: (state: SelectionToolState) => void;
  setIsImageLoading: (isImageLoading: boolean) => void;
  setCanZoomIn: (canZoomIn: boolean) => void;
  setCanZoomOut: (canZoomOut: boolean) => void;
  setSelectedTool: (selectedTool: Tools) => void;
  setSelectedLabelId: (labelId: string | null) => void;
  setSelectedLabelClassId: (selectedLabelClassId: string | null) => void;
  zoomByDelta: (ratio: number) => void;
  showLabelsGeometry: boolean;
  showLabelsName: boolean;
  /**
   * Change labels visibility (geometry and name).
   *
   * Three possible states:
   * 1. geometry visible, name visible
   * 2. geometry visible, name hidden
   * 3. geometry hidden, name hidden
   *
   * Cycle is : 1 -> 2 -> 3 -> 1
   */
  changeLabelsVisibility: () => void;
};

export const useLabelingStore = create<LabelingState>(
  (set, get) => ({
    view: null,
    isImageLoading: true,
    zoomFactor: 0.5,
    canZoomIn: true,
    canZoomOut: false,
    iogSpinnerPosition: null,
    iogProcessingLabels: new Set(),
    iogSpinnerPositions: {},
    registerIogJob: (timestamp, idLabel, iogSpinnerPosition) => {
      if (!iogSpinnerPosition || !idLabel) return;
      const { iogSpinnerPositions, iogProcessingLabels } = get();
      iogProcessingLabels.add(idLabel);
      const newIogSpinnerPositions = {
        ...iogSpinnerPositions,
        [timestamp]: iogSpinnerPosition,
      };
      // @ts-ignore See https://github.com/Diablow/zustand-store-addons/issues/2
      set({
        iogProcessingLabels,
        iogSpinnerPositions: newIogSpinnerPositions,
      });
    },
    unregisterIogJob: (timestamp, idLabel) => {
      const { iogSpinnerPositions, iogProcessingLabels } = get();
      if (idLabel) iogProcessingLabels.delete(idLabel);
      const newIogSpinnerPositions = Object.fromEntries(
        Object.keys(iogSpinnerPositions)
          .filter(
            (timestampCurrent) => parseInt(timestampCurrent, 10) !== timestamp
          )
          .map((key) => [key, iogSpinnerPositions[parseInt(key, 10)]])
      );
      // @ts-ignore See https://github.com/Diablow/zustand-store-addons/issues/2
      return set({
        iogSpinnerPositions: newIogSpinnerPositions,
        iogProcessingLabels,
      });
    },
    isContextMenuOpen: false,
    setIsContextMenuOpen: (isContextMenuOpen: boolean) =>
      // @ts-ignore See https://github.com/Diablow/zustand-store-addons/issues/2
      set({ isContextMenuOpen }),
    contextMenuLocation: undefined,
    setContextMenuLocation: (contextMenuLocation: Coordinate | undefined) =>
      // @ts-ignore See https://github.com/Diablow/zustand-store-addons/issues/2
      set({ contextMenuLocation }),
    selectedTool: getRouterValue("selectedTool") ?? Tools.SELECTION,
    selectedLabelId: getRouterValue("selectedLabelId") ?? null,
    selectedLabelClassId: getRouterValue("selectedLabelClassId") ?? null,
    boxDrawingToolState: DrawingToolState.IDLE,
    setDrawingToolState: (boxDrawingToolState: DrawingToolState) =>
      // @ts-ignore See https://github.com/Diablow/zustand-store-addons/issues/2
      set({ boxDrawingToolState }),
    selectionToolState: SelectionToolState.DEFAULT,
    setSelectionToolState: (selectionToolState: SelectionToolState) =>
      // @ts-ignore See https://github.com/Diablow/zustand-store-addons/issues/2
      set({ selectionToolState }),
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
    showLabelsGeometry: true,
    showLabelsName: true,
    changeLabelsVisibility: () => {
      const { showLabelsGeometry, showLabelsName } = get();
      if (showLabelsGeometry && showLabelsName) {
        // @ts-ignore See https://github.com/Diablow/zustand-store-addons/issues/2
        set({ showLabelsName: false });
        return;
      }
      if (showLabelsGeometry && !showLabelsName) {
        // @ts-ignore See https://github.com/Diablow/zustand-store-addons/issues/2
        set({ showLabelsGeometry: false });
        return;
      }
      if (!showLabelsGeometry && !showLabelsName) {
        // @ts-ignore See https://github.com/Diablow/zustand-store-addons/issues/2
        set({ showLabelsGeometry: true });
        // @ts-ignore See https://github.com/Diablow/zustand-store-addons/issues/2
        set({ showLabelsName: true });
      }
    },
  }),
  {
    computed: {
      iogSpinnerPosition() {
        if (!this.iogSpinnerPositions) {
          return null;
        }
        const latestPosition = Object.keys(this.iogSpinnerPositions).sort(
          (a, b) => (a > b ? -1 : 1)
        )[0];
        return this.iogSpinnerPositions[latestPosition];
      },
    },
    watchers: {
      selectedTool: setRouterValue("selectedTool"),
      selectedLabelId: setRouterValue("selectedLabelId"),
      selectedLabelClassId: setRouterValue("selectedLabelClassId"),
    },
  }
) as UseStore<LabelingState>; // Needed to correct https://github.com/Diablow/zustand-store-addons/issues/2

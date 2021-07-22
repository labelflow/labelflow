import { IconButton, Tooltip } from "@chakra-ui/react";
import { BiUndo, BiRedo } from "react-icons/bi";
import { useHotkeys } from "react-hotkeys-hook";

import { useUndoStore } from "../../../connectors/undo-store";

import { keymap } from "../../../keymap";
import {
  useLabellingStore,
  DrawingToolState,
} from "../../../connectors/labelling-state";

export type Props = {};

export const UndoTool = () => {
  const { undo, canUndo } = useUndoStore();
  const labellingStore = useLabellingStore();
  const drawingToolState = useLabellingStore(
    (state) => state.boxDrawingToolState
  );
  useHotkeys(
    keymap.undo.key,
    () => {
      const { boxDrawingToolState } = labellingStore.getState();
      if (boxDrawingToolState !== DrawingToolState.DRAWING) {
        undo();
      }
    },
    {},
    []
  );

  return (
    <Tooltip label={`Undo tool [${keymap.undo.key}]`} placement="right">
      <IconButton
        icon={<BiUndo size="1.3em" />}
        onClick={undo}
        backgroundColor="white"
        aria-label="Undo tool"
        pointerEvents="initial"
        isDisabled={!canUndo() || drawingToolState === DrawingToolState.DRAWING}
      />
    </Tooltip>
  );
};

export const RedoTool = () => {
  const { redo, canRedo } = useUndoStore();
  const labellingStore = useLabellingStore();
  const drawingToolState = useLabellingStore(
    (state) => state.boxDrawingToolState
  );

  useHotkeys(
    keymap.redo.key,
    () => {
      const { boxDrawingToolState } = labellingStore.getState();
      if (boxDrawingToolState !== DrawingToolState.DRAWING) {
        redo();
      }
    },
    {},
    []
  );

  return (
    <Tooltip label={`Redo tool [${keymap.redo.key}]`} placement="right">
      <IconButton
        icon={<BiRedo size="1.3em" />}
        onClick={redo}
        backgroundColor="white"
        aria-label="Redo tool"
        pointerEvents="initial"
        isDisabled={!canRedo() || drawingToolState === DrawingToolState.DRAWING}
      />
    </Tooltip>
  );
};

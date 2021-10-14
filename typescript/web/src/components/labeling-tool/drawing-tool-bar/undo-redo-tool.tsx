import {
  IconButton,
  Tooltip,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { BiUndo, BiRedo } from "react-icons/bi";
import { useHotkeys } from "react-hotkeys-hook";

import { useUndoStore } from "../../../connectors/undo-store";

import { keymap } from "../../../keymap";
import {
  useLabelingStore,
  DrawingToolState,
} from "../../../connectors/labeling-state";

export type Props = {};

export const UndoTool = () => {
  const { undo, canUndo } = useUndoStore();
  const drawingToolState = useLabelingStore(
    (state) => state.boxDrawingToolState
  );
  useHotkeys(
    keymap.undo.key,
    () => {
      if (drawingToolState !== DrawingToolState.DRAWING) {
        undo();
      }
    },
    {},
    [drawingToolState]
  );

  return (
    <Tooltip label={`Undo tool [${keymap.undo.key}]`} placement="right">
      <IconButton
        icon={<BiUndo size="1.3em" />}
        onClick={undo}
        backgroundColor={mode("white", "gray.800")}
        aria-label="Undo tool"
        pointerEvents="initial"
        isDisabled={!canUndo() || drawingToolState === DrawingToolState.DRAWING}
      />
    </Tooltip>
  );
};

export const RedoTool = () => {
  const { redo, canRedo } = useUndoStore();
  const drawingToolState = useLabelingStore(
    (state) => state.boxDrawingToolState
  );

  useHotkeys(
    keymap.redo.key,
    () => {
      if (drawingToolState !== DrawingToolState.DRAWING) {
        redo();
      }
    },
    {},
    [drawingToolState]
  );

  return (
    <Tooltip label={`Redo tool [${keymap.redo.key}]`} placement="right">
      <IconButton
        icon={<BiRedo size="1.3em" />}
        onClick={redo}
        backgroundColor={mode("white", "gray.800")}
        aria-label="Redo tool"
        pointerEvents="initial"
        isDisabled={!canRedo() || drawingToolState === DrawingToolState.DRAWING}
      />
    </Tooltip>
  );
};

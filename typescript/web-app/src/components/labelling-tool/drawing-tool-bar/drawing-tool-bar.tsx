import { SelectionTool } from "./selection-tool";
import { DrawingTool } from "./drawing-tool";
import { UndoTool, RedoTool } from "./undo-redo-tool";
import { SmartTool } from "./smart-tool";

export type Props = {};

export const DrawingToolbar = () => {
  return (
    <>
      <SelectionTool />
      <DrawingTool />
      <SmartTool />
      <UndoTool />
      <RedoTool />
    </>
  );
};

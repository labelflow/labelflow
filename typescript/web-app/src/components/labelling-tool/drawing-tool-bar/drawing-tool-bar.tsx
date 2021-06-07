import { SelectionTool } from "./selection-tool";
import { DrawingTool } from "./drawing-tool";

export type Props = {};

export const DrawingToolbar = () => {
  return (
    <>
      <SelectionTool />
      <DrawingTool />
    </>
  );
};

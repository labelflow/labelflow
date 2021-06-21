import { HStack } from "@chakra-ui/react";

import { SelectionTool } from "./selection-tool";
import { EditLabelClassMenu } from "./edit-label-class-menu";
import { DrawingTool } from "./drawing-tool";
import { UndoTool, RedoTool } from "./undo-redo-tool";

export type Props = {};

export const DrawingToolbar = () => {
  return (
    <>
      <HStack spacing={4}>
        <SelectionTool />
        <EditLabelClassMenu />
      </HStack>
      <DrawingTool />
      <UndoTool />
      <RedoTool />
    </>
  );
};

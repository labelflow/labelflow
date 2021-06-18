import { HStack } from "@chakra-ui/react";

import { SelectionTool } from "./selection-tool";
import { EditLabelMenu } from "./edit-label-menu";
import { DrawingTool } from "./drawing-tool";
import { UndoTool, RedoTool } from "./undo-redo-tool";

export type Props = {};

export const DrawingToolbar = () => {
  return (
    <>
      <HStack spacing={4}>
        <SelectionTool />
        <EditLabelMenu />
      </HStack>
      <DrawingTool />
      <UndoTool />
      <RedoTool />
    </>
  );
};

import { IconButton, Tooltip } from "@chakra-ui/react";
import { RiCheckboxBlankLine } from "react-icons/ri";
import { useHotkeys } from "react-hotkeys-hook";

import { useLabellingStore, Tools } from "../../../connectors/labelling-state";

import { keymap } from "../../../keymap";

export type Props = {};

export const DrawingTool = () => {
  const selectedTool = useLabellingStore((state) => state.selectedTool);
  const setSelectedTool = useLabellingStore((state) => state.setSelectedTool);

  useHotkeys(
    keymap.toolBoundingBox.key,
    () => setSelectedTool(Tools.BOX),
    {},
    []
  );

  return (
    <Tooltip
      label={`Drawing tool [${keymap.toolBoundingBox.key}]`}
      placement="right"
      openDelay={300}
    >
      <IconButton
        icon={<RiCheckboxBlankLine size="1.3em" />}
        role="checkbox"
        aria-checked={selectedTool === Tools.BOX}
        backgroundColor="white"
        aria-label="Drawing tool"
        pointerEvents="initial"
        onClick={() => setSelectedTool(Tools.BOX)}
        isActive={selectedTool === Tools.BOX}
      />
    </Tooltip>
  );
};

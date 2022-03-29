import { IconButton, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { BiPointer } from "react-icons/bi";
import { useHotkeys } from "react-hotkeys-hook";

import { useLabelingStore, Tools } from "../../../connectors/labeling-state";

import { keymap } from "../../../keymap";

export type Props = {};

export const SelectionTool = () => {
  const isImageLoading = useLabelingStore((state) => state.isImageLoading);
  const selectedTool = useLabelingStore((state) => state.selectedTool);
  const setSelectedTool = useLabelingStore((state) => state.setSelectedTool);
  useHotkeys(
    keymap.toolSelect.key,
    () => setSelectedTool(Tools.SELECTION),
    {},
    []
  );

  return (
    <Tooltip
      label={`Selection tool [${keymap.toolSelect.key}]`}
      placement="right"
      openDelay={300}
    >
      <IconButton
        icon={<BiPointer size="1.3em" />}
        isDisabled={isImageLoading}
        role="checkbox"
        aria-checked={selectedTool === Tools.SELECTION}
        onClick={() => setSelectedTool(Tools.SELECTION)}
        backgroundColor={useColorModeValue("white", "gray.800")}
        aria-label="Selection tool"
        pointerEvents="initial"
        isActive={selectedTool === Tools.SELECTION}
      />
    </Tooltip>
  );
};

import { IconButton, Tooltip } from "@chakra-ui/react";
import { RiCheckboxBlankLine } from "react-icons/ri";
import { useLabellingStore, Tools } from "../../../connectors/labelling-state";

export type Props = {};

export const DrawingTool = () => {
  const selectedTool = useLabellingStore((state) => state.selectedTool);
  const setSelectedTool = useLabellingStore((state) => state.setSelectedTool);

  return (
    <Tooltip label="Drawing tool" placement="right">
      <IconButton
        icon={<RiCheckboxBlankLine size="1.3em" />}
        role="checkbox"
        aria-checked={selectedTool === Tools.BOUNDING_BOX}
        backgroundColor="white"
        aria-label="Drawing tool"
        pointerEvents="initial"
        onClick={() => setSelectedTool(Tools.BOUNDING_BOX)}
      />
    </Tooltip>
  );
};

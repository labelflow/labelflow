import { IconButton, Tooltip } from "@chakra-ui/react";
import { BiPointer } from "react-icons/bi";

import { useHotkeys } from "react-hotkeys-hook";

import { keymap } from "../../../keymap";

export type Props = {};

export const SelectionTool = () => {
  useHotkeys(keymap.toolSelect.key, () => console.log("Select tool"), {}, []);

  return (
    <Tooltip
      label={`Selection tool [${keymap.toolSelect.key}]`}
      placement="right"
    >
      <IconButton
        icon={<BiPointer size="1.3em" />}
        backgroundColor="white"
        aria-label="Select tool"
        pointerEvents="initial"
      />
    </Tooltip>
  );
};

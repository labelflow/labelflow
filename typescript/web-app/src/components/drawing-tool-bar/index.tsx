import { IconButton, VStack, Tooltip } from "@chakra-ui/react";
import { BiPointer } from "react-icons/bi";

import { useHotkeys } from "react-hotkeys-hook";

import { keymap } from "../../keymap";

export type Props = {};

export const DrawingToolbar = () => {
  useHotkeys(keymap.toolSelect.key, () => console.log("Select tool"), {}, []);

  return (
    <VStack
      padding={4}
      spacing={4}
      position="absolute"
      top={0}
      left={0}
      pointerEvents="none"
    >
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
    </VStack>
  );
};

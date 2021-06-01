import { IconButton, Tooltip, useDisclosure, chakra } from "@chakra-ui/react";
import { FaRegKeyboard } from "react-icons/fa";
import { KeymapModal } from "./keymap-modal";

const UploadIcon = chakra(FaRegKeyboard);

export const KeymapButton = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <KeymapModal isOpen={isOpen} onClose={onClose} />
      <Tooltip label="Keyboard shortcuts">
        <IconButton
          aria-label="Add images"
          icon={<UploadIcon fontSize="xl" />}
          onClick={onOpen}
          variant="ghost"
        />
      </Tooltip>
    </>
  );
};

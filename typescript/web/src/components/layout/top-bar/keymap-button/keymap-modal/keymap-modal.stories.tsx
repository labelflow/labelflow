import { Button, useDisclosure } from "@chakra-ui/react";
import { chakraDecorator, storybookTitle } from "../../../../../utils/stories";
import { KeymapModal } from "./keymap-modal";

export default {
  title: storybookTitle(KeymapModal),
  decorators: [chakraDecorator],
};

const keymap = {
  goToPreviousImage: {
    key: "left",
    description: "Navigate to the previous image",
    category: "Navigation",
  },
  goToNextImage: {
    key: "right",
    description: "Navigate to the next image",
    category: "Navigation",
  },
  esc: {
    key: "esc",
    description: "Cancel current action",
    category: "General",
  },
  undo: {
    key: "command+z,ctrl+z",
    description: "Undo",
    category: "General",
  },
  redo: {
    key: "command+y,ctrl+y,command+shift+z,ctrl+shift+z",
    description: "Redo",
    category: "General",
  },
};

export const Default = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <Button onClick={onOpen}>Display</Button>
      <KeymapModal keymap={keymap} isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export const OpenedByDefault = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  return (
    <div>
      <Button onClick={onOpen}>Display</Button>
      <KeymapModal keymap={keymap} isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

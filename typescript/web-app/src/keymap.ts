export type Keymap = {
  [key: string]: {
    key: string;
    description: string;
    category: string;
  };
};

export const keymap = {
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

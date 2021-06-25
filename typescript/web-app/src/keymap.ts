export type Keymap = {
  [key: string]: {
    key: string;
    description: string;
    category: string;
  };
};

export const keymap: Keymap = {
  toolSelect: { key: "v", description: "Selection tool", category: "Tools" },
  toolBoundingBox: {
    key: "b",
    description: "Bounding box tool",
    category: "Tools",
  },
  openLabelClassSelectionPopover: {
    key: "c",
    description: "Change class of currently selected label",
    category: "Tools",
  },
  deleteLabel: {
    key: "del,delete,backspace",
    description: "Delete selected label",
    category: "Tools",
  },
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
  cancelAction: {
    key: "esc",
    description: "Cancel current action",
    category: "Edit",
  },
  undo: {
    key: "cmd+z,ctrl+z",
    description: "Undo last action",
    category: "Edit",
  },
  redo: {
    key: "cmd+shift+z,ctrl+y,ctrl+shift+y",
    description: "Redo last action",
    category: "Edit",
  },
};

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
  toolPolygon: {
    key: "p",
    description: "Polygon tool",
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
    key: "cmd+y,cmd+shift+z,ctrl+y,ctrl+shift+y",
    description: "Redo last action",
    category: "Edit",
  },
  changeClass: {
    key: "0,1,2,3,4,5,6,7,8,9", // TODO: display is messy on the shortcut modal with such an amount of shortcut, how to tackle that?
    description: "Select class corresponding to shortcut",
    category: "Tools", // TODO: change that category?
  },
  focusLabelClassSearch: {
    key: "/,f", // TODO: We changed the key "/" to "s" because the slash key was not detected by useHotKeys
    description: "Focus on search input in label class selection",
    category: "Tools", // TODO: change that category?
  },
  toolIog: {
    key: "i",
    description: "Inside outside guidance tool",
    category: "Tools",
  },
  validateIogLabel: {
    key: "enter",
    description: "Validate the edition of an IOG label",
    category: "Tools",
  },
};

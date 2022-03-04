export type Keymap = {
  [key: string]: {
    key: string;
    description: string;
    category: string;
  };
};

export const keymap: Keymap = {
  toolSelect: { key: "v", description: "Selection tool", category: "Tools" },
  toolClassification: {
    key: "k",
    description: "Classification tool",
    category: "Tools",
  },
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
  toolFreehand: {
    key: "h",
    description: "Freehand tool",
    category: "Tools",
  },
  openLabelClassSelectionPopover: {
    key: "c",
    description: "Change class of currently selected label",
    category: "Actions",
  },
  deselect: {
    key: "d",
    description: "Clear selection",
    category: "Actions",
  },
  deleteLabel: {
    key: "del,delete,backspace",
    description: "Delete selected label",
    category: "Actions",
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
    category: "Actions", // TODO: change that category?
  },
  focusLabelClassSearch: {
    key: "/,s", // TODO: We changed the key "/" to "s" because the slash key was not detected by useHotKeys
    description: "Search class by name input in class selection",
    category: "Actions", // TODO: change that category?
  },
  toolIog: {
    key: "a",
    description: "Auto Polygon",
    category: "Tools",
  },
  changeSelectionMode: {
    key: "e",
    description:
      "Switch between default selection and Auto Polygon edition tool",
    category: "Tools",
  },
  validateIogLabel: {
    key: "enter",
    description: "Validate the edition of an Auto Polygon label",
    category: "Tools",
  },
  enterFullScreen: {
    key: "f",
    description: "Enter Full Screen",
    category: "View",
  },
  zoomIn: {
    key: "+,=",
    description: "Zoom in",
    category: "View",
  },
  zoomOut: {
    key: "-",
    description: "Zoom out",
    category: "View",
  },
  changeLabelsVisibility: {
    key: "x",
    description: "Change labels geometry and name visibility",
    category: "View",
  },
};

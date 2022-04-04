import { useColorModeValue } from "@chakra-ui/react";
import { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useLabelingStore } from "../../../connectors/labeling-state";
import { keymap } from "../../../keymap";
import { Icon, IconButton, ViewModeIconName } from "../../core";

const useViewModeIcon = (): ViewModeIconName => {
  const showLabelsGeometry = useLabelingStore(
    (state) => state.showLabelsGeometry
  );
  const showLabelsName = useLabelingStore((state) => state.showLabelsName);
  if (!showLabelsGeometry) return "hideAllViewMode";
  return showLabelsName ? "showAllViewMode" : "showGeometryViewMode";
};

const ViewModeIcon = () => (
  <Icon
    name={useViewModeIcon()}
    fill={useColorModeValue("black", "white")}
    boxSize={5}
  />
);

const useToggleViewMode = () => {
  const toggleViewMode = useLabelingStore((state) => state.toggleViewMode);
  const handleToggleViewMode = useCallback(toggleViewMode, [toggleViewMode]);
  useHotkeys(keymap.toggleViewMode.key, handleToggleViewMode, {}, []);
  return handleToggleViewMode;
};

export const ViewModeTool = () => (
  <IconButton
    label={`${keymap.toggleViewMode.description} [${keymap.toggleViewMode.key}]`}
    tooltip={{ placement: "left" }}
    icon={<ViewModeIcon />}
    backgroundColor={useColorModeValue("white", "gray.800")}
    aria-label="Change elements visibility"
    pointerEvents="initial"
    onClick={useToggleViewMode()}
  />
);

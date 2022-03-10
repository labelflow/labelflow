import {
  Icon,
  IconButton,
  Tooltip,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useLabelingStore } from "../../../connectors/labeling-state";
import { keymap } from "../../../keymap";
import HideAllSvg from "./view-mode-hide-all.svg";
import ShowGeometrySvg from "./view-mode-show-geometry.svg";
import ShowAllSvg from "./view-mode-show-all.svg";

const useViewModeIcon = () => {
  const showLabelsGeometry = useLabelingStore(
    (state) => state.showLabelsGeometry
  );
  const showLabelsName = useLabelingStore((state) => state.showLabelsName);
  if (!showLabelsGeometry) return HideAllSvg;
  return showLabelsName ? ShowAllSvg : ShowGeometrySvg;
};

const ViewModeIcon = () => {
  const IconSvg = useViewModeIcon();
  return (
    <Icon fill={mode("black", "white")} boxSize={6}>
      <IconSvg />
    </Icon>
  );
};

const useToggleViewMode = () => {
  const toggleViewMode = useLabelingStore((state) => state.toggleViewMode);
  const handleToggleViewMode = useCallback(toggleViewMode, [toggleViewMode]);
  useHotkeys(keymap.toggleViewMode.key, handleToggleViewMode, {}, []);
  return handleToggleViewMode;
};

export const ViewModeButton = () => (
  <Tooltip
    label={`${keymap.toggleViewMode.description} [${keymap.toggleViewMode.key}]`}
    placement="left"
    openDelay={300}
  >
    <IconButton
      icon={<ViewModeIcon />}
      backgroundColor={mode("white", "gray.800")}
      aria-label="Change elements visibility"
      pointerEvents="initial"
      onClick={useToggleViewMode()}
    />
  </Tooltip>
);

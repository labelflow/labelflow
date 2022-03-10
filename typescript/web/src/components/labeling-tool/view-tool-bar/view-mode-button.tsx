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
import HideGeometryLabelsSvg from "../../graphics/hide-geometry-labels.svg";
import ShowGeometryLabelsSvg from "../../graphics/show-geometry-labels.svg";
import ShowGeometrySvg from "../../graphics/show-geometry.svg";

const getIcon = (showLabelsGeometry: boolean, showLabelsName: boolean) => {
  if (showLabelsGeometry && showLabelsName) {
    return ShowGeometryLabelsSvg;
  }
  if (showLabelsGeometry && !showLabelsName) {
    return ShowGeometrySvg;
  }
  return HideGeometryLabelsSvg;
};

export const ViewModeButton = () => {
  const toggleViewMode = useLabelingStore((state) => state.toggleViewMode);
  const showLabelsGeometry = useLabelingStore(
    (state) => state.showLabelsGeometry
  );
  const showLabelsName = useLabelingStore((state) => state.showLabelsName);
  const IconSvg = getIcon(showLabelsGeometry, showLabelsName);
  const changeVisibility = useCallback(
    () => toggleViewMode(),
    [toggleViewMode]
  );
  useHotkeys(keymap.toggleViewMode.key, changeVisibility, {}, []);
  return (
    <Tooltip
      label={`${keymap.toggleViewMode.description} [${keymap.toggleViewMode.key}]`}
      placement="left"
      openDelay={300}
    >
      <IconButton
        icon={
          <Icon fill={mode("black", "white")} boxSize={6}>
            <IconSvg />
          </Icon>
        }
        backgroundColor={mode("white", "gray.800")}
        aria-label="Change elements visibility"
        pointerEvents="initial"
        onClick={changeVisibility}
      />
    </Tooltip>
  );
};

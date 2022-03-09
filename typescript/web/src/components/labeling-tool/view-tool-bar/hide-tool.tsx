import {
  IconButton,
  Tooltip,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { chakra } from "@chakra-ui/system";
import { FC, SVGAttributes, useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useLabelingStore } from "../../../connectors/labeling-state";
import { keymap } from "../../../keymap";
import HideGeometryLabelsSvg from "../../graphics/hide-geometry-labels";
import ShowGeometryLabelsSvg from "../../graphics/show-geometry-labels";
import ShowGeometrySvg from "../../graphics/show-geometry";

const ShowGeometryLabels = chakra<FC<SVGAttributes<SVGElement>>>(
  ShowGeometryLabelsSvg
);
const ShowGeometry = chakra<FC<SVGAttributes<SVGElement>>>(ShowGeometrySvg);
const HideGeometryLabels = chakra<FC<SVGAttributes<SVGElement>>>(
  HideGeometryLabelsSvg
);

const getIcon = (showLabelsGeometry: boolean, showLabelsName: boolean) => {
  if (showLabelsGeometry && showLabelsName) {
    return ShowGeometryLabels;
  }
  if (showLabelsGeometry && !showLabelsName) {
    return ShowGeometry;
  }
  return HideGeometryLabels;
};

export const HideTool = () => {
  const changeLabelsVisibility = useLabelingStore(
    (state) => state.changeLabelsVisibility
  );
  const showLabelsGeometry = useLabelingStore(
    (state) => state.showLabelsGeometry
  );
  const showLabelsName = useLabelingStore((state) => state.showLabelsName);
  const Icon = getIcon(showLabelsGeometry, showLabelsName);
  const changeVisibility = useCallback(
    () => changeLabelsVisibility(),
    [changeLabelsVisibility]
  );
  useHotkeys(keymap.changeLabelsVisibility.key, changeVisibility, {}, []);
  return (
    <Tooltip
      label={`${keymap.changeLabelsVisibility.description} [${keymap.changeLabelsVisibility.key}]`}
      placement="left"
      openDelay={300}
    >
      <IconButton
        icon={<Icon />}
        backgroundColor={mode("white", "gray.800")}
        aria-label="Change elements visibility"
        pointerEvents="initial"
        onClick={changeVisibility}
      />
    </Tooltip>
  );
};

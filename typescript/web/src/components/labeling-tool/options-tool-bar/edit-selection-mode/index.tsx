import { BiShapePolygon } from "react-icons/bi";
import { IoColorWandOutline } from "react-icons/io5";
import { chakra, useColorModeValue } from "@chakra-ui/react";
import { useHotkeys } from "react-hotkeys-hook";
import * as React from "react";

import {
  useLabelingStore,
  SelectionToolState,
} from "../../../../connectors/labeling-state";
import { keymap } from "../../../../keymap";
import { ToggleButtonGroup } from "./ToggleButtonGroup";
import { ToggleButton } from "./ToggleButton";

const ChakraBiShapePolygon = chakra(BiShapePolygon);
const ChakraIoColorWandOutline = chakra(IoColorWandOutline);

export const EditSelectionMode = () => {
  const selectedLabelId = useLabelingStore((state) => state.selectedLabelId);
  const selectionToolState = useLabelingStore(
    (state) => state.selectionToolState
  );
  const setSelectionToolState = useLabelingStore(
    (state) => state.setSelectionToolState
  );
  useHotkeys(
    keymap.changeSelectionMode.key,
    () => {
      if (selectionToolState === SelectionToolState.DEFAULT) {
        setSelectionToolState(SelectionToolState.IOG);
      } else {
        setSelectionToolState(SelectionToolState.DEFAULT);
      }
    },
    [selectionToolState, setSelectionToolState]
  );
  const bg = useColorModeValue("white", "gray.800");

  if (!selectedLabelId) {
    return null;
  }

  return (
    <ToggleButtonGroup
      value={selectionToolState}
      onChange={setSelectionToolState}
      defaultValue={SelectionToolState.DEFAULT}
      isAttached
      variant="outline"
      aria-label="Edit selection mode"
    >
      <ToggleButton
        value={SelectionToolState.DEFAULT}
        aria-label="Choose default selection mode"
        bg={bg}
        pointerEvents="initial"
        icon={<ChakraBiShapePolygon size="1.3em" />}
      />
      <ToggleButton
        value={SelectionToolState.IOG}
        aria-label="Choose auto annotate selection mode"
        bg={bg}
        pointerEvents="initial"
        icon={<ChakraIoColorWandOutline size="1.3em" />}
      />
    </ToggleButtonGroup>
  );
};

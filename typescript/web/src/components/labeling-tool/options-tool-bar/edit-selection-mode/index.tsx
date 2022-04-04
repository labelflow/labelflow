import { useQuery } from "@apollo/client";
import { BiShapePolygon } from "react-icons/bi";
import { IoColorWandOutline } from "react-icons/io5";
import { chakra, useColorModeValue } from "@chakra-ui/react";
import { useHotkeys } from "react-hotkeys-hook";

import { useEffect } from "react";
import {
  useLabelingStore,
  SelectionToolState,
  Tools,
} from "../../../../connectors/labeling-state";
import { keymap } from "../../../../keymap";
import { ToggleButtonGroup, ToggleIconButton } from "../../../core";

import { LABEL_QUERY } from "../../openlayers-map/iog/queries";

const ChakraBiShapePolygon = chakra(BiShapePolygon);
const ChakraIoColorWandOutline = chakra(IoColorWandOutline);

export const EditSelectionMode = () => {
  const selectedLabelId = useLabelingStore((state) => state.selectedLabelId);
  const { data: dataLabelQuery } = useQuery(LABEL_QUERY, {
    variables: { id: selectedLabelId },
    skip: selectedLabelId == null,
  });
  const isIogModeAvailable = dataLabelQuery?.label?.smartToolInput != null;
  const selectedTool = useLabelingStore((state) => state.selectedTool);
  const selectionToolState = useLabelingStore(
    (state) => state.selectionToolState
  );
  const setSelectionToolState = useLabelingStore(
    (state) => state.setSelectionToolState
  );
  useEffect(() => {
    if (selectionToolState === SelectionToolState.IOG && !isIogModeAvailable)
      setSelectionToolState(SelectionToolState.DEFAULT);
  }, [selectionToolState]);
  useHotkeys(
    keymap.changeSelectionMode.key,
    () => {
      if (
        selectionToolState === SelectionToolState.DEFAULT &&
        isIogModeAvailable
      ) {
        setSelectionToolState(SelectionToolState.IOG);
      } else {
        setSelectionToolState(SelectionToolState.DEFAULT);
      }
    },
    [selectionToolState, setSelectionToolState, isIogModeAvailable]
  );
  const bg = useColorModeValue("white", "gray.800");

  if (
    !selectedLabelId ||
    (selectedTool !== Tools.SELECTION && selectedTool !== Tools.AI_ASSISTANT) ||
    !isIogModeAvailable
  ) {
    return null;
  }

  return (
    <ToggleButtonGroup
      value={selectionToolState}
      onChange={setSelectionToolState}
      defaultValue={SelectionToolState.DEFAULT}
      aria-label="Edit selection mode"
    >
      <ToggleIconButton
        value={SelectionToolState.DEFAULT}
        description="Choose default selection mode [e]"
        aria-label="Choose default selection mode"
        bg={bg}
        pointerEvents="initial"
        icon={<ChakraBiShapePolygon size="1.3em" />}
      />
      <ToggleIconButton
        value={SelectionToolState.IOG}
        description="Choose auto annotate edition mode [e]"
        aria-label="Choose auto annotate selection mode"
        bg={bg}
        pointerEvents="initial"
        icon={<ChakraIoColorWandOutline size="1.3em" />}
        disabled={!isIogModeAvailable}
      />
    </ToggleButtonGroup>
  );
};

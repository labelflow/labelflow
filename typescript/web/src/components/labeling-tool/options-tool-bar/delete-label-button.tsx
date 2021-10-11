import { useCallback } from "react";
import { useApolloClient } from "@apollo/client";

import { useHotkeys } from "react-hotkeys-hook";

import {
  chakra,
  IconButton,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { RiDeleteBinLine } from "react-icons/ri";

import { useUndoStore } from "../../../connectors/undo-store";
import { useLabelingStore } from "../../../connectors/labeling-state";

import { keymap } from "../../../keymap";
import { createDeleteLabelEffect } from "../../../connectors/undo-store/effects/delete-label";

const DeleteIcon = chakra(RiDeleteBinLine);

export const DeleteLabelButton = () => {
  const client = useApolloClient();
  const selectedLabelId = useLabelingStore((state) => state.selectedLabelId);
  const setSelectedLabelId = useLabelingStore(
    (state) => state.setSelectedLabelId
  );

  const { perform } = useUndoStore();

  useHotkeys(
    keymap.deleteLabel.key,
    () => {
      if (!selectedLabelId) {
        return;
      }

      perform(
        createDeleteLabelEffect(
          { id: selectedLabelId },
          { setSelectedLabelId, client }
        )
      );
    },
    {},
    [selectedLabelId, setSelectedLabelId]
  );

  const deleteSelectedLabel = useCallback(() => {
    if (!selectedLabelId) {
      return;
    }

    perform(
      createDeleteLabelEffect(
        { id: selectedLabelId },
        { setSelectedLabelId, client }
      )
    );
  }, [selectedLabelId, setSelectedLabelId]);

  const bg = useColorModeValue("white", "gray.800");

  if (!selectedLabelId) {
    return null;
  }

  return (
    <Tooltip
      label={`Delete selected label [${keymap.deleteLabel.key}]`}
      placement="bottom"
      openDelay={300}
    >
      <IconButton
        icon={<DeleteIcon fontSize="xl" />}
        onClick={deleteSelectedLabel}
        bg={bg}
        pointerEvents="initial"
        aria-label="Delete selected label"
      />
    </Tooltip>
  );
};

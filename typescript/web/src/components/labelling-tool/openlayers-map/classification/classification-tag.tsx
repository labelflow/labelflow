import React, { useState, useEffect } from "react";
import { Tag, TagLabel, TagCloseButton } from "@chakra-ui/react";
import { Label, LabelClass } from "@labelflow/graphql-types";
import { ApolloClient } from "@apollo/client";
import { useHotkeys } from "react-hotkeys-hook";

import { createDeleteLabelEffect } from "../../../../connectors/undo-store/effects/delete-label";
import { ClassSelectionPopover } from "../../../class-selection-popover";
import { noneClassColor } from "../../../../utils/class-color-generator";
import { useUndoStore } from "../../../../connectors/undo-store";
import { keymap } from "../../../../keymap";
import { useLabellingStore } from "../../../../connectors/labelling-state";

// The class selection menu doesn't need all the attributes of the label class
export type LabelClassItem = Omit<LabelClass, "dataset">;

export const ClassificationTag = ({
  label,
  selectedLabelId,
  setSelectedLabelId,
  labelClasses,
  createNewClass,
  onSelectedClassChange,
  client,
}: {
  label: Label;
  onSelectedClassChange: (item: LabelClassItem | null) => void;
  createNewClass: (name: string) => void;
  labelClasses: LabelClassItem[];
  selectedLabelId: string | null;
  setSelectedLabelId: (labelId: string | null) => void;
  client: ApolloClient<any>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { perform } = useUndoStore();
  const { id, labelClass } = label;
  const handleClick = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ): void => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedLabelId(id);
    if (e.type === "contextmenu") {
      setIsOpen(!isOpen);
    }
  };
  const close = () => setIsOpen(false);

  useHotkeys(
    keymap.openLabelClassSelectionPopover.key,
    () => {
      if (id === selectedLabelId) {
        setIsOpen(true);
      }
    },
    {},
    [id, selectedLabelId, setIsOpen]
  );

  useHotkeys(
    keymap.deselect.key,
    () => {
      if (id === selectedLabelId) {
        console.log("deselect current classification tag");
        setIsOpen(false);
        useLabellingStore.getState().setIsContextMenuOpen(false);
        useLabellingStore.getState().setSelectedLabelId(null);
      }
    },
    {},
    [id, selectedLabelId, setIsOpen]
  );

  useEffect(() => {
    // Close context menu if the tag becomes deselected
    if (selectedLabelId !== id) {
      setIsOpen(false);
    }
  }, [selectedLabelId]);

  return (
    <ClassSelectionPopover
      ariaLabel="Classification tag class selection menu popover"
      isOpen={isOpen}
      onClose={close}
      labelClasses={labelClasses}
      includeNoneClass={false}
      onSelectedClassChange={(selectedLabelClass: LabelClassItem | null) => {
        onSelectedClassChange(selectedLabelClass);
        close();
      }}
      createNewClass={(name: string) => {
        createNewClass(name);
        close();
      }}
      selectedLabelClassId={labelClass?.id ?? null}
      trigger={
        <Tag
          aria-label={`Classification tag: ${labelClass?.name ?? "None"}`}
          key={id}
          size="md"
          variant="solid"
          background={`${labelClass?.color ?? noneClassColor}AA`}
          borderColor={
            id === selectedLabelId
              ? labelClass?.color ?? noneClassColor
              : "transparent"
          }
          color={labelClass ? "white" : "black"}
          borderStyle="solid"
          borderWidth={4}
          onClick={handleClick}
          onContextMenu={handleClick}
          cursor="pointer"
          boxSizing="content-box"
        >
          <TagLabel>{labelClass?.name ?? "None"}</TagLabel>
          <TagCloseButton
            onClick={(e) => {
              e.stopPropagation();
              return perform(
                createDeleteLabelEffect({ id }, { setSelectedLabelId, client })
              );
            }}
          />
        </Tag>
      }
      activateShortcuts={isOpen}
    />
  );
};

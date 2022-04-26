import { ApolloClient } from "@apollo/client";
import { Tag, TagCloseButton, TagLabel } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useLabelingStore } from "../../../../connectors/labeling-state";
import { useUndoStore } from "../../../../connectors/undo-store";
import { createDeleteLabelEffect } from "../../../../connectors/undo-store/effects/delete-label";
import { noneClassColor } from "../../../../theme";
import { keymap } from "../../../../keymap";
import { ClassSelectionPopover } from "../../../class-selection-popover";
import { GetImageLabelsQuery_image_labels } from "../../../../graphql-types/GetImageLabelsQuery";
import { GetLabelClassesOfDatasetQuery_dataset_labelClasses } from "../../../../graphql-types/GetLabelClassesOfDatasetQuery";

export type LabelClassItem = GetLabelClassesOfDatasetQuery_dataset_labelClasses;

export const ClassificationTag = ({
  label,
  selectedLabelId,
  setSelectedLabelId,
  labelClasses,
  createNewClass,
  onSelectedClassChange,
  client,
}: {
  label: GetImageLabelsQuery_image_labels;
  onSelectedClassChange: (item: LabelClassItem | null) => void;
  createNewClass: (name: string) => void;
  labelClasses: GetLabelClassesOfDatasetQuery_dataset_labelClasses[];
  selectedLabelId: string | null;
  setSelectedLabelId: (labelId: string | null) => void;
  client: ApolloClient<object>;
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
        setIsOpen(false);
        useLabelingStore.getState().setIsContextMenuOpen(false);
        useLabelingStore.getState().setSelectedLabelId(null);
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

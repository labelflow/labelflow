import React, { useState } from "react";
import { Tag, TagLabel, TagCloseButton } from "@chakra-ui/react";
import { Label, LabelClass } from "@labelflow/graphql-types";
import { ApolloClient } from "@apollo/client";

import { createDeleteLabelEffect } from "../../../../connectors/undo-store/effects/delete-label";
import { ClassSelectionPopover } from "../../../class-selection-popover";
import { noneClassColor } from "../../../../utils/class-color-generator";
import { useUndoStore } from "../../../../connectors/undo-store";

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
    setSelectedLabelId(id);
    if (e.type === "contextmenu") {
      setIsOpen(!isOpen);
    }
  };
  const close = () => setIsOpen(false);

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

import { useMemo } from "react";
import { useQuery, useApolloClient } from "@apollo/client";
import gql from "graphql-tag";

import { ClassSelectionMenu } from "../../class-selection-menu";
import { Tools, useLabellingStore } from "../../../connectors/labelling-state";
import { useUndoStore } from "../../../connectors/undo-store";
import { LabelClass } from "../../../graphql-types.generated";
import { createNewLabelClassAndUpdateLabelCurry } from "../../../connectors/undo-store/effects/create-label-class-and-update-label";
import { createUpdateLabelClassOfLabelEffect } from "../../../connectors/undo-store/effects/update-label-class-of-label";
import { createNewLabelClassCurry } from "../../../connectors/undo-store/effects/create-label-class";
import { createUpdateLabelClassEffect } from "../../../connectors/undo-store/effects/update-label-class";
import { useHotkeys } from "react-hotkeys-hook";
import { keymap } from "../../../keymap";

const labelClassesQuery = gql`
  query getLabelClasses {
    labelClasses {
      id
      name
      color
    }
  }
`;

const labelClassQuery = gql`
  query getLabelClass($id: ID!) {
    labelClass(where: { id: $id }) {
      id
      name
      color
    }
  }
`;

const labelQuery = gql`
  query getLabel($id: ID!) {
    label(where: { id: $id }) {
      id
      labelClass {
        id
        name
        color
      }
    }
  }
`;

export const EditLabelClassMenu = () => {
  const client = useApolloClient();
  const { data } = useQuery(labelClassesQuery);
  const { perform } = useUndoStore();
  const labelClasses = data?.labelClasses ?? [];
  const isClassSelectionPopoverOpenedOnRightClick = useLabellingStore(
    (state) => state.isClassSelectionPopoverOpenedOnRightClick
  );
  const selectedTool = useLabellingStore((state) => state.selectedTool);
  const selectedLabelId = useLabellingStore((state) => state.selectedLabelId);
  const { data: selectedLabelData } = useQuery(labelQuery, {
    variables: { id: selectedLabelId },
    skip: selectedLabelId == null,
  });
  const selectedLabelClassId = useLabellingStore(
    (state) => state.selectedLabelClassId
  );
  const { data: dataLabelClass } = useQuery(labelClassQuery, {
    variables: { id: selectedLabelClassId },
    skip: selectedLabelClassId == null,
  });
  const selectedLabelClass =
    selectedTool === Tools.BOUNDING_BOX
      ? dataLabelClass?.labelClass
      : selectedLabelData?.label?.labelClass;
  const createNewClass = useMemo(
    () =>
      createNewLabelClassCurry({
        labelClasses,
        perform,
        client,
      }),
    [labelClasses, selectedTool]
  );
  const createNewClassAndUpdateLabel = useMemo(
    () =>
      createNewLabelClassAndUpdateLabelCurry({
        labelClasses,
        perform,
        client,
      }),
    [labelClasses]
  );
  const onSelectedClassChange = useMemo(
    () =>
      selectedTool === Tools.BOUNDING_BOX
        ? (item: LabelClass | null) =>
            perform(
              createUpdateLabelClassEffect({
                selectedLabelClassId: item?.id ?? null,
                selectedLabelClassIdPrevious: selectedLabelClassId,
              })
            )
        : (item: LabelClass | null) =>
            perform(
              createUpdateLabelClassOfLabelEffect(
                {
                  selectedLabelClassId: item?.id ?? null,
                  selectedLabelId,
                },
                { client }
              )
            ),
    [selectedLabelId, selectedLabelClassId, selectedTool]
  );

  const displayClassSelectionMenu =
    selectedTool === Tools.BOUNDING_BOX ||
    (selectedTool === Tools.SELECTION && selectedLabelId != null);

  useHotkeys(
    keymap.changeClass.key,
    (keyboardEvent) => {
      if (!isClassSelectionPopoverOpenedOnRightClick) {
        // We do not want to interfere with the right click popover shortcuts if it is opened
        const digit = Number(keyboardEvent.code[5]);
        const indexOfLabelClass = (digit + 9) % 10;
        if (indexOfLabelClass < labelClasses.length) {
          onSelectedClassChange(labelClasses[indexOfLabelClass]);
        }
      }
    },
    {},
    [labelClasses, onSelectedClassChange]
  );

  return (
    <>
      {displayClassSelectionMenu && (
        <ClassSelectionMenu
          selectedLabelClass={selectedLabelClass}
          labelClasses={labelClasses}
          createNewClass={async (name) =>
            selectedTool === Tools.BOUNDING_BOX
              ? createNewClass(name, selectedLabelClassId)
              : createNewClassAndUpdateLabel(name, selectedLabelId)
          }
          onSelectedClassChange={(item) => {
            onSelectedClassChange(item);
          }}
          isClassSelectionPopoverOpenedOnRightClick={
            isClassSelectionPopoverOpenedOnRightClick
          }
        />
      )}
    </>
  );
};

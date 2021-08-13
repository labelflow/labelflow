import { useMemo, useState, useEffect } from "react";
import { gql, useQuery, useApolloClient } from "@apollo/client";

import { useHotkeys } from "react-hotkeys-hook";
import { useRouter } from "next/router";
import { ClassSelectionMenu, LabelClassItem } from "./class-selection-menu";
import { Tools, useLabellingStore } from "../../../connectors/labelling-state";
import { useUndoStore } from "../../../connectors/undo-store";
import { createNewLabelClassAndUpdateLabelCurry } from "../../../connectors/undo-store/effects/create-label-class-and-update-label";
import { createUpdateLabelClassOfLabelEffect } from "../../../connectors/undo-store/effects/update-label-class-of-label";
import { createNewLabelClassCurry } from "../../../connectors/undo-store/effects/create-label-class";
import { createUpdateLabelClassEffect } from "../../../connectors/undo-store/effects/update-label-class";
import { keymap } from "../../../keymap";

const labelClassesOfDatasetQuery = gql`
  query getLabelClassesOfDataset($datasetId: ID!) {
    labelClasses(where: { datasetId: $datasetId }) {
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
  const router = useRouter();
  const datasetId = router?.query.datasetId as string;
  const client = useApolloClient();
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useQuery(labelClassesOfDatasetQuery, {
    variables: { datasetId },
  });
  const { perform } = useUndoStore();
  const labelClasses = data?.labelClasses ?? [];
  const isContextMenuOpen = useLabellingStore(
    (state) => state.isContextMenuOpen
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
  const setSelectedLabelClassId = useLabellingStore(
    (state) => state.setSelectedLabelClassId
  );

  useEffect(() => {
    setSelectedLabelClassId(null);
  }, [datasetId]);

  const { data: dataLabelClass } = useQuery(labelClassQuery, {
    variables: { id: selectedLabelClassId },
    skip: selectedLabelClassId == null,
  });
  const isInDrawingMode = [Tools.BOX, Tools.POLYGON].includes(selectedTool);
  const selectedLabelClass = isInDrawingMode
    ? dataLabelClass?.labelClass
    : selectedLabelData?.label?.labelClass;
  const createNewClass = useMemo(
    () =>
      createNewLabelClassCurry({
        labelClasses,
        datasetId,
        perform,
        client,
      }),
    [labelClasses, selectedTool]
  );
  const createNewClassAndUpdateLabel = useMemo(
    () =>
      createNewLabelClassAndUpdateLabelCurry({
        labelClasses,
        datasetId,
        perform,
        client,
      }),
    [labelClasses]
  );
  const onSelectedClassChange = useMemo(
    () =>
      isInDrawingMode
        ? (item: LabelClassItem | null) =>
            perform(
              createUpdateLabelClassEffect({
                selectedLabelClassId: item?.id ?? null,
                selectedLabelClassIdPrevious: selectedLabelClassId,
              })
            )
        : (item: LabelClassItem | null) =>
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
    isInDrawingMode ||
    (selectedTool === Tools.SELECTION && selectedLabelId != null);

  useHotkeys(
    keymap.changeClass.key,
    (keyboardEvent) => {
      if (!isContextMenuOpen) {
        // We do not want to interfere with the right click popover shortcuts if it is opened
        const digit = Number(keyboardEvent.code[5]);
        const indexOfLabelClass = (digit + 9) % 10;
        if (indexOfLabelClass < labelClasses.length) {
          onSelectedClassChange(labelClasses[indexOfLabelClass]);
          setIsOpen(false);
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
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          selectedLabelClass={selectedLabelClass}
          labelClasses={labelClasses}
          createNewClass={async (name) =>
            isInDrawingMode
              ? createNewClass(name, selectedLabelClassId)
              : createNewClassAndUpdateLabel(name, selectedLabelId)
          }
          onSelectedClassChange={(item) => {
            onSelectedClassChange(item);
          }}
          isContextMenuOpen={isContextMenuOpen}
        />
      )}
    </>
  );
};

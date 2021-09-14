import { forwardRef, useMemo } from "react";
import { useQuery, useApolloClient, gql } from "@apollo/client";
import { useRouter } from "next/router";

import { useHotkeys } from "react-hotkeys-hook";

import { ClassSelectionPopover } from "../../class-selection-popover";
import { useLabellingStore } from "../../../connectors/labelling-state";
import { useUndoStore } from "../../../connectors/undo-store";
import { createNewLabelClassAndUpdateLabelCurry } from "../../../connectors/undo-store/effects/create-label-class-and-update-label";
import { createUpdateLabelClassOfLabelEffect } from "../../../connectors/undo-store/effects/update-label-class-of-label";
import { keymap } from "../../../keymap";

const getLabelClassesOfDatasetQuery = gql`
  query getLabelClassesOfDataset($slug: String!) {
    dataset(where: { slug: $slug }) {
      id
      labelClasses {
        id
        name
        color
      }
    }
  }
`;

const labelQuery = gql`
  query getLabel($id: ID!) {
    label(where: { id: $id }) {
      id
      labelClass {
        id
      }
    }
  }
`;

export const EditLabelClass = forwardRef<
  HTMLDivElement | null,
  {
    isOpen: boolean;
    onClose: () => void;
  }
>(({ isOpen, onClose }, ref) => {
  const router = useRouter();
  const datasetSlug = router?.query.datasetSlug as string;

  const client = useApolloClient();
  const { data } = useQuery(getLabelClassesOfDatasetQuery, {
    variables: { slug: datasetSlug },
    skip: !datasetSlug,
  });
  const datasetId = data?.dataset.id;
  const { perform } = useUndoStore();
  const labelClasses = data?.dataset.labelClasses ?? [];
  const selectedLabelId = useLabellingStore((state) => state.selectedLabelId);
  const isContextMenuOpen = useLabellingStore(
    (state) => state.isContextMenuOpen
  );
  const { data: labelQueryData } = useQuery(labelQuery, {
    variables: { id: selectedLabelId },
    skip: selectedLabelId == null,
  });
  const selectedLabelClassId = labelQueryData?.label?.labelClass?.id ?? null;
  const createNewClass = useMemo(
    () =>
      createNewLabelClassAndUpdateLabelCurry({
        labelClasses,
        datasetId,
        datasetSlug,
        perform,
        onClose,
        client,
      }),
    [labelClasses, datasetId]
  );
  useHotkeys(
    "*", // We have to manually check if the input corresponds to a change class key because otherwise on AZERTY keyboards we can't change classes when pressing numbers
    (keyboardEvent) => {
      if (
        keymap.changeClass.key.split(",").includes(keyboardEvent.key) &&
        isOpen
      ) {
        // We do not want to interfere with the class menu shortcuts if this modal is closed
        const digit = Number(keyboardEvent.code[5]);
        const indexOfLabelClass = (digit + 9) % 10;
        if (indexOfLabelClass < labelClasses.length) {
          perform(
            createUpdateLabelClassOfLabelEffect(
              {
                selectedLabelId,
                selectedLabelClassId: labelClasses[indexOfLabelClass]?.id,
              },
              { client }
            )
          );
          onClose();
        }
      }
    },
    {},
    [labelClasses, isOpen]
  );

  return (
    <div ref={ref}>
      <ClassSelectionPopover
        isOpen={isOpen}
        onClose={onClose}
        activateShortcuts={isContextMenuOpen}
        trigger={<div style={{ width: 0, height: 0 }} />} // Needed to have the popover displayed preventing overflow
        labelClasses={labelClasses}
        selectedLabelClassId={selectedLabelClassId}
        createNewClass={async (name) => {
          return await createNewClass(name, selectedLabelId);
        }}
        onSelectedClassChange={(item) => {
          perform(
            createUpdateLabelClassOfLabelEffect(
              {
                selectedLabelId,
                selectedLabelClassId: item?.id ?? null,
              },
              { client }
            )
          );
          onClose();
        }}
      />
    </div>
  );
});

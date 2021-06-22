import { forwardRef, useMemo, Ref } from "react";
import { useQuery, useApolloClient } from "@apollo/client";
import gql from "graphql-tag";

import { ClassSelectionPopover } from "../../class-selection-popover";
import { useLabellingStore } from "../../../connectors/labelling-state";
import { useUndoStore } from "../../../connectors/undo-store";
import { createNewLabelClassAndUpdateLabelCurry } from "../../../connectors/undo-store/effects/create-label-class-and-update-label";
import { createUpdateLabelClassOfLabelEffect } from "../../../connectors/undo-store/effects/update-label-class-of-label";

const labelClassesQuery = gql`
  query getLabelClasses {
    labelClasses {
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
      }
    }
  }
`;

/**
 * The target is an invisibly small element that
 *   - is positioned absolutely on screen using a ref used by open layers (outerRef)
 *   - is used as the trigger by Chakra, who also needs a ref (ref)
 * So we have to do a little "ref juggling" to make it work nicely
 */
const Target = forwardRef<HTMLDivElement, { outerRef?: Ref<HTMLDivElement> }>(
  ({ outerRef }, ref) => (
    <div
      ref={outerRef}
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        backgroundColor: "red",
      }}
    >
      <div
        ref={ref}
        style={{
          position: "relative",
          width: 0,
          height: 0,
          backgroundColor: "red",
        }}
      />
    </div>
  )
);

export const EditLabelClass = forwardRef<
  HTMLDivElement | null,
  {
    isOpen: boolean;
    onClose: () => void;
  }
>(({ isOpen, onClose }, ref) => {
  const client = useApolloClient();
  const { data } = useQuery(labelClassesQuery);
  const { perform } = useUndoStore();
  const labelClasses = data?.labelClasses ?? [];
  const selectedLabelId = useLabellingStore((state) => state.selectedLabelId);
  const { data: labelQueryData } = useQuery(labelQuery, {
    variables: { id: selectedLabelId },
    skip: selectedLabelId == null,
  });
  const selectedLabelClassId = labelQueryData?.label?.labelClass?.id ?? null;
  const createNewClass = useMemo(
    () =>
      createNewLabelClassAndUpdateLabelCurry({
        labelClasses,
        perform,
        onClose,
        client,
      }),
    [labelClasses]
  );

  return (
    <ClassSelectionPopover
      isOpen={isOpen}
      onClose={onClose}
      parentName="edit-label-class"
      trigger={<Target outerRef={ref} />} // Needed to have the popover displayed preventing overflow
      labelClasses={labelClasses}
      selectedLabelClassId={selectedLabelClassId}
      createNewClass={async (name) => createNewClass(name, selectedLabelId)}
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
  );
});

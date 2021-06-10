import { forwardRef } from "react";
import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";

import { ClassSelectionPopover } from "../../class-selection-popover";
import { useLabellingStore } from "../../../connectors/labelling-state";

const labelClassesQuery = gql`
  query getLabelClasses {
    labelClasses {
      id
      name
      color
    }
  }
`;

const createLabelQuery = gql`
  mutation createLabelClass($data: LabelClassCreateInput!) {
    createLabelClass(data: $data) {
      id
    }
  }
`;

const updateLabelQuery = gql`
  mutation updateLabelClass(
    $where: LabelWhereUniqueInput!
    $data: LabelUpdateInput!
  ) {
    updateLabel(where: $where, data: $data) {
      id
    }
  }
`;

export const EditLabelClass = forwardRef<
  HTMLDivElement | null,
  { isOpen: boolean; onClose: () => void }
>(({ isOpen, onClose }, ref) => {
  const { data } = useQuery(labelClassesQuery);
  const [createLabelClass] = useMutation(createLabelQuery, {
    refetchQueries: ["getLabelClasses"],
  });
  const [updateLabelClass] = useMutation(updateLabelQuery, {
    refetchQueries: ["getLabelClasses"],
  });
  const selectedLabelId = useLabellingStore((state) => state.selectedLabelId);
  const labelClasses = data?.labelClasses ?? [];
  return (
    <div ref={ref}>
      {isOpen && (
        <ClassSelectionPopover
          isOpen
          onClose={onClose}
          labelClasses={labelClasses}
          createNewClass={async (name) => {
            const {
              data: {
                createLabelClass: { id },
              },
            } = await createLabelClass({
              variables: { data: { name, color: "#DD3322" } },
            });
            updateLabelClass({
              variables: {
                where: { id: selectedLabelId },
                data: { labelClassId: id ?? null },
              },
              refetchQueries: ["getImageLabels"],
            });
            onClose();
          }}
          onSelectedClassChange={(item) => {
            updateLabelClass({
              variables: {
                where: { id: selectedLabelId },
                data: { labelClassId: item?.id ?? null },
              },
              refetchQueries: ["getImageLabels"],
            });
            onClose();
          }}
        />
      )}
    </div>
  );
});

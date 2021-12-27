import React from "react";
import { DeleteLabelClassModal } from "./delete-label-class-modal";
import {
  LabelClassesContext,
  LabelClassesState,
} from "./label-classes.context";

export type TestComponentProps = {
  setDeleteClassId?: () => void;
};

export const TestComponent = ({
  setDeleteClassId = () => {},
}: TestComponentProps) => (
  <LabelClassesContext.Provider
    value={{
      ...({} as LabelClassesState),
      datasetId: "1",
      setDeleteClassId,
      deleteClassId: "2",
    }}
  >
    <DeleteLabelClassModal />
  </LabelClassesContext.Provider>
);

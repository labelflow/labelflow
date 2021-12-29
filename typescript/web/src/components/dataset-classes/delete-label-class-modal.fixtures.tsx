import React from "react";
import { DeleteLabelClassModal } from "./delete-label-class-modal";
import {
  DatasetClassesContext,
  DatasetClassesState,
} from "./dataset-classes.context";

export type TestComponentProps = {
  setDeleteClassId?: () => void;
};

export const TestComponent = ({
  setDeleteClassId = () => {},
}: TestComponentProps) => (
  <DatasetClassesContext.Provider
    value={{
      ...({} as DatasetClassesState),
      datasetId: "1",
      setDeleteClassId,
      deleteClassId: "2",
    }}
  >
    <DeleteLabelClassModal />
  </DatasetClassesContext.Provider>
);

import { StylesProvider, Table } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { ReorderableTableBody } from "../core";
import { LabelClassesTableRow } from "./label-classes-table-row";
import {
  DatasetClassesContext,
  DatasetClassesState,
} from "./dataset-classes.context";

export const TEST_DATA = {
  __typename: "LabelClass",
  id: "myClassId",
  index: 0,
  name: "Horse",
  color: "#F87171",
  labelsAggregates: {
    __typename: "LabelsAggregates",
    totalCount: 0,
  },
  shortcut: "myShortcut",
};

export const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <Table>
    <ReorderableTableBody onReorder={() => {}}>
      <StylesProvider value={{}}>{children}</StylesProvider>
    </ReorderableTableBody>
  </Table>
);

export const TestComponent = ({
  setEditClass,
  setDeleteClassId,
}: Pick<DatasetClassesState, "setEditClass" | "setDeleteClassId">) => (
  <DatasetClassesContext.Provider
    value={{
      ...({} as DatasetClassesState),
      setEditClass,
      setDeleteClassId,
    }}
  >
    <LabelClassesTableRow {...TEST_DATA} />
  </DatasetClassesContext.Provider>
);

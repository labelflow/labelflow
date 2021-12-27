import { StylesProvider } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { ReorderableTable, ReorderableTableBody } from "../reorderable-table";
import { LabelClassesTableRow } from "./label-classes-table-row";
import {
  LabelClassesContext,
  LabelClassesState,
} from "./label-classes.context";

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
  <ReorderableTable>
    <ReorderableTableBody onReorder={() => {}}>
      <StylesProvider value={{}}>{children}</StylesProvider>
    </ReorderableTableBody>
  </ReorderableTable>
);

export const TestComponent = ({
  setEditClass,
  setDeleteClassId,
}: Pick<LabelClassesState, "setEditClass" | "setDeleteClassId">) => (
  <LabelClassesContext.Provider
    value={{
      ...({} as LabelClassesState),
      setEditClass,
      setDeleteClassId,
    }}
  >
    <LabelClassesTableRow {...TEST_DATA} />
  </LabelClassesContext.Provider>
);

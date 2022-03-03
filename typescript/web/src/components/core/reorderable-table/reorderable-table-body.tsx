import { TableBodyProps, Tbody } from "@chakra-ui/react";
import { Droppable } from "react-beautiful-dnd";
import {
  OnReorderCallback,
  ReorderableTableProvider,
} from "./reorderable-table.context";

export type ReorderableTableProps = TableBodyProps & {
  onReorder: OnReorderCallback;
};

export const ReorderableTableBody = ({
  onReorder,
  children,
  ...props
}: ReorderableTableProps) => (
  <ReorderableTableProvider onReorder={onReorder}>
    <Droppable droppableId="reorderableTable" direction="vertical" type="ROW">
      {({ innerRef, droppableProps, placeholder }) => (
        <>
          <Tbody
            data-testid="reorderable-table-body"
            ref={innerRef}
            {...droppableProps}
            {...props}
          >
            {children}
            {placeholder}
          </Tbody>
        </>
      )}
    </Droppable>
  </ReorderableTableProvider>
);

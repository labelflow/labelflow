import { TableRowProps, Tr } from "@chakra-ui/react";
import { Draggable } from "react-beautiful-dnd";
import { ReorderableTableHandleCell } from "./reorderable-table-handle-cell";
import {
  ReorderableTableRowProvider,
  useReorderableTableRow,
} from "./reorderable-table-row.context";

const RowBody = ({ children, ...props }: TableRowProps) => {
  const { innerRef, draggableProps } = useReorderableTableRow();
  return (
    <Tr {...draggableProps} {...props} ref={innerRef}>
      <ReorderableTableHandleCell />
      {children}
    </Tr>
  );
};

export type ReorderableTableRowProps = TableRowProps & {
  draggableId: string;
  index: number;
};

export const ReorderableTableRow = ({
  draggableId,
  index,
  ...props
}: ReorderableTableRowProps) => {
  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided) => (
        <ReorderableTableRowProvider value={provided}>
          <RowBody {...props} />
        </ReorderableTableRowProvider>
      )}
    </Draggable>
  );
};

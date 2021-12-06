import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { chakraDecorator } from "../../../utils/chakra-decorator";

export default {
  title: "web/Dataset class list",
  decorators: [chakraDecorator],
};

const DEFAULT_TABLE_ITEMS = [
  ["A", "1"],
  ["B", "2"],
  ["C", "3"],
];

function reorder<TList extends Array<unknown>>(
  list: TList[],
  startIndex: number,
  endIndex: number
): TList[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

type TableCellSnapshot = {
  width: number;
  height: number;
};

type SnapshotMap = {
  [cellId: string]: TableCellSnapshot;
};

const snapshotMap: SnapshotMap = {};

export const ReorderableTable = () => {
  const [items, setItems] = useState(DEFAULT_TABLE_ITEMS);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      // dropped outside the list
      if (!result.destination) {
        return;
      }
      const newItems = reorder(
        items,
        result.source.index,
        result.destination.index
      );
      setItems(newItems);
    },
    [items, setItems]
  );
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Table>
        <Thead>
          <Tr>
            <Th>
              <Td>Name</Td>
              <Td>Value</Td>
            </Th>
          </Tr>
        </Thead>
        <Droppable
          droppableId="droppable"
          renderClone={() => (
            <Tr>
              <Th>
                <div style={{ backgroundColor: "#0f0" }}>Hello</div>
              </Th>
              <Td>World</Td>
            </Tr>
          )}
        >
          {(provided) => (
            <Tbody ref={provided.innerRef} {...provided.droppableProps}>
              {items.map(([name, value], index) => (
                <Draggable key={name} draggableId={name} index={index}>
                  {(trProvided, trSnapshot) => (
                    <Tr
                      key={name}
                      ref={trProvided.innerRef}
                      {...trProvided.draggableProps}
                      {...trProvided.dragHandleProps}
                      bgColor={trSnapshot.isDragging ? "#f00" : undefined}
                    >
                      <Td>{name}</Td>
                      <Td>{value}</Td>
                    </Tr>
                  )}
                </Draggable>
              ))}
            </Tbody>
          )}
        </Droppable>
      </Table>
    </DragDropContext>
  );
};

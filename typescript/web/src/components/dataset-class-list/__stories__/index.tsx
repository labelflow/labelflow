import { Table, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
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

type TableCellProps = {
  children: any;
  isDragOccurring: boolean;
};

type TableCellSnapshot = {
  width: number;
  height: number;
};

// eslint-disable-next-line react/prefer-stateless-function
class TableCell extends React.Component<TableCellProps> {
  ref = React.createRef<HTMLTableCellElement>();

  getSnapshotBeforeUpdate(prevProps: TableCellProps): TableCellSnapshot | null {
    const { isDragOccurring } = this.props;
    if (!this.ref.current) {
      return null;
    }

    const isDragStarting: boolean =
      isDragOccurring && !prevProps.isDragOccurring;

    if (!isDragStarting) {
      return null;
    }

    const { width, height } = this.ref.current.getBoundingClientRect();

    const snapshot: TableCellSnapshot = {
      width,
      height,
    };

    return snapshot;
  }

  componentDidUpdate(
    prevProps: TableCellProps,
    prevState: any,
    snapshot: TableCellSnapshot
  ) {
    const { ref } = this;
    const { isDragOccurring } = this.props;
    if (!ref.current) {
      return;
    }

    if (snapshot) {
      if (ref.current.style.width === snapshot.width.toString()) {
        return;
      }
      ref.current.style.width = `${snapshot.width}px`;
      ref.current.style.height = `${snapshot.height}px`;
      return;
    }

    if (isDragOccurring) {
      return;
    }

    // inline styles not applied
    if (ref.current.style.width == null) {
      return;
    }

    // no snapshot and drag is finished - clear the inline styles
    ref.current.style.removeProperty("height");
    ref.current.style.removeProperty("width");
  }

  render() {
    const { children } = this.props;
    return <td ref={this.ref}>{children}</td>;
  }
}

type TableRowProps = {
  provided: any;
  snapshot: any;
  item: any;
};

const IsDraggingContext = React.createContext<boolean>(false);

const TableRow = ({ provided, item }: TableRowProps) => {
  const [letter, index] = item;
  return (
    <IsDraggingContext.Consumer>
      {(isDragging: boolean) => (
        <tr
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <TableCell isDragOccurring={isDragging}>{letter}</TableCell>
          <TableCell isDragOccurring={isDragging}>{index}</TableCell>
        </tr>
      )}
    </IsDraggingContext.Consumer>
  );
};

export const ReorderableTable = () => {
  const [items, setItems] = useState(DEFAULT_TABLE_ITEMS);
  const [isDragging, setIsDragging] = useState(false);

  const onBeforeDragStart = () => {
    setIsDragging(true);
  };

  const onDragEnd = useCallback(
    (result: DropResult) => {
      setIsDragging(false);
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
    <IsDraggingContext.Provider value={isDragging}>
      <DragDropContext
        onDragEnd={onDragEnd}
        onBeforeDragStart={onBeforeDragStart}
      >
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Value</Th>
            </Tr>
          </Thead>
          <Droppable droppableId="droppable">
            {(droppableProvided) => (
              <Tbody
                ref={droppableProvided.innerRef}
                {...droppableProvided.droppableProps}
              >
                {items.map(([name, value], index) => (
                  <Draggable key={name} draggableId={name} index={index}>
                    {(trProvided, trSnapshot) => (
                      <TableRow
                        provided={trProvided}
                        snapshot={trSnapshot}
                        item={[name, value]}
                      />
                    )}
                  </Draggable>
                ))}
              </Tbody>
            )}
          </Droppable>
        </Table>
      </DragDropContext>
    </IsDraggingContext.Provider>
  );
};

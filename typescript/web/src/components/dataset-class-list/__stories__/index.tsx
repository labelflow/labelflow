import {
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  Flex,
  Tooltip,
  chakra,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { RiInformationLine } from "react-icons/ri";
import React, { useCallback, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { chakraDecorator } from "../../../utils/chakra-decorator";
import { TableRow, IsDraggingContext } from "../table-row";
import { DeleteLabelClassModal } from "../delete-class-modal";
import { apolloDecorator } from "../../../utils/apollo-decorator";
import { UpsertClassModal } from "../upsert-class-modal";

const InfoIcon = chakra(RiInformationLine);

export default {
  title: "web/Dataset class list",
  decorators: [chakraDecorator, apolloDecorator],
};

type LabelClassWithShortcut = {
  id: string;
  index: number;
  name: string;
  color: string;
  occurences: number;
  shortcut: string;
};

const classes: LabelClassWithShortcut[] = [
  {
    id: "1",
    index: 1,
    name: "Horse",
    occurences: 12,
    shortcut: "1",
    color: "#EFAB22",
  },
  {
    id: "2",
    index: 2,
    name: "Drone",
    occurences: 0,
    shortcut: "2",
    color: "#E53E3E",
  },
  {
    id: "3",
    index: 3,
    name: "Light house",
    occurences: 3,
    shortcut: "3",
    color: "#31CECA",
  },
  {
    id: "4",
    index: 4,
    name: "Pyramid",
    occurences: 231,
    shortcut: "4",
    color: "#02AEF2",
  },
];

function reorder(
  list: LabelClassWithShortcut[],
  startIndex: number,
  endIndex: number
): LabelClassWithShortcut[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export const ReorderableTable = () => {
  const [items, setItems] = useState(classes);
  const [isDragging, setIsDragging] = useState(false);
  const [deleteClassId, setDeleteClassId] = useState<string | null>(null);
  const [editClassId, setEditClassId] = useState<string | null>(null);

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
    <>
      <UpsertClassModal
        isOpen={editClassId != null}
        classId={editClassId}
        onClose={() => setEditClassId(null)}
        datasetSlug=""
        workspaceSlug=""
      />
      <DeleteLabelClassModal
        isOpen={deleteClassId != null}
        datasetId={undefined}
        labelClassId={deleteClassId}
        onClose={() => setDeleteClassId(null)}
      />
      <Table borderWidth="1px">
        <Thead bg={mode("gray.50", "gray.800")}>
          <Tr>
            <Th whiteSpace="nowrap" scope="col" w={0} p={0} />
            <Th whiteSpace="nowrap" scope="col">
              Class
            </Th>
            <Th whiteSpace="nowrap" scope="col">
              Occurences
            </Th>
            <Th whiteSpace="nowrap" scope="col">
              <Flex justifyContent="flex-start" alignItems="center">
                <span>Shortcut</span>
                <Tooltip
                  label="A keyboard shortcut is available for the first 9 classes"
                  aria-label="A keyboard shortcut is available for the first 9 classes"
                >
                  {/* See this PR for more info on why using a span is necessary https://github.com/chakra-ui/chakra-ui/pull/2882 */}
                  <span>
                    <InfoIcon
                      flexShrink={0}
                      flexGrow={0}
                      fontSize="xl"
                      ml="2"
                      mr="2"
                    />
                  </span>
                </Tooltip>
              </Flex>
            </Th>
            <Th whiteSpace="nowrap" scope="col" />
          </Tr>
        </Thead>
        <IsDraggingContext.Provider value={isDragging}>
          <DragDropContext
            onDragEnd={onDragEnd}
            onBeforeDragStart={onBeforeDragStart}
          >
            <Droppable droppableId="droppable">
              {(droppableProvided) => (
                <Tbody
                  ref={droppableProvided.innerRef}
                  {...droppableProvided.droppableProps}
                >
                  {items.map((item, index) => (
                    <Draggable
                      key={item.name}
                      draggableId={item.name}
                      index={index}
                    >
                      {(trProvided, trSnapshot) => (
                        <TableRow
                          onClickDelete={() => setDeleteClassId(item.id)}
                          onClickEdit={() => setEditClassId(item.id)}
                          provided={trProvided}
                          snapshot={trSnapshot}
                          item={item}
                        />
                      )}
                    </Draggable>
                  ))}
                </Tbody>
              )}
            </Droppable>
          </DragDropContext>
        </IsDraggingContext.Provider>
      </Table>
    </>
  );
};

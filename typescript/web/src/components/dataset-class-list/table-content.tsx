import React, { useState } from "react";
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
  TableColumnHeaderProps,
} from "@chakra-ui/react";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { RiInformationLine } from "react-icons/ri";
import { TableRow, IsDraggingContext } from "./table-row";
import { LabelClassWithShortcut } from "./types";

const InfoIcon = chakra(RiInformationLine);

const TableHeadCell = (props: TableColumnHeaderProps) => (
  <Th whiteSpace="nowrap" scope="col" {...props} />
);

const ShortcutHeadCell = () => (
  <TableHeadCell>
    <Flex justifyContent="flex-start" alignItems="center">
      <span>Shortcut</span>
      <Tooltip
        label="A keyboard shortcut is available for the first 10 classes"
        aria-label="A keyboard shortcut is available for the first 10 classes"
      >
        {/* See this PR for more info on why using a span is necessary https://github.com/chakra-ui/chakra-ui/pull/2882 */}
        <span>
          <InfoIcon flexShrink={0} flexGrow={0} fontSize="xl" ml="2" mr="2" />
        </span>
      </Tooltip>
    </Flex>
  </TableHeadCell>
);

const TableHead = () => (
  <Thead bg={mode("gray.50", "gray.800")}>
    <Tr>
      <TableHeadCell w={0} p={0} />
      <TableHeadCell>Class</TableHeadCell>
      <TableHeadCell>Occurrences</TableHeadCell>
      <ShortcutHeadCell />
      <TableHeadCell />
    </Tr>
  </Thead>
);

export const ClassTableContent = ({
  classes,
  onDragEnd: onDragEndRecieved,
  onClickDelete,
  onClickEdit,
  searchText,
}: {
  classes: LabelClassWithShortcut[];
  onDragEnd: (result: DropResult) => Promise<void>;
  onClickDelete: (classId: string | null) => void;
  onClickEdit: (item: LabelClassWithShortcut | null) => void;
  searchText: string;
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const onBeforeDragStart = () => {
    setIsDragging(true);
  };

  const onDragEnd = (result: DropResult) => {
    onDragEndRecieved(result);
    setIsDragging(false);
  };

  const filteredClasses = classes.filter((labelClass) =>
    labelClass.name.toLowerCase()?.includes(searchText.toLowerCase())
  );

  return (
    <Table my="8" borderWidth="1px" overflowX="clip" maxWidth="5xl">
      <TableHead />
      <IsDraggingContext.Provider value={isDragging}>
        <DragDropContext
          onDragEnd={onDragEnd}
          onBeforeDragStart={onBeforeDragStart}
        >
          <Droppable droppableId="droppable">
            {(dropState) => (
              <Tbody ref={dropState.innerRef} {...dropState.droppableProps}>
                {filteredClasses.map((row, classIndex) => (
                  <Draggable
                    key={row.id}
                    draggableId={row.id}
                    index={classIndex}
                  >
                    {(trProvided) => (
                      <TableRow
                        provided={trProvided}
                        item={row}
                        onDelete={onClickDelete}
                        onEdit={onClickEdit}
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
  );
};

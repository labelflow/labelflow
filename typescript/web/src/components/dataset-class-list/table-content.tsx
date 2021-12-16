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
} from "@chakra-ui/react";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { RiInformationLine } from "react-icons/ri";
import { TableRow, IsDraggingContext } from "./table-row";
import { LabelClassWithShortcut } from "./types";

const InfoIcon = chakra(RiInformationLine);

export const ClassTableContent = ({
  classes,
  onDragEnd,
  onClickDelete,
  onClickEdit,
  searchText,
}: {
  classes: LabelClassWithShortcut[];
  onDragEnd: (result: any) => Promise<void>;
  onClickDelete: (classId: string | null) => void;
  onClickEdit: (item: LabelClassWithShortcut | null) => void;
  searchText: string;
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const onBeforeDragStart = () => {
    setIsDragging(true);
  };

  const filteredClasses = classes.filter((labelClass) =>
    labelClass.name.toLowerCase()?.includes(searchText.toLowerCase())
  );

  return (
    <Table my="8" borderWidth="1px" overflowX="clip" maxWidth="5xl">
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
                label="A keyboard shortcut is available for the first 10 classes"
                aria-label="A keyboard shortcut is available for the first 10 classes"
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
                {filteredClasses.map((row, classIndex) => (
                  <Draggable
                    key={row.id}
                    draggableId={row.id}
                    index={classIndex}
                  >
                    {(trProvided, trSnapshot) => (
                      <TableRow
                        provided={trProvided}
                        snapshot={trSnapshot}
                        item={row}
                        onClickDelete={onClickDelete}
                        onClickEdit={onClickEdit}
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

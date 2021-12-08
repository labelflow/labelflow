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

export type LabelClassWithShortcut = {
  id: string;
  index: number;
  name: string;
  color: string;
  shortcut: string;
  labelsAggregates: {
    totalCount: number;
  }
};
const InfoIcon = chakra(RiInformationLine);

export const ClassTableContent = ({
  classes,
  onDragEnd,
}: {
  classes: LabelClassWithShortcut[];
  onDragEnd: (result: any) => Promise<void>;
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const onBeforeDragStart = () => {
    setIsDragging(true);
  };

  return (
    <Table my="8" borderWidth="1px">
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
                {classes.map((row, classIndex) => (
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

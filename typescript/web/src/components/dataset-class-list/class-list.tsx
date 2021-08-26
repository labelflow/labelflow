import { useMemo, useState } from "react";
import { useQuery, useMutation, gql, useApolloClient } from "@apollo/client";
import { Box, Text, Divider } from "@chakra-ui/react";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  ClassItem,
  datasetLabelClassesQuery,
  DatasetClassesQueryResult,
} from "./class-item";
import { DeleteLabelClassModal } from "./delete-class-modal";

const reorderLabelClasseMutation = gql`
  mutation reorderLabelClass($id: ID!, $index: Int!) {
    reorderLabelClass(where: { id: $id }, data: { index: $index }) {
      id
    }
  }
`;
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const ClassesList = ({ datasetId }: { datasetId: string }) => {
  const client = useApolloClient();
  const [editClassId, setEditClassId] = useState<string | null>(null);
  const [deleteClassId, setDeleteClassId] = useState<string | null>(null);

  const {
    data: datasetResult,
    loading,
    refetch,
    updateQuery,
  } = useQuery<DatasetClassesQueryResult>(datasetLabelClassesQuery, {
    variables: {
      datasetId,
    },
  });
  const labelClasses = datasetResult?.dataset.labelClasses ?? [];

  const labelClassWithShortcut = useMemo(
    () =>
      labelClasses.map((labelClass, index) => ({
        ...labelClass,
        shortcut: index > 9 ? null : `${(index + 1) % 10}`,
      })),
    [labelClasses]
  );
  const onDragEnd = async (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    updateQuery((prev) => {
      const labelClassesPrevious = prev?.dataset?.labelClasses;
      return {
        ...prev,
        dataset: {
          ...prev?.dataset,
          labelClasses: reorder(
            labelClassesPrevious,
            result.source.index,
            result.destination.index
          ),
        },
      };
    });
    await client.mutate({
      mutation: reorderLabelClasseMutation,
      variables: { id: result.draggableId, index: result.destination.index },
    });
    refetch();
  };

  return (
    <>
      <DeleteLabelClassModal
        isOpen={deleteClassId != null}
        labelClassId={deleteClassId}
        onClose={() => setDeleteClassId(null)}
      />

      <Box
        d="flex"
        flexDirection="column"
        bg="white"
        m="10"
        borderRadius="lg"
        maxWidth="5xl"
        flexGrow={1}
      >
        <>
          <Text
            margin="2"
            fontWeight="bold"
          >{`${labelClassWithShortcut.length} Classes`}</Text>
          <Divider />
          {!loading && (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    // style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {labelClassWithShortcut.map(
                      ({ id, name, color, shortcut, index }) => (
                        <ClassItem
                          key={id}
                          id={id}
                          index={index}
                          name={name}
                          color={color}
                          shortcut={shortcut}
                          edit={editClassId === id}
                          datasetId={datasetId}
                          onClickEdit={setEditClassId}
                          onClickDelete={setDeleteClassId}
                        />
                      )
                    )}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </>
      </Box>
    </>
  );
};

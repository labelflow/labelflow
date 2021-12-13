import { Box, Heading } from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { DropResult } from "react-beautiful-dnd";
import { ClassTableActions } from "../table-actions";
import { ClassTableContent } from "../table-content";
import { chakraDecorator } from "../../../utils/chakra-decorator";
import { DeleteLabelClassModal } from "../delete-class-modal";
import { apolloDecorator } from "../../../utils/apollo-decorator";
import { UpsertClassModal } from "../upsert-class-modal";

export default {
  title: "web/Dataset class list",
  decorators: [chakraDecorator, apolloDecorator],
};

type LabelClassWithShortcut = {
  id: string;
  index: number;
  name: string;
  color: string;
  labelsAggregates: {
    totalCount: number;
  };
  shortcut: string;
};

const classes: LabelClassWithShortcut[] = [
  {
    id: "1",
    index: 1,
    name: "Horse",
    labelsAggregates: {
      totalCount: 12,
    },
    shortcut: "1",
    color: "#EFAB22",
  },
  {
    id: "2",
    index: 2,
    name: "Drone",
    labelsAggregates: {
      totalCount: 0,
    },
    shortcut: "2",
    color: "#E53E3E",
  },
  {
    id: "3",
    index: 3,
    name: "Light house",
    labelsAggregates: {
      totalCount: 3,
    },
    shortcut: "3",
    color: "#31CECA",
  },
  {
    id: "4",
    index: 4,
    name: "Pyramid",
    labelsAggregates: {
      totalCount: 231,
    },
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
  const [deleteClassId, setDeleteClassId] = useState<string | null>(null);
  const [editClassId, setEditClassId] = useState<string | null>(null);
  const [isCreatingClassLabel, setIsCreatingClassLabel] = useState(false);
  const [searchText, setSearchText] = useState("");

  const onDragEnd = useCallback(
    async (result: DropResult) => {
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
      />
      <DeleteLabelClassModal
        isOpen={deleteClassId != null}
        datasetId={undefined}
        labelClassId={deleteClassId}
        onClose={() => setDeleteClassId(null)}
      />
      <Box display="flex" flexDirection="column" w="full" p={8}>
        <Heading mb={5}>{`Classes (${items.length})`}</Heading>
        <ClassTableActions
          searchText={searchText}
          setSearchText={setSearchText}
          isCreatingClassLabel={isCreatingClassLabel}
          setIsCreatingClassLabel={setIsCreatingClassLabel}
          datasetId=""
          datasetSlug=""
        />
        <ClassTableContent
          classes={items}
          onDragEnd={onDragEnd}
          onClickDelete={setDeleteClassId}
          onClickEdit={setEditClassId}
          searchText={searchText}
        />
      </Box>
    </>
  );
};

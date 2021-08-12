import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { Box, Text, Divider } from "@chakra-ui/react";
import {
  ClassItem,
  datasetLabelClassesQuery,
  DatasetClassesQueryResult,
} from "./class-item";
import { DeleteLabelClassModal } from "./delete-class-modal";

export const ClassesList = ({ datasetId }: { datasetId: string }) => {
  const [editClassId, setEditClassId] = useState<string | null>(null);
  const [deleteClassId, setDeleteClassId] = useState<string | null>(null);

  const { data: datasetResult, loading } = useQuery<DatasetClassesQueryResult>(
    datasetLabelClassesQuery,
    {
      variables: {
        datasetId,
      },
    }
  );
  const labelClasses = datasetResult?.dataset.labelClasses ?? [];

  const labelClassWithShortcut = useMemo(
    () =>
      labelClasses.map((labelClass, index) => ({
        ...labelClass,
        shortcut: index > 9 ? null : `${(index + 1) % 10}`,
      })),
    [labelClasses]
  );

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
        maxWidth="2xl"
        flexGrow={1}
      >
        <>
          <Text
            margin="2"
            fontWeight="bold"
          >{`${labelClassWithShortcut.length} Classes`}</Text>
          <Divider />
          {!loading &&
            labelClassWithShortcut.map(({ id, name, color, shortcut }) => (
              <ClassItem
                key={id}
                id={id}
                name={name}
                color={color}
                shortcut={shortcut}
                edit={editClassId === id}
                datasetId={datasetId}
                onClickEdit={setEditClassId}
                onClickDelete={setDeleteClassId}
              />
            ))}
        </>
      </Box>
    </>
  );
};

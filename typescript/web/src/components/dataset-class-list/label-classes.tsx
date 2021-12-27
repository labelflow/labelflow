import { Box, Heading } from "@chakra-ui/react";
import { isNil } from "lodash/fp";
import { useCallback } from "react";
import { DeleteLabelClassModal } from "./delete-label-class-modal";
import { LabelClassesActions } from "./label-classes-actions";
import { LabelClassesTable } from "./label-classes-table";
import {
  LabelClassesProps,
  LabelClassesProvider,
  useLabelClasses,
} from "./label-classes.context";
import { UpsertClassModal } from "./upsert-class-modal";

const LabelClassesBody = () => {
  const { loading, labelClasses, editClass, setEditClass } = useLabelClasses();
  const handleCloseEditModal = useCallback(
    () => setEditClass(undefined),
    [setEditClass]
  );
  return (
    <>
      <DeleteLabelClassModal />
      <UpsertClassModal
        isOpen={!isNil(editClass)}
        onClose={handleCloseEditModal}
      />
      {!loading && (
        <Box
          display="flex"
          flexDirection="column"
          w="full"
          p={8}
          maxWidth="5xl"
          flexGrow={1}
        >
          <Heading mb={5}>{`Classes (${labelClasses?.length ?? "-"})`}</Heading>
          <LabelClassesActions />
          <LabelClassesTable />
        </Box>
      )}
    </>
  );
};

export const LabelClasses = (props: LabelClassesProps) => (
  <LabelClassesProvider {...props}>
    <LabelClassesBody />
  </LabelClassesProvider>
);

import { db } from "../database";

export const deleteLabelClass = async (id: string) => {
  const labelsWithLabelClassToDelete = await db.label.filter(
    (label) => label.labelClassId === id
  );

  const setLabelsToNoneLabelClassPromise = labelsWithLabelClassToDelete.modify({
    labelClassId: null,
  });

  await db.labelClass.delete(id);
  await setLabelsToNoneLabelClassPromise;
};

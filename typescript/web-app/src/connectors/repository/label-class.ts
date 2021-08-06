import { db } from "../database";

export const deleteLabelClass = async (id: string) => {
  await db.label
    .filter((label) => label.labelClassId === id)
    .modify({
      labelClassId: null,
    });

  await db.labelClass.delete(id);
};

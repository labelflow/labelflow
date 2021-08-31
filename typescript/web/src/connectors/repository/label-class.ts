import { getDatabase } from "../database";

export const deleteLabelClass = async (id: string) => {
  await (
    await getDatabase()
  ).label
    .filter((label) => label.labelClassId === id)
    .modify({
      labelClassId: null,
    });

  await (await getDatabase()).labelClass.delete(id);
};

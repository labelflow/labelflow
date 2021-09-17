import { Repository } from "@labelflow/common-resolvers";
import { getDatabase } from "../database";

export const deleteLabelClass: Repository["labelClass"]["delete"] = async ({
  id,
}) => {
  await (
    await getDatabase()
  ).label
    .filter((label) => label.labelClassId === id)
    .modify({
      labelClassId: null,
    });

  await (await getDatabase()).labelClass.delete(id);
};

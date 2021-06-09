import { LabelDataSource } from "./types";
import { db } from "../../database";

const labelDataSource: LabelDataSource = {
  getLabelsByClassId: async (id) => {
    const getResults = await db.label
      .where({ labelClassId: id })
      .sortBy("createdAt");

    return getResults ?? [];
  },
};

export default labelDataSource;

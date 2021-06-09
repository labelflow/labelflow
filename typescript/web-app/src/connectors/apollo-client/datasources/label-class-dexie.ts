import { v4 as uuidv4 } from "uuid";

import type { LabelClassDataSource } from "./types";
import { db } from "../../database";

const labelClassDataSource: LabelClassDataSource = {
  getPaginatedLabelClasses: async ({ skip, first }) => {
    const query = await db.labelClass.orderBy("createdAt").offset(skip ?? 0);

    if (first) {
      return query.limit(first).toArray();
    }

    return query.toArray();
  },

  getLabelClassById: async (id) => {
    const entity = await db.labelClass.get(id);

    if (entity === undefined) {
      throw new Error("No labelClass with such id");
    }

    return entity;
  },

  createLabelClass: ({ color, name, id }) => {
    const labelClassId = id ?? uuidv4();
    const now = new Date();

    const newLabelClassEntity = {
      id: labelClassId,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      name,
      color,
    };

    return db.labelClass.add(newLabelClassEntity);
  },
};

export default labelClassDataSource;

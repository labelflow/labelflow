import { v4 as uuidv4 } from "uuid";
import type {
  LabelClass,
  MutationCreateLabelClassArgs,
  QueryLabelClassArgs,
  QueryLabelClassesArgs,
  Maybe,
} from "../../../types.generated";

import { db } from "../../database";

const getLabelsByLabelClassId = async (id: string) => {
  const getResults = await db.label.where({ labelClassId: id }).toArray();

  return getResults ?? [];
};

const getLabelClassById = async (id: string): Promise<LabelClass> => {
  const entity = await db.labelClass.get(id);

  if (entity === undefined) {
    throw new Error("No labelClass with such id");
  }
  const labels = await getLabelsByLabelClassId(id);

  return { ...entity, labels };
};

const getPaginatedLabelClasses = async (
  skip?: Maybe<number>,
  first?: Maybe<number>
): Promise<any[]> => {
  const query = await db.labelClass.orderBy("createdAt").offset(skip ?? 0);

  if (first) {
    return query.limit(first).toArray();
  }

  return query.toArray();
};

// Queries
export const labelClass = async (_: any, args: QueryLabelClassArgs) => {
  return getLabelClassById(args?.where?.id);
};

export const labelClasses = async (_: any, args: QueryLabelClassesArgs) => {
  const entities = await getPaginatedLabelClasses(args?.skip, args?.first);
  const entitiesWithLabels = await Promise.all(
    entities.map(async (entity: any) => {
      return {
        ...entity,
        labels: await getLabelsByLabelClassId(entity.id),
      };
    })
  );
  return entitiesWithLabels;
};

// Mutations
export const createLabelClass = async (
  _: any,
  args: MutationCreateLabelClassArgs
): Promise<LabelClass> => {
  const { color, name } = args.data;
  const labelClassId = uuidv4();
  const newLabelClassEntity = {
    id: labelClassId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name,
    color,
  };
  await db.labelClass.add(newLabelClassEntity);
  return getLabelClassById(newLabelClassEntity.id);
};

export default {
  Query: {
    labelClass,
    labelClasses,
  },

  Mutation: {
    createLabelClass,
  },
};

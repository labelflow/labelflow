import { v4 as uuidv4 } from "uuid";
import {
  MutationCreateExampleArgs,
  QueryExampleArgs,
  QueryExamplesArgs,
} from "../../graphql-types.generated";

import { db } from "../database";

// Queries
export const example = async (_: any, args: QueryExampleArgs) => {
  return db.example.get(args?.where?.id);
};

export const examples = async (_: any, args: QueryExamplesArgs) => {
  const query = await db.example.orderBy("createdAt").offset(args.skip ?? 0);

  if (args.first) {
    return query.limit(args.first).toArray();
  }

  return query.toArray();
};

// Mutations
export const createExample = async (
  _: any,
  args: MutationCreateExampleArgs
) => {
  const now = new Date();
  const newExampleEntity = {
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    id: uuidv4(),

    // Add your specific fields here
    name: args?.data?.name,
  };

  await db.example.add(newExampleEntity);

  return newExampleEntity;
};

export default {
  Query: {
    example,
    examples,
  },

  Mutation: {
    createExample,
  },
};

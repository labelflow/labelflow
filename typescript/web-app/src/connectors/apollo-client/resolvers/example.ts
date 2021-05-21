import localforage from "localforage";
import { v4 as uuidv4 } from "uuid";
import {
  MutationCreateExampleArgs,
  QueryExampleArgs,
} from "../../../types.generated";
import { appendToListInStorage, getListFromStorage } from "./utils";

const typeName = "Example";
const typeNamePlural = "Example:list";

// Queries
export const example = async (_: any, args: QueryExampleArgs) => {
  const entity = await localforage.getItem(`${typeName}:${args?.where?.id}`);
  return entity;
};
export const examples = async () => {
  return getListFromStorage(typeNamePlural);
};

// Mutations
export const createExample = async (
  _: any,
  args: MutationCreateExampleArgs
) => {
  const newEntity = {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    id: uuidv4(),

    // Add your specific fields here
    name: args?.data?.name,
  };

  // Set entity in db
  const newEntityKey = `${typeName}:${newEntity.id}`;

  await localforage.setItem(newEntityKey, newEntity);

  // Add entity to entity list
  await appendToListInStorage(typeNamePlural, newEntityKey);

  return newEntity;
};

// const updateExample = () => { };
// const deleteExample = () => { };

export default {
  Query: {
    example,
    examples,
  },

  Mutation: {
    createExample,
    // updateExample, deleteExample
  },
};

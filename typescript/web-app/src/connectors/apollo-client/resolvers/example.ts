import localforage from "localforage";
import { v4 as uuidv4 } from "uuid";
import { isEmpty } from "lodash/fp";
import { MutationCreateExampleArgs } from "../../../types";

const typeName = "Example";
const typeNamePlural = "Examples";

// Queries
const example = () => {};
const examples = async () => {
  const entityKeysList = await localforage.getItem(typeNamePlural);
  if (isEmpty(entityKeysList)) {
    return [];
  }
  const entities = await Promise.all(
    (entityKeysList as []).map((key: string) => localforage.getItem(key))
  );
  return entities;
};

// Mutations
const createExample = async (_: any, args: MutationCreateExampleArgs) => {
  const newEntity = {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    id: uuidv4(),

    // Add your specific fields here
    name: args?.name,
  };

  // Set entity in db
  const newEntityKey = `${typeName}:${newEntity.id}`;

  await localforage.setItem(newEntityKey, newEntity);

  // Add entity to entity list
  const oldEntityKeysList = await localforage.getItem(typeNamePlural);

  const newEntitiesList =
    oldEntityKeysList == null
      ? [newEntityKey]
      : [...(oldEntityKeysList as []), newEntityKey];

  await localforage.setItem(typeNamePlural, newEntitiesList);

  return newEntity;
};

const updateExample = () => {};
const deleteExample = () => {};

export default {
  Query: {
    // example,
    examples,
  },

  Mutation: {
    createExample,
    // updateExample, deleteExample
  },
};

import localforage from "localforage";
import { v4 as uuidv4 } from "uuid";

const typeName = "Example";
const typeNamePlural = "Examples";

// Queries
const example = () => {};
const examples = () => {};

// Mutations
const createExample = async (_: any, args: { name: string }) => {
  const newEntity = {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    id: uuidv4(),

    // Add your specific fields here
    name: args?.name,
  };

  // Set project in db
  const newProjectKey = `${typeName}:${newEntity.id}`;

  await localforage.setItem(newProjectKey, newEntity);

  // Add project to project list
  const oldProjectKeysList = await localforage.getItem(typeNamePlural);

  const newEntitiesList =
    oldProjectKeysList === undefined || oldProjectKeysList === null
      ? [newProjectKey]
      : [...(oldProjectKeysList as []), newProjectKey];

  await localforage.setItem(typeNamePlural, newEntitiesList);

  return newEntity;
};

const updateExample = () => {};
const deleteExample = () => {};

export default {
  Query: { example, examples },

  Mutation: { createExample, updateExample, deleteExample },
};

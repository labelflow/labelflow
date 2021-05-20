import localforage from "localforage";
import { v4 as uuidv4 } from "uuid";
import {
  MutationCreateImageArgs,
  QueryImageArgs,
  QueryImagesArgs,
} from "../../../types.generated";
import { appendToListInStorage, getListFromStorage } from "./utils";

const typeName = "Image";
const typeNamePlural = "Image:list";

// Queries
export const image = (_: any, args: QueryImageArgs) => {
  return localforage.getItem(`${typeName}:${args?.where?.id}`);
};
export const images = async (_: any, args: QueryImagesArgs) => {
  const entities = await getListFromStorage(typeNamePlural);
  const first = args?.first ?? entities.length;
  const skip = args?.skip ?? 0;
  return entities.slice(skip, first + skip);
};

// Mutations
export const createImage = async (_: any, args: MutationCreateImageArgs) => {
  const newEntity = {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    id: args?.data?.id ?? uuidv4(),
    name: args?.data?.name,
    width: args?.data?.width,
    height: args?.data?.height,
    url: args?.data?.url,
  };

  // Set entity in db
  const newEntityKey = `${typeName}:${newEntity.id}`;
  await localforage.setItem(newEntityKey, newEntity);

  // Add entity to entity list
  await appendToListInStorage(typeNamePlural, newEntityKey);

  return newEntity;
};

export default {
  Query: {
    image,
    images,
  },

  Mutation: {
    createImage,
  },
};

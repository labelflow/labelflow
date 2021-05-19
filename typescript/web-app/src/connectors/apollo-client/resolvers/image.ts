import localforage from "localforage";
import { v4 as uuidv4 } from "uuid";
import { isEmpty } from "lodash/fp";
import {
  MutationCreateImageArgs,
  QueryImageArgs,
  QueryImagesArgs,
} from "../../../types";

const typeName = "Image";
const typeNamePlural = "Image:list";

// Queries
export const image = async (_: any, args: QueryImageArgs) => {
  const entity = await localforage.getItem(`${typeName}:${args?.where?.id}`);
  return entity;
};
export const images = async (_: any, args: QueryImagesArgs) => {
  const entityKeysList = await localforage.getItem(typeNamePlural);
  if (isEmpty(entityKeysList)) {
    return [];
  }
  const entities = await Promise.all(
    (entityKeysList as []).map((key: string) => localforage.getItem(key))
  );
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
  const oldEntityKeysList = await localforage.getItem(typeNamePlural);

  const newEntitiesList =
    oldEntityKeysList == null
      ? [newEntityKey]
      : [...(oldEntityKeysList as []), newEntityKey];

  await localforage.setItem(typeNamePlural, newEntitiesList);

  return newEntity;
};

// const updateImage = () => { };
// const deleteImage = () => { };

export default {
  Query: {
    image,
    images,
  },

  Mutation: {
    createImage,
    // updateImage, deleteImage
  },
};

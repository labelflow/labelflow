import localforage from "localforage";
import { v4 as uuidv4 } from "uuid";
import {
  Image,
  MutationCreateImageArgs,
  QueryImageArgs,
  QueryImagesArgs,
} from "../../../types.generated";

const mapKeyToUrl = new Map<string, string>();
const typeName = "Image";
const typeNamePlural = "Image:list";

const getImageByKey = async (key: string) => {
  const entity = await localforage.getItem<Image>(key);
  if (mapKeyToUrl.has(key)) {
    return { ...entity, url: mapKeyToUrl.get(key) };
  }
  const file = await localforage.getItem(`${key}:blob`);
  const url = window.URL.createObjectURL(file);
  mapKeyToUrl.set(key, url);
  return { ...entity, url };
};

// Queries
export const image = async (_: any, args: QueryImageArgs) => {
  const imageEntity = await getImageByKey(`${typeName}:${args?.where?.id}`);
  return imageEntity;
};
export const images = async (_: any, args: QueryImagesArgs) => {
  const entityKeysList = await localforage.getItem<string[]>(typeNamePlural);
  if (entityKeysList == null) {
    return [];
  }

  const first = args?.first ?? entityKeysList.length;
  const skip = args?.skip ?? 0;

  const filteredKeys = entityKeysList.slice(skip, first + skip);

  const entities = await Promise.all(filteredKeys.map(getImageByKey));
  return entities;
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

import localforage from "localforage";
import { v4 as uuidv4 } from "uuid";
import memoize from "mem";
import {
  Image,
  MutationCreateImageArgs,
  QueryImageArgs,
  QueryImagesArgs,
} from "../../../types.generated";

import { appendToListInStorage, getListFromStorage } from "./utils";

const typeName = "Image";
const typeNamePlural = "Image:list";

const getUrlFromKey = memoize(async (key: string) => {
  const file = await localforage.getItem(`${key}:blob`);
  const url = window.URL.createObjectURL(file);
  return url;
});

const getImageByKey = async (key: string) => {
  const entity = await localforage.getItem<Image>(key);
  const url = await getUrlFromKey(key);

  return { ...entity, url };
};

// Queries
export const image = async (_: any, args: QueryImageArgs) => {
  const imageEntity = await getImageByKey(`${typeName}:${args?.where?.id}`);
  return imageEntity;
};

export const images = async (_: any, args: QueryImagesArgs) => {
  const imagesList = await getListFromStorage<Image>(typeNamePlural, {
    first: args.first,
    skip: args.skip,
  });

  const entitiesWithUrls = await Promise.all(
    imagesList.map(async (imageEntity) => {
      return {
        ...imageEntity,
        url: await getUrlFromKey(`${typeName}:${imageEntity.id}`),
      };
    })
  );

  return entitiesWithUrls;
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

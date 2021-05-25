import localforage from "localforage";
import { v4 as uuidv4 } from "uuid";
import memoize from "mem";
import type {
  Image,
  MutationCreateImageArgs,
  QueryImageArgs,
  QueryImagesArgs,
} from "../../../types.generated";

import { appendToListInStorage, getListFromStorage } from "./utils";

const typeName = "Image";
const typeNamePlural = "Image:list";

// Lorem ipsum

const getUrlFromKey = memoize(async (key: string) => {
  const file = await localforage.getItem(`${key}:blob`);
  const url = window.URL.createObjectURL(file);
  return url;
});

export const clearGetUrlFromKeyMem = () => {
  memoize.clear(getUrlFromKey);
};

const getImageByKey = async (key: string): Promise<Image> => {
  const entity = await localforage.getItem<Image>(key);
  const url = await getUrlFromKey(key);

  return { ...entity, url } as Image;
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
export const createImage = async (
  _: any,
  args: MutationCreateImageArgs
): Promise<Image> => {
  const { file, id, name } = args.data;
  const imageId = id ?? uuidv4();
  const fileStorageKey = `${typeName}:${imageId}:blob`;
  await localforage.setItem(fileStorageKey, file);
  const url = await getUrlFromKey(fileStorageKey);

  const newEntity = await new Promise<Image>((resolve, reject) => {
    const imageObject = new Image();
    imageObject.onload = async () => {
      const newImageEntity = {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        id: imageId,
        name: name ?? file.name,
        width: imageObject.width,
        height: imageObject.height,
      };

      // Set entity in db
      const newEntityKey = `${typeName}:${imageId}`;
      await localforage.setItem(newEntityKey, newImageEntity);
      // Add entity to entity list
      await appendToListInStorage(typeNamePlural, newEntityKey);

      resolve(await getImageByKey(newEntityKey));
    };
    imageObject.onerror = reject;
    imageObject.src = url;
  });

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

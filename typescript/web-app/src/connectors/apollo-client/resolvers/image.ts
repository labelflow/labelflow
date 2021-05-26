import { v4 as uuidv4 } from "uuid";
import memoize from "mem";
import type {
  Image,
  MutationCreateImageArgs,
  QueryImageArgs,
  QueryImagesArgs,
} from "../../../types.generated";

import { db } from "../../database";

const getUrlFromKey = memoize(async (id: string) => {
  const file = await db.files.get(id);

  if (file === undefined) {
    throw new Error("Cannot get url or undefined file");
  }

  const url = window.URL.createObjectURL(file.blob);
  return url;
});

export const clearGetUrlFromKeyMem = () => {
  memoize.clear(getUrlFromKey);
};

const getImageByKey = async (id: string): Promise<Image> => {
  const entity = await db.images.get(id);

  if (entity === undefined) {
    throw new Error("No image with such id");
  }

  const url = await getUrlFromKey(entity.fileId);

  return { ...entity, url } as Image;
};

// Queries
export const image = async (_: any, args: QueryImageArgs) => {
  const imageEntity = await getImageByKey(args?.where?.id);
  return imageEntity;
};

// @ts-ignore
export const images = async (_: any, args: QueryImagesArgs) => {
  // const imagesList = await getListFromStorage<Image>(typeNamePlural, {
  //   first: args.first,
  //   skip: args.skip,
  // });

  const imagesList = await db.images.toArray();

  const entitiesWithUrls = await Promise.all(
    imagesList.map(async (imageEntity: any) => {
      return {
        ...imageEntity,
        url: await getUrlFromKey(imageEntity.fileId),
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
  const fileId = id ?? uuidv4();

  await db.files.add({ id: fileId, imageId, blob: file });
  const url = await getUrlFromKey(fileId);

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
        fileId,
      };

      await db.images.add(newImageEntity);
      resolve(await getImageByKey(imageId));
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

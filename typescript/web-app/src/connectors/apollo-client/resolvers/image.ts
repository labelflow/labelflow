import { v4 as uuidv4 } from "uuid";
import memoize from "mem";
import type {
  Image,
  MutationCreateImageArgs,
  QueryImageArgs,
  QueryImagesArgs,
  Maybe,
} from "../../../types.generated";

import { db } from "../../database";

const getUrlFromImageId = memoize(async (id: string) => {
  const file = await db.file.get(id);

  if (file === undefined) {
    throw new Error("Cannot get url or undefined file");
  }

  const url = window.URL.createObjectURL(file.blob);
  return url;
});

export const clearGetUrlFromImageIdMem = () => {
  memoize.clear(getUrlFromImageId);
};

const getImageById = async (id: string): Promise<Image> => {
  const entity = await db.image.get(id);

  if (entity === undefined) {
    throw new Error("No image with such id");
  }

  const url = await getUrlFromImageId(entity.fileId);

  return { ...entity, url } as Image;
};

const getPaginatedImages = async (
  skip?: Maybe<number>,
  first?: Maybe<number>
): Promise<any[]> => {
  const query = await db.image.orderBy("createdAt").offset(skip ?? 0);

  if (first) {
    return query.limit(first).toArray();
  }

  return query.toArray();
};

// Queries
export const image = async (_: any, args: QueryImageArgs) => {
  return getImageById(args?.where?.id);
};

export const images = async (_: any, args: QueryImagesArgs) => {
  const imagesList = await getPaginatedImages(args?.skip, args?.first);

  const entitiesWithUrls = await Promise.all(
    imagesList.map(async (imageEntity: any) => {
      return {
        ...imageEntity,
        url: await getUrlFromImageId(imageEntity.fileId),
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
  const { file, name } = args.data;
  const imageId = uuidv4();
  const fileId = uuidv4();

  await db.file.add({ id: fileId, imageId, blob: file });
  const url = await getUrlFromImageId(fileId);

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

      await db.image.add(newImageEntity);
      resolve(await getImageById(imageId));
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

import { v4 as uuidv4 } from "uuid";
import memoize from "mem";
import type {
  Image,
  MutationCreateImageArgs,
  QueryImageArgs,
  QueryImagesArgs,
  Maybe,
} from "../../../graphql-types.generated";

import { db, DbImage } from "../../database";

export const getUrlFromFileId = memoize(async (id: string): Promise<string> => {
  const file = await db.file.get(id);

  if (file === undefined) {
    throw new Error("Cannot get url or undefined file");
  }

  const url = window.URL.createObjectURL(file.blob);
  return url;
});

export const clearGetUrlFromFileIdMem = () => {
  memoize.clear(getUrlFromFileId);
};

const getImageById = async (id: string): Promise<DbImage> => {
  const entity = await db.image.get(id);

  if (entity === undefined) {
    throw new Error("No image with such id");
  }

  if (!("url" in entity)) {
    const url = await getUrlFromFileId(entity.fileId);
    return { ...entity, url };
  }
  return entity;
};

export const getPaginatedImages = async (
  skip?: Maybe<number>,
  first?: Maybe<number>
): Promise<any[]> => {
  const query = db.image.orderBy("createdAt").offset(skip ?? 0);

  if (first) {
    return query.limit(first).toArray();
  }

  return query.toArray();
};

export const getLabelsByImageId = async (imageId: string) => {
  const getResults = await db.label.where({ imageId }).sortBy("createdAt");

  return getResults ?? [];
};

// Queries
const labels = async ({ id }: Image) => {
  return getLabelsByImageId(id);
};

const image = (_: any, args: QueryImageArgs) => {
  return getImageById(args?.where?.id);
};

const images = async (_: any, args: QueryImagesArgs) => {
  const imagesList = await getPaginatedImages(args?.skip, args?.first);

  const entitiesWithUrls = await Promise.all(
    imagesList.map(async (imageEntity: any) => {
      return {
        ...imageEntity,
        url: await getUrlFromFileId(imageEntity.fileId),
      };
    })
  );

  return entitiesWithUrls;
};

// Mutations
const createImage = async (
  _: any,
  args: MutationCreateImageArgs
): Promise<Partial<Image>> => {
  const { file, id, name } = args.data;
  const imageId = id ?? uuidv4();
  const fileId = uuidv4();

  await db.file.add({ id: fileId, imageId, blob: file });
  const url = await getUrlFromFileId(fileId);

  const newEntity = await new Promise<Partial<Image>>((resolve, reject) => {
    const imageObject = new Image();
    const now = new Date();

    imageObject.onload = async () => {
      const newImageEntity = {
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        id: imageId,
        path: file.name,
        name: name ?? file.name,
        mimetype: file.type,
        width: imageObject.width,
        height: imageObject.height,
        fileId,
      };

      await db.image.add(newImageEntity);
      resolve(getImageById(imageId));
    };
    imageObject.onerror = async () => {
      reject(
        new Error("Could not load the image, it may be damaged or corrupted.")
      );
      await db.file.delete(fileId);
    };
    imageObject.src = url;
  });

  return { ...newEntity, url };
};

export default {
  Query: {
    image,
    images,
  },

  Mutation: {
    createImage,
  },

  Image: {
    labels,
  },
};

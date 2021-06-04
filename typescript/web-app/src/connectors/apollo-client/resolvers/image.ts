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

const getUrlFromFileId = memoize(async (id: string): Promise<string> => {
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

const getPaginatedImages = async (
  skip?: Maybe<number>,
  first?: Maybe<number>
): Promise<any[]> => {
  const query = db.image.orderBy("createdAt").offset(skip ?? 0);

  if (first) {
    return query.limit(first).toArray();
  }

  return query.toArray();
};

// Queries
const labels = async (image: Image) => {
  const getResults = await db.label
    .where({ imageId: image.id })
    .sortBy("createdAt");

  return getResults ?? [];
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
): Promise<DbImage> => {
  const { file, id, name, height, width, mimetype, path, url } = args.data;
  if (file && !url) {
    // File Content based upload
    try {
      const imageId = id ?? uuidv4();
      const fileId = uuidv4();

      await db.file.add({ id: fileId, imageId, blob: file });
      const imageSrc = await getUrlFromFileId(fileId);

      const newEntity = await new Promise<DbImage>((resolve, reject) => {
        const imageObject = new Image();
        const now = new Date();

        imageObject.onload = async () => {
          const newImageEntity = {
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
            id: imageId,
            path: path ?? (file as File).name,
            mimetype: mimetype ?? file.type,
            name: name ?? file.name,
            width: width ?? imageObject.width,
            height: height ?? imageObject.height,
            fileId,
          };

          await db.image.add(newImageEntity);
          resolve(getImageById(imageId));
        };
        imageObject.onerror = async () => {
          reject(
            new Error(
              "Could not load the image, it may be damaged or corrupted."
            )
          );
          await db.file.delete(fileId);
        };
        imageObject.src = imageSrc;
      });

      return newEntity;
    } catch (e) {
      throw new Error(
        "File upload with a `file` field of type `Upload` is not supported on this server, upload with a `url` field of type `String` instead"
      );
    }
  }
  if (!file && url) {
    if (!path || !mimetype || !name || !width || !height)
      throw new Error(
        "File upload with a `url` field must include all of the following fields: `path`, `mimetype`, `name`, `width`, `height`."
      );

    // File URL based upload
    const imageId = id ?? uuidv4();

    const now = new Date();

    const newImageEntity: DbImage = {
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      id: imageId,
      url,
      path,
      mimetype,
      name,
      width,
      height,
    };

    await db.image.add(newImageEntity);

    return getImageById(imageId);
  }
  throw new Error(
    "File upload must include either a `file` field of type `Upload`, or a `url` field of type `String`"
  );
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

import { v4 as uuidv4 } from "uuid";
import memoize from "mem";
import probe from "probe-image-size";

import type {
  Image,
  MutationCreateImageArgs,
  QueryImageArgs,
  QueryImagesArgs,
  Maybe,
} from "../../../graphql-types.generated";

import { db, DbImage } from "../../database";

let windowExists: boolean | null = null;
// Robust way to detect if window exists, only once
const detectWindow = () => {
  if (windowExists === null) {
    try {
      if (window) {
        windowExists = true;
      } else {
        windowExists = false;
      }
    } catch (e) {
      windowExists = false;
    }
  }
};
detectWindow();

const getUrlFromFileId = memoize(async (id: string): Promise<string> => {
  if (windowExists) {
    const file = await db.file.get(id);
    if (file === undefined) {
      throw new Error("Cannot get url or undefined file");
    }
    const url = window.URL.createObjectURL(file.blob);
    return url;
  }
  throw new Error(
    "On server, the `getUrlFromFileId` function should not be called"
  );
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
    console.log("File Content based upload");
    try {
      const imageId = id ?? uuidv4();
      const fileId = uuidv4();

      await db.file.add({ id: fileId, imageId, blob: file });
      const localUrl = await getUrlFromFileId(fileId);

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
        imageObject.src = localUrl;
      });

      return newEntity;
    } catch (e) {
      throw new Error(
        "File upload with a `file` field of type `Upload` is not supported on this server, upload with a `url` field of type `String` instead"
      );
    }
  }
  if (!file && url) {
    // File URL based upload
    console.log("File URL based upload");

    const fetchHeaders = new Headers();
    fetchHeaders.append(
      "Accept",
      // "image/tiff,image/jpeg,image/png,image/webp,image/*,*/*;q=0.8"
      "image/tiff,image/jpeg,image/png,image/*,*/*;q=0.8"
    );
    fetchHeaders.append("Sec-Fetch-Dest", "image");
    fetchHeaders.append("Cache-Control", "no-cache");

    const fetchResult = await fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: fetchHeaders,
      credentials: "omit",
    });

    const blob = await fetchResult.blob();

    const fileId = uuidv4();
    const imageId = id ?? uuidv4();

    const now = new Date();

    await db.file.add({ id: fileId, imageId, blob });

    try {
      // Probe the file to get its dimensions and mimetype if not provided
      let finalWidth = width;
      let finalHeight = height;
      let finalMimetype = mimetype;

      if (!finalWidth || !finalHeight || !finalMimetype) {
        const probeInput = new Uint8Array(await blob.arrayBuffer());

        console.log("ok");

        console.log("probeInput");
        console.log(probeInput);

        const probeResult = probe.sync(probeInput as Buffer);

        if (probeResult == null) {
          console.log("probeResult");
          console.log(probeResult);
          throw new Error(
            "Could not load the image, it may be damaged or corrupted."
          );
        }

        if (!finalWidth) finalWidth = probeResult.width;
        if (!finalHeight) finalHeight = probeResult.height;
        if (!finalMimetype) finalMimetype = probeResult.mime;
      }

      const newImageEntity: DbImage = {
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        id: imageId,
        url,
        path: path ?? url,
        mimetype: finalMimetype,
        name: name ?? url.substring(url.lastIndexOf("/") + 1),
        width: finalWidth,
        height: finalHeight,
        fileId,
      };

      await db.image.add(newImageEntity);

      console.log("Yooooo");
      const result = await getImageById(imageId);
      console.log("xxx");
      return result;
    } catch (e) {
      console.error(e);
      await db.file.delete(fileId);
      throw new Error(
        "Could not load the image, it may be damaged or corrupted."
      );
    }
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

import { v4 as uuidv4 } from "uuid";
import memoize from "mem";
import probe from "probe-image-size";

import type {
  MutationCreateImageArgs,
  QueryImageArgs,
  QueryImagesArgs,
  Maybe,
} from "../../graphql-types.generated";

import { db, DbImage } from "../database";
import {
  isInWindowScope,
  isInServiceWorkerScope,
} from "../../utils/detect-scope";

declare let self: ServiceWorkerGlobalScope;

export const getUrlFromFileId = memoize(
  async (fileId: string): Promise<string> => {
    if (isInWindowScope) {
      // in window scope
      const file = await db.file.get(fileId);
      if (file === undefined) {
        throw new Error("Cannot get url or undefined file");
      }
      const url = window.URL.createObjectURL(file.blob);
      return url;
    }
    if (isInServiceWorkerScope) {
      // in worker scope
      return `${self.location.origin}/api/worker/files/${fileId}`;
    }
    throw new Error(
      "Cannot determine if running in window scope or in worker scope, are you running in node js ?"
    );
  }
);

export const clearGetUrlFromFileIdMem = () => {
  memoize.clear(getUrlFromFileId);
};

export const getFileIdFromUrl = (url: string): string | null => {
  const urlLocation = new URL(url);
  let currentLocation;
  if (isInWindowScope) {
    currentLocation = window.location;
  }
  if (isInServiceWorkerScope) {
    currentLocation = self.location;
  }
  if (currentLocation === undefined) {
    throw new Error(
      "Cannot determine if running in window scope or in worker scope, are you running in node js ?"
    );
  }
  if (currentLocation.origin === urlLocation.origin) {
    return urlLocation.pathname.replace("/api/worker/files/", "");
  }
  // Return
  return null;
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
export const labelsResolver = async ({ id }: DbImage) => {
  return getLabelsByImageId(id);
};

export const urlResolver = async (dbImage: DbImage) => {
  if ("fileId" in dbImage) {
    return getUrlFromFileId(dbImage.fileId);
  }
  if ("url" in dbImage) {
    return dbImage.url;
  }
  throw new Error("Can't fin url of image which has no url nor file");
};

const image = async (_: any, args: QueryImageArgs) => {
  const entity = await db.image.get(args?.where?.id);
  if (entity === undefined) {
    throw new Error("No image with such id");
  }
  return entity;
};

const images = async (_: any, args: QueryImagesArgs) => {
  const imagesList = await getPaginatedImages(args?.skip, args?.first);

  const entitiesWithUrls = await Promise.all(
    imagesList.map(async (imageEntity: any) => {
      return {
        ...imageEntity,
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

      await db.file.add({ id: fileId, blob: file });
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
          resolve(newImageEntity);
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

    const identifiedFileId = getFileIdFromUrl(url);

    if (identifiedFileId) {
      // Internal URL
      const dbFile = await db.file.get(identifiedFileId);

      if (!dbFile) {
        throw new Error(
          `Could not find file at ${url}, did you upload it first to ${url} ?`
        );
      }

      const { blob } = dbFile;

      const fileId = identifiedFileId;
      const imageId = id ?? uuidv4();

      const now = new Date();

      // Probe the file to get its dimensions and mimetype if not provided
      let finalWidth = width;
      let finalHeight = height;
      let finalMimetype = mimetype;

      if (!finalWidth || !finalHeight || !finalMimetype) {
        const probeInput = new Uint8Array(await blob.arrayBuffer());

        const probeResult = probe.sync(probeInput as Buffer);

        if (probeResult == null) {
          throw new Error(
            `The image stored locally at ${url} may be damaged or corrupted.`
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
        name: name ?? url.substring(url.lastIndexOf("/") + 1, url.indexOf("?")),
        width: finalWidth,
        height: finalHeight,
        fileId,
      };

      await db.image.add(newImageEntity);

      return newImageEntity;
    }

    const fetchHeaders = new Headers();
    fetchHeaders.append(
      "Accept",
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

    if (fetchResult.status !== 200) {
      throw new Error(
        `Could not fetch image at url ${url} properly, code ${fetchResult.status}`
      );
    }
    const blob = await fetchResult.blob();

    const fileId = uuidv4();
    const imageId = id ?? uuidv4();

    const now = new Date();

    await db.file.add({ id: fileId, blob });

    // Probe the file to get its dimensions and mimetype if not provided
    let finalWidth = width;
    let finalHeight = height;
    let finalMimetype = mimetype;

    if (!finalWidth || !finalHeight || !finalMimetype) {
      const probeInput = new Uint8Array(await blob.arrayBuffer());

      const probeResult = probe.sync(probeInput as Buffer);

      if (probeResult == null) {
        throw new Error(
          `Could not probe the external image at url ${url} it may be damaged or corrupted.`
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
      name: name ?? url.substring(url.lastIndexOf("/") + 1, url.indexOf("?")),
      width: finalWidth,
      height: finalHeight,
      fileId,
    };

    await db.image.add(newImageEntity);

    return newImageEntity;
  }
  throw new Error(
    "File upload must include either a `file` field of type `Upload`, or a `url` field of type `String`"
  );
};

const imagesAggregates = () => {
  return {};
};

const totalCount = () => {
  return db.image.count();
};

export default {
  Query: {
    image,
    images,
    imagesAggregates,
  },

  Mutation: {
    createImage,
  },

  Image: {
    labels: labelsResolver,
    url: urlResolver,
  },

  ImagesAggregates: { totalCount },
};

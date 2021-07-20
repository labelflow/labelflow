import { v4 as uuidv4 } from "uuid";
import probe from "probe-image-size";

import type {
  MutationCreateImageArgs,
  QueryImageArgs,
  QueryImagesArgs,
  Maybe,
  ImageWhereInput,
} from "../../graphql-types.generated";

import { db, DbImage } from "../database";
import { uploadsCacheName, getUploadTargetHttp } from "./upload";
import { projectTypename } from "./project";
import { Repository } from "../repository";

export const getPaginatedImages = async (
  where?: Maybe<ImageWhereInput>,
  skip?: Maybe<number>,
  first?: Maybe<number>
): Promise<any[]> => {
  const query = db.image.orderBy("createdAt");

  if (where?.projectId) {
    query.filter((image) => image.projectId === where.projectId);
  }

  if (skip) {
    query.offset(skip);
  }
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

const image = async (
  _: any,
  args: QueryImageArgs,
  { repository }: { repository: Repository }
) => {
  const entity = await repository.image.getById(args?.where?.id);
  if (entity === undefined) {
    throw new Error("No image with such id");
  }
  return entity;
};

const images = async (
  _: any,
  args: QueryImagesArgs,
  { repository }: { repository: Repository }
) => {
  return repository.image.list(args?.where, args?.skip, args?.first);
};

/**
 * Given a partial image, return a completed version of the image, probing it if necessary
 */
const probeImage = async ({
  width,
  height,
  mimetype,
  url,
}: {
  width: number | null | undefined;
  height: number | null | undefined;
  mimetype: string | null | undefined;
  url: string;
}): Promise<{
  width: number;
  height: number;
  mimetype: string;
}> => {
  if (width && height && mimetype) {
    return { width, height, mimetype };
  }

  // TODO: It would be nice to import "probe-image-size" asynchronously to reduce initial bundle size of sw, but webpack config todo.
  // const probe = await import(/* webpackPrefetch: true */ "probe-image-size");

  const cacheResult = await (await caches.open(uploadsCacheName)).match(url);

  const fetchResult =
    cacheResult ??
    (await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: new Headers({
        Accept: "image/tiff,image/jpeg,image/png,image/*,*/*;q=0.8",
        "Sec-Fetch-Dest": "image",
      }),
      credentials: "omit",
    }));

  if (fetchResult.status !== 200) {
    throw new Error(
      `Could not fetch image at url ${url} properly, code ${fetchResult.status}`
    );
  }

  const probeInput = new Uint8Array(await fetchResult.arrayBuffer());

  const probeResult = probe.sync(probeInput as Buffer);

  if (probeResult == null) {
    throw new Error(
      `Could not probe the external image at url ${url} it may be damaged or corrupted.`
    );
  }

  return {
    width: width ?? probeResult.width,
    height: height ?? probeResult.height,
    mimetype: mimetype ?? probeResult.mime,
  };
};

// Mutations
const createImage = async (
  _: any,
  args: MutationCreateImageArgs,
  { repository }: { repository: Repository }
): Promise<DbImage> => {
  const {
    file,
    id,
    name,
    height,
    width,
    mimetype,
    path,
    url,
    externalUrl,
    projectId,
  } = args.data;

  // Since we don't have any constraint checks with Dexie
  // we need to ensure that the projectId matches some
  // entity before being able to continue.
  const project = await db.project.get(projectId);
  if (project == null) {
    throw new Error(`The project id ${projectId} doesn't exist.`);
  }

  const now = args?.data?.createdAt ?? new Date().toISOString();
  const imageId = id ?? uuidv4();
  let finalUrl: string | undefined;

  if (
    !(
      (!file && !externalUrl && url) ||
      (!file && externalUrl && !url) ||
      (file && !externalUrl && !url)
    )
  ) {
    throw new Error(
      "Image creation upload must include either a `file` field of type `Upload`, or a `url` field of type `String`, or a `externalUrl` field of type `String`"
    );
  }

  if (!file && !externalUrl && url) {
    // No File Upload
    finalUrl = url;
  }

  if (!file && externalUrl && !url) {
    // External file based upload

    const fetchResult = await fetch(externalUrl, {
      method: "GET",
      mode: "cors",
      headers: new Headers({
        Accept: "image/tiff,image/jpeg,image/png,image/*,*/*;q=0.8",
        "Sec-Fetch-Dest": "image",
      }),
      credentials: "omit",
    });

    if (fetchResult.status !== 200) {
      throw new Error(
        `Could not fetch image at url ${url} properly, code ${fetchResult.status}`
      );
    }

    const uploadTarget = await getUploadTargetHttp();

    // eslint-disable-next-line no-underscore-dangle
    if (uploadTarget.__typename !== "UploadTargetHttp") {
      throw new Error(
        "This Server does not support file upload. You can create images by providing a `file` directly in the `createImage` mutation"
      );
    }

    finalUrl = uploadTarget.downloadUrl;

    const responseOfGet = new Response(await fetchResult.blob(), {
      status: 200,
      statusText: "OK",
      headers: new Headers({
        "Content-Type":
          fetchResult.headers.get("Content-Type") ?? "application/octet-stream",
        "Content-Length": fetchResult.headers.get("Content-Length") ?? "0",
      }),
    });

    await (await caches.open(uploadsCacheName)).put(finalUrl, responseOfGet);
  }

  if (file && !externalUrl && !url) {
    // File Content based upload

    const uploadTarget = await getUploadTargetHttp();

    // eslint-disable-next-line no-underscore-dangle
    if (uploadTarget.__typename !== "UploadTargetHttp") {
      throw new Error(
        "This Server does not support file upload. You can create images by providing a `file` directly in the `createImage` mutation"
      );
    }
    finalUrl = uploadTarget.downloadUrl;

    const response = new Response(file, {
      status: 200,
      statusText: "OK",
      headers: new Headers({
        "Content-Type": file.type ?? "application/octet-stream",
        "Content-Length": file.size.toString() ?? "0",
      }),
    });

    await (await caches.open(uploadsCacheName)).put(finalUrl, response);
  }

  // Probe the file to get its dimensions and mimetype if not provided
  const imageMetaData = await probeImage({
    width,
    height,
    mimetype,
    url: finalUrl!,
  });

  const newImageEntity: DbImage = {
    projectId,
    createdAt: now,
    updatedAt: now,
    id: imageId,
    url: finalUrl!,
    externalUrl,
    path: path ?? externalUrl ?? finalUrl!,
    name:
      name ??
      externalUrl?.substring(
        externalUrl?.lastIndexOf("/") + 1,
        externalUrl?.indexOf("?")
      ) ??
      finalUrl!.substring(
        finalUrl!.lastIndexOf("/") + 1,
        finalUrl!.indexOf("?")
      ),
    ...imageMetaData,
  };

  await repository.image.add(newImageEntity);

  return newImageEntity;
};

const imagesAggregates = (parent: any) => {
  // Forward `parent` to chained resolvers if it exists
  return parent ?? {};
};

const totalCount = (
  parent: any,
  _args,
  { repository }: { repository: Repository }
) => {
  // eslint-disable-next-line no-underscore-dangle
  const typename = parent?.__typename;

  if (typename === projectTypename) {
    return db.image
      .where({
        projectId: parent.id,
      })
      .count();
  }

  return repository.image.count();
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
  },

  ImagesAggregates: { totalCount },

  Project: {
    imagesAggregates,
  },
};

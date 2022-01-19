import { v4 as uuidv4 } from "uuid";
import { ImageCreateInput } from "@labelflow/graphql-types";
import { Repository, DbImageCreateInput } from "../types";
import { getOrigin } from "../utils/get-origin";
import { validateImageInput } from "./validate-image-input";
import { getImageName } from "./get-image-name";
import { getImageFileKey } from "./get-image-file-key";

const uploadBlobIntoStorage = async (
  blob: Blob,
  key: string,
  { repository, req }: { repository: Repository; req: Request }
) => {
  const origin = getOrigin(req);

  const uploadTarget = await repository.upload.getUploadTargetHttp(key, origin);

  // eslint-disable-next-line no-underscore-dangle
  if (uploadTarget.__typename !== "UploadTargetHttp") {
    throw new Error(
      "This Server does not support file upload. You can create images by providing a `file` directly in the `createImage` mutation"
    );
  }

  await repository.upload.put(uploadTarget.uploadUrl, blob, req);
  return uploadTarget.downloadUrl;
};

/**
 * Downloads the image from the external url and upload it
 * into our storage.
 *
 * We could however directly use the external url,
 * but be would rely on this external storage server.
 */
const importFromExternalUrl = async (
  externalUrl: string,
  getImageFileKeyFromMimeType: (mimeType: string) => string,
  { req, repository }: { req: Request; repository: Repository }
) => {
  const headers = new Headers();
  headers.set("Accept", "image/tiff,image/jpeg,image/png,image/*,*/*;q=0.8");
  headers.set("Sec-Fetch-Dest", "image");

  const fetchResult = await fetch(externalUrl, {
    method: "GET",
    mode: "cors",
    headers,
    credentials: "omit",
  });

  if (fetchResult.status !== 200) {
    throw new Error(
      `Could not fetch image at url ${externalUrl} properly, code ${fetchResult.status}`
    );
  }

  const blob = await fetchResult.blob();
  const key = getImageFileKeyFromMimeType(blob.type);

  return await uploadBlobIntoStorage(blob, key, {
    req,
    repository,
  });
};

/**
 * Simply put the given file into our storage.
 */
const importFromFile = async (
  file: Blob,
  getImageFileKeyFromMimeType: (mimeType: string) => string,
  { req, repository }: { req: Request; repository: Repository }
) => {
  const key = getImageFileKeyFromMimeType(file.type);

  return await uploadBlobIntoStorage(file, key, {
    req,
    repository,
  });
};

/**
 * Handles import for every case (either url, externalUrl or file).
 * - url: Nothing to do, we assume it was already loaded on our storage by the web client.
 * - externalUrl: Downloads the image from the external url and put it into our storage.
 * - file: Puts the file into our storage.
 */
const importImageIfNeeded = async (
  {
    url,
    externalUrl,
    file,
    imageId,
    workspaceId,
    datasetId,
  }: {
    url: string | undefined | null;
    externalUrl: string | undefined | null;
    file: any | undefined | null;
    imageId: string;
    workspaceId: string;
    datasetId: string;
  },
  { req, repository }: { req: Request; repository: Repository }
): Promise<string> => {
  validateImageInput({ file, externalUrl, url });

  const getImageFileKeyFromMimeType = (mimeType: string) =>
    getImageFileKey(imageId, workspaceId, datasetId, mimeType);

  if (externalUrl) {
    return await importFromExternalUrl(
      externalUrl,
      getImageFileKeyFromMimeType,
      { req, repository }
    );
  }

  if (file) {
    return await importFromFile(file, getImageFileKeyFromMimeType, {
      req,
      repository,
    });
  }

  return url as string;
};

const processImage = async (
  {
    noThumbnails,
    ...image
  }: {
    id: string;
    url: string;
    width: number | null | undefined;
    height: number | null | undefined;
    mimetype: string | null | undefined;
    noThumbnails?: boolean | null | undefined;
    thumbnail20Url: string | null | undefined;
    thumbnail50Url: string | null | undefined;
    thumbnail100Url: string | null | undefined;
    thumbnail200Url: string | null | undefined;
    thumbnail500Url: string | null | undefined;
  },
  { repository, req }: { repository: Repository; req: Request }
) => {
  const origin = getOrigin(req);

  const getImage = (fromUrl: string) => repository.upload.get(fromUrl, req);

  const downloadUrlPrefix = (
    await repository.upload.getUploadTargetHttp("", origin)
  ).downloadUrl;

  const putThumbnail = async (targetDownloadUrl: string, blob: Blob) => {
    const key = targetDownloadUrl.substring(downloadUrlPrefix.length);
    const toUrl = (await repository.upload.getUploadTargetHttp(key, origin))
      .uploadUrl;

    await repository.upload.put(toUrl, blob, req);
  };

  if (noThumbnails) {
    return await repository.imageProcessing.processImage(
      {
        ...image,
        thumbnail20Url: image.thumbnail20Url ?? image.url,
        thumbnail50Url: image.thumbnail50Url ?? image.url,
        thumbnail100Url: image.thumbnail100Url ?? image.url,
        thumbnail200Url: image.thumbnail200Url ?? image.url,
        thumbnail500Url: image.thumbnail500Url ?? image.url,
      },
      getImage,
      putThumbnail
    );
  }

  return await repository.imageProcessing.processImage(
    image,
    getImage,
    putThumbnail
  );
};

/**
 * This functions does multiple things:
 * - It ensures that the inputs are corrects
 * - It imports the image to the storage if necessary
 * - It processes the image (generates thumbnails, validate size)
 */
export const importAndProcessImage = async (
  { image, workspaceId }: { image: ImageCreateInput; workspaceId: string },
  { repository, req }: { repository: Repository; req: Request }
) => {
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
    datasetId,
    noThumbnails,
    thumbnail20Url,
    thumbnail50Url,
    thumbnail100Url,
    thumbnail200Url,
    thumbnail500Url,
    metadata,
  } = image;

  const now = image?.createdAt ?? new Date().toISOString();
  const imageId = id ?? uuidv4();

  const finalUrl: string | undefined = await importImageIfNeeded(
    { url, externalUrl, file, imageId, workspaceId, datasetId },
    { req, repository }
  );

  const imageMetadataFromProcessing = await processImage(
    {
      id: imageId,
      url: finalUrl,
      width,
      height,
      mimetype,
      noThumbnails,
      thumbnail20Url,
      thumbnail50Url,
      thumbnail100Url,
      thumbnail200Url,
      thumbnail500Url,
    },
    { repository, req }
  );

  const finalName = getImageName({ externalUrl, finalUrl, name });
  const finalPath = path ?? externalUrl ?? finalUrl;

  const newImageEntity: DbImageCreateInput = {
    id: imageId,
    createdAt: now,
    updatedAt: now,
    name: finalName,
    path: finalPath,
    url: finalUrl,
    externalUrl,
    datasetId,
    metadata,
    ...imageMetadataFromProcessing,
  };

  return newImageEntity;
};

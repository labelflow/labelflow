import { v4 as uuidv4 } from "uuid";
import { ImageCreateInput } from "@labelflow/graphql-types";
import { Repository, DbImageCreateInput } from "../types";
import { getOrigin } from "../utils/get-origin";
import { getImageFileKey, getImageName } from "./utils";

const importFromExternalUrl = async (
  externalUrl: string,
  getImageFileKeyFromMimeType: (mimeType: string) => string,
  { req, repository }: { req: Request; repository: Repository }
) => {
  const origin = getOrigin(req);

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
      `While transferring image could not fetch image at url ${externalUrl} properly, code ${fetchResult.status}`
    );
  }

  const blob = await fetchResult.blob();

  const uploadTarget = await repository.upload.getUploadTargetHttp(
    getImageFileKeyFromMimeType(blob.type),
    origin
  );

  // eslint-disable-next-line no-underscore-dangle
  if (uploadTarget.__typename !== "UploadTargetHttp") {
    throw new Error(
      "This Server does not support file upload. You can create images by providing a `file` directly in the `createImage` mutation"
    );
  }

  // We decided to store the image in our file storage even if it comes from an external url.
  await repository.upload.put(uploadTarget.uploadUrl, blob, req);

  return uploadTarget.downloadUrl;
};

const importFromFile = async (
  file: any,
  getImageFileKeyFromMimeType: (mimeType: string) => string,
  { req, repository }: { req: Request; repository: Repository }
) => {
  const origin = getOrigin(req);

  const uploadTarget = await repository.upload.getUploadTargetHttp(
    getImageFileKeyFromMimeType(file.type),
    origin
  );

  // eslint-disable-next-line no-underscore-dangle
  if (uploadTarget.__typename !== "UploadTargetHttp") {
    throw new Error(
      "This Server does not support file upload. You can create images by providing a `file` directly in the `createImage` mutation"
    );
  }

  await repository.upload.put(uploadTarget.uploadUrl, file, req);

  return uploadTarget.downloadUrl;
};

/**
 * Very important function, which processes images (download from external URL if needed, probe metadata, create and upload thumbnails, etc.)
 * @param image ImageCreateInput
 * @param repository
 * @param req
 * @returns
 */
export const getImageEntityFromMutationArgs = async (
  { image, workspaceId }: { image: ImageCreateInput; workspaceId: string },
  { repository, req }: { repository: Repository; req?: Request }
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
  } = image;

  const now = image?.createdAt ?? new Date().toISOString();
  const imageId = id ?? uuidv4();

  const origin = getOrigin(req);

  let finalUrl: string | undefined;

  const getImageFileKeyFromMimeType = (mimeType: string) =>
    getImageFileKey(imageId, workspaceId, datasetId, mimeType);

  if (url) {
    // We don't need to perform anything else, we can use the provided URL
    finalUrl = url;
  }

  if (externalUrl) {
    finalUrl = await importFromExternalUrl(
      externalUrl,
      getImageFileKeyFromMimeType,
      { req, repository }
    );
  }

  if (file) {
    finalUrl = await importFromFile(file, getImageFileKeyFromMimeType, {
      req,
      repository,
    });
  }

  // Use the full size url if we don't want to generate thumbnails.
  // Else, use `undefined` to specify that it will need to be generated
  const defaultThumbnail = noThumbnails ? finalUrl : undefined;

  const imageToProcess = {
    id: imageId,
    width,
    height,
    mimetype,
    url: finalUrl,
    thumbnail20Url: thumbnail20Url ?? defaultThumbnail,
    thumbnail50Url: thumbnail50Url ?? defaultThumbnail,
    thumbnail100Url: thumbnail100Url ?? defaultThumbnail,
    thumbnail200Url: thumbnail200Url ?? defaultThumbnail,
    thumbnail500Url: thumbnail500Url ?? defaultThumbnail,
  };

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

  const imageMetaDataFromProcessing =
    await repository.imageProcessing.processImage(
      imageToProcess,
      getImage,
      putThumbnail
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
    ...imageMetaDataFromProcessing,
  };

  return newImageEntity;
};

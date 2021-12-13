import { v4 as uuidv4 } from "uuid";
import { ImageCreateInput } from "@labelflow/graphql-types";
import { Repository, DbImageCreateInput } from "../types";
import { getOrigin } from "../utils/get-origin";
import { getImageFileKey, getImageName } from "./utils";

/**
 * Very important function, which processes images (download from external URL if needed, probe metadata, create and upload thumbnails, etc.)
 * @param image ImageCreateInput
 * @param repository
 * @param req
 * @returns
 */
export const getImageEntityFromMutationArgs = async (
  {
    image,
    workspaceId,
    user,
  }: { image: ImageCreateInput; workspaceId: string; user?: { id: string } },
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
    thumbnail20Url,
    thumbnail50Url,
    thumbnail100Url,
    thumbnail200Url,
    thumbnail500Url,
  } = image;

  const now = image?.createdAt ?? new Date().toISOString();
  const imageId = id ?? uuidv4();
  let finalUrl: string | undefined;

  let thumbnailsUrls: { [key: string]: string } = {};
  if (thumbnail20Url) thumbnailsUrls.thumbnail20Url = thumbnail20Url;
  if (thumbnail50Url) thumbnailsUrls.thumbnail50Url = thumbnail50Url;
  if (thumbnail100Url) thumbnailsUrls.thumbnail100Url = thumbnail100Url;
  if (thumbnail200Url) thumbnailsUrls.thumbnail200Url = thumbnail200Url;
  if (thumbnail500Url) thumbnailsUrls.thumbnail500Url = thumbnail500Url;

  if (!file && !externalUrl && url) {
    // No File Upload
    finalUrl = url;
  }

  const origin = getOrigin(req);
  if (!file && externalUrl && !url) {
    // External file based upload
    const headers = new Headers();
    headers.set("Accept", "image/tiff,image/jpeg,image/png,image/*,*/*;q=0.8");
    headers.set("Sec-Fetch-Dest", "image");
    if ((req?.headers as any)?.cookie) {
      headers.set("Cookie", (req?.headers as any)?.cookie);
    }

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
      getImageFileKey(imageId, workspaceId, datasetId, blob.type),
      origin
    );

    // eslint-disable-next-line no-underscore-dangle
    if (uploadTarget.__typename !== "UploadTargetHttp") {
      throw new Error(
        "This Server does not support file upload. You can create images by providing a `file` directly in the `createImage` mutation"
      );
    }

    await repository.upload.put(uploadTarget.uploadUrl, blob, req);

    finalUrl = uploadTarget.downloadUrl;
  }

  if (file && !externalUrl && !url) {
    // File Content based upload
    const uploadTarget = await repository.upload.getUploadTargetHttp(
      getImageFileKey(imageId, workspaceId, datasetId, file.type),
      origin
    );

    // eslint-disable-next-line no-underscore-dangle
    if (uploadTarget.__typename !== "UploadTargetHttp") {
      throw new Error(
        "This Server does not support file upload. You can create images by providing a `file` directly in the `createImage` mutation"
      );
    }

    await repository.upload.put(uploadTarget.uploadUrl, file, req);

    finalUrl = uploadTarget.downloadUrl;
  }

  if (image.noThumbnails) {
    // Do not generate or store thumbnails on server, use either the thumbnails url provided above, or use the full size image as thumbnails
    thumbnailsUrls = {
      thumbnail20Url: finalUrl!,
      thumbnail50Url: finalUrl!,
      thumbnail100Url: finalUrl!,
      thumbnail200Url: finalUrl!,
      thumbnail500Url: finalUrl!,
      ...thumbnailsUrls,
    };
  }

  const downloadUrlPrefix = (
    await repository.upload.getUploadTargetHttp("", origin)
  ).downloadUrl;
  // Probe the file to get its dimensions and mimetype if not provided
  const imageMetaData = await repository.imageProcessing.processImage(
    {
      ...thumbnailsUrls,
      id: imageId,
      width,
      height,
      mimetype,
      url: finalUrl!,
    },
    (fromUrl: string) => repository.upload.get(fromUrl, req),
    async (targetDownloadUrl: string, blob: Blob) => {
      const key = targetDownloadUrl.substring(downloadUrlPrefix.length);
      const toUrl = (await repository.upload.getUploadTargetHttp(key, origin))
        .uploadUrl;
      await repository.upload.put(toUrl, blob, req);
    },
    repository.image.update,
    user
  );

  const newImageEntity: DbImageCreateInput = {
    datasetId,
    createdAt: now,
    updatedAt: now,
    id: imageId,
    url: finalUrl!,
    externalUrl,
    path: path ?? externalUrl ?? finalUrl!,
    name: getImageName({ externalUrl, finalUrl, name }),
    ...imageMetaData,
  };

  return newImageEntity;
};

import { v4 as uuidv4 } from "uuid";
import type { UploadTarget, UploadTargetHttp } from "@labelflow/graphql-types";
import { isInWindowScope } from "../../utils/detect-scope";

export const uploadsCacheName = "uploads";
export const uploadsRoute = "/api/worker/uploads";

declare let self: ServiceWorkerGlobalScope;

export const getUploadTargetHttp = (): UploadTargetHttp => {
  const fileId = uuidv4();
  return {
    __typename: "UploadTargetHttp",
    // Upload and download URL do not have to be the same. But in our implementation it is:
    uploadUrl: `${self.location.protocol}//${self.location.host}${uploadsRoute}/${fileId}`,
    downloadUrl: `${self.location.protocol}//${self.location.host}${uploadsRoute}/${fileId}`,
  };
};

/**
 * A way for the server to tell how it wants to accept file uploads
 * @returns a presigned URL for the client to upload files to, or `null` if the server wants to accept direct graphql uploads
 */
export const getUploadTarget = async (): Promise<UploadTarget> => {
  if (isInWindowScope) {
    // We run in the window scope
    return { __typename: "UploadTargetDirect", direct: true };
  }

  // We run in the worker scope or nodejs
  return getUploadTargetHttp();
};

export const putInStorage = async (url: string, file: Blob) => {
  const response = new Response(file, {
    status: 200,
    statusText: "OK",
    headers: new Headers({
      "Content-Type": file.type ?? "application/octet-stream",
      "Content-Length": file.size.toString() ?? "0",
    }),
  });

  await (await caches.open(uploadsCacheName)).put(url, response);
};

export const getFromStorage = async (url: string): Promise<ArrayBuffer> => {
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
  return fetchResult.arrayBuffer();
};

export const deleteFromStorage = async (url: string): Promise<void> => {
  const cache = await caches.open(uploadsCacheName);
  if (await cache.match(url)) {
    await cache.delete(url);
  }
};

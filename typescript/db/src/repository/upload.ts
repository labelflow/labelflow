import { v4 as uuidv4 } from "uuid";
import { Repository } from "../../../common-resolvers/src";
import { UploadTargetHttp } from "../../../graphql-types/src/graphql-types.generated";

const location = "http://localhost:5000/";
const uploadsRoute = "upload";

export const getUploadTargetHttp = (): UploadTargetHttp => {
  const fileId = uuidv4();
  return {
    __typename: "UploadTargetHttp",
    uploadUrl: `{${location}${uploadsRoute}}/${fileId}`,
    downloadUrl: `{${location}${uploadsRoute}}/${fileId}`,
  };
};

const dirtyInMemoryStorage = new Map();

export const getFromStorage: Repository["upload"]["get"] = async (url) => {
  const file = dirtyInMemoryStorage.get(url);

  return new Response(file, {
    status: 200,
    statusText: "OK",
    headers: new Headers({
      "Content-Type": file.type ?? "application/octet-stream",
      "Content-Length": file.size.toString() ?? "0",
    }),
  });
};

export const putInStorage: Repository["upload"]["put"] = async (url, blob) => {
  dirtyInMemoryStorage.set(url, blob);
};

// export const putInStorage = async (url: string, file: Blob) => {
//     const response = new Response(file, {
//       status: 200,
//       statusText: "OK",
//       headers: new Headers({
//         "Content-Type": file.type ?? "application/octet-stream",
//         "Content-Length": file.size.toString() ?? "0",
//       }),
//     });

//     await (await caches.open(uploadsCacheName)).put(url, response);
//   };

//   export const getFromStorage = async (url: string): Promise<Response> => {
//     const cacheResult = await (await caches.open(uploadsCacheName)).match(url);

//     const fetchResult =
//       cacheResult ??
//       (await fetch(url, {
//         method: "GET",
//         mode: "cors",
//         headers: new Headers({
//           Accept: "image/tiff,image/jpeg,image/png,image/*,*/*;q=0.8",
//           "Sec-Fetch-Dest": "image",
//         }),
//         credentials: "omit",
//       }));

//     if (fetchResult.status !== 200) {
//       throw new Error(
//         `Could not fetch image at url ${url} properly, code ${fetchResult.status}`
//       );
//     }
//     return fetchResult;
//   };

import { v4 as uuidv4 } from "uuid";
import fetch from "node-fetch";
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

const dirtyInMemoryStorage = new Map<string, Blob>();

// @ts-ignore
export const getFromStorage: Repository["upload"]["get"] = async (url) => {
  const file = dirtyInMemoryStorage.get(url);

  if (file) {
    return await file.arrayBuffer();
  }

  const fetchResult = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "image/tiff,image/jpeg,image/png,image/*,*/*;q=0.8",
      "Sec-Fetch-Dest": "image",
    },
  });

  if (fetchResult.status !== 200) {
    throw new Error(
      `Could not fetch image at url ${url} properly, code ${fetchResult.status}`
    );
  }
  return await fetchResult.arrayBuffer();
};

export const putInStorage: Repository["upload"]["put"] = async (url, blob) => {
  dirtyInMemoryStorage.set(url, blob);
};

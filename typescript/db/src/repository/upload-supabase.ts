import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

import { Repository } from "../../../common-resolvers/src";
import { UploadTargetHttp } from "../../../graphql-types/src/graphql-types.generated";

const client = createClient(
  process?.env?.SUPABASE_API_URL as string,
  process?.env?.SUPABASE_API_KEY as string
);
const bucket = "labelflow-images";
export const uploadsCacheName = "uploads";
export const uploadsRoute = "/api/uploads";

export const getUploadTargetHttp = async (
  key: string
): Promise<UploadTargetHttp> => {
  return {
    __typename: "UploadTargetHttp",
    uploadUrl: `${uploadsRoute}/${key}`,
    downloadUrl: `${process?.env?.SUPABASE_API_URL}/storage/v1/object/public/${bucket}/${key}`,
  };
};

export const getFromStorage: Repository["upload"]["get"] = async (url) => {
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
  return fetchResult.arrayBuffer();
};

export const putInStorage: Repository["upload"]["put"] = async (url, blob) => {
  const query = `${bucket}/`;
  await client.storage
    .from(bucket)
    .upload(url.substring(url.lastIndexOf(query) + query.length), blob, {
      contentType: blob.type,
      upsert: false,
      cacheControl: "public, max-age=31536000, immutable",
    });
};

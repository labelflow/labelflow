import { createClient } from "@supabase/supabase-js";
import "isomorphic-fetch";
import memoizeOne from "memoize-one";
import FormData from "form-data";

import { Stream } from "stream";
import { Repository } from "../../../common-resolvers/src";
import { UploadTargetHttp } from "../../../graphql-types/src/graphql-types.generated";

const getClient = memoizeOne(() =>
  createClient(
    process?.env?.SUPABASE_API_URL as string,
    process?.env?.SUPABASE_API_KEY as string
  )
);
const bucket = "labelflow-images";
export const uploadsRoute = "/api/uploads";

export const getUploadTargetHttp = async (
  key: string,
  origin: string
): Promise<UploadTargetHttp> => {
  return {
    __typename: "UploadTargetHttp",
    uploadUrl: `${origin}${uploadsRoute}/${key}`,
    downloadUrl: `${origin}${uploadsRoute}/${key}`,
  };
};

export const getFromStorage: Repository["upload"]["get"] = async (url, req) => {
  const headers = new Headers();
  headers.set("Accept", "image/tiff,image/jpeg,image/png,image/*,*/*;q=0.8");
  headers.set("Sec-Fetch-Dest", "image");
  if ((req?.headers as any)?.cookie) {
    headers.set("Cookie", (req?.headers as any)?.cookie);
  }

  const fetchResult = await fetch(url, {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (fetchResult.status !== 200) {
    throw new Error(
      `Getting from Supabase storage, could not fetch image at url ${url} properly, code ${fetchResult.status}`
    );
  }
  return await fetchResult.arrayBuffer();
};

export const deleteFromStorage: Repository["upload"]["delete"] = async (
  url
) => {
  console.warn(`
  deleteFromStorage called on supabase uploader with url ${url}.
  Won't make anything
  `);
};

export const putInStorage: Repository["upload"]["put"] = async (
  url,
  blob,
  req
) => {
  const headers = new Headers();
  if ((req?.headers as any)?.cookie) {
    headers.set("Cookie", (req?.headers as any)?.cookie);
  }
  const form = new FormData();
  const readStream = new Stream.Readable();
  readStream.push(blob);
  readStream.push(null);
  form.append("image", readStream);
  const fetchResult = await fetch(url, {
    method: "PUT",
    headers,
    credentials: "include",
    body: form,
  });

  if (fetchResult.status !== 200) {
    throw new Error(
      `Putting to Supabase storage, could not put at url ${url} properly, code ${fetchResult.status}`
    );
  }
};

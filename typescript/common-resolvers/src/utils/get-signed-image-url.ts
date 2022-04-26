import { Context } from "../types";
import { getOrigin } from "./get-origin";

export const getSignedImageUrl = async (
  imageUrl: string,
  { req, repository }: Context
) => {
  const origin = getOrigin(req);
  const urlPrefix = `${origin}/api/downloads/`;
  if (!imageUrl.startsWith(urlPrefix)) return imageUrl;
  const key = imageUrl.substring(urlPrefix.length);
  const isKey = /^[^/]+\/[^/]+\/[^/]+$/.test(key);
  if (!isKey) return imageUrl;
  return await repository.upload.getSignedDownloadUrl(key, 7 * 24 * 60 * 60);
};

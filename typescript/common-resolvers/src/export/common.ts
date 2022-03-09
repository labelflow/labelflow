import { Context, DbImage } from "../types";
import { getOrigin } from "../utils/get-origin";

export const getImageName = (image: DbImage, useId: boolean) =>
  useId ? `${image.name}_${image.id}` : image.name;

export const getImageSignedUrl = async (
  imageUrl: string,
  { req, repository }: Context
) => {
  const origin = getOrigin(req);
  const urlPrefix = `${origin}/api/downloads/`;
  if (!imageUrl.startsWith(urlPrefix)) return imageUrl;
  const key = imageUrl.substring(urlPrefix.length);
  const isKey = /^[^/]+\/[^/]+\/[^/]+$/.test(key);
  if (!isKey) return imageUrl;
  // Expires in 7 days
  return await repository.upload.getSignedDownloadUrl(key, 7 * 24 * 60 * 60);
};

import { WEBSITE_IMAGES_BUCKET_URL } from "./constants";

/**
 * Returns the URL of the static file hosted on our public images bucket
 * @param fileName - Name of the file on the public images bucket
 * @returns URL of the image
 */
export const getImageUrl = (fileName: string): string =>
  `${WEBSITE_IMAGES_BUCKET_URL}${fileName}`;

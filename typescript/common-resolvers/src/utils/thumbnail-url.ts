export type ImageUrlInfo = {
  size: number;
  extension: string;
  url: string;
};

export const getThumbnailUrlFromImageUrl = ({
  size,
  extension = "jpeg",
  url,
}: ImageUrlInfo): string => {
  const urlLastSlash = url.lastIndexOf("/");
  const urlPrefix = url.substring(0, urlLastSlash + 1);
  const urlSuffix = url.substring(urlLastSlash + 1);
  const urlSuffixWithExension = urlSuffix.endsWith(`.${extension}`)
    ? urlSuffix
    : `${urlSuffix}.${extension}`;
  return `${urlPrefix}thumbnails/${size}/${urlSuffixWithExension}`;
};

const urlRegex =
  /^(?<urlPrefix>.*\/)?thumbnails\/(?<size>[0-9]+)\/(?<urlSuffix>[^/]+)\.(?<extension>[\w.]+)$/;

export const getImageUrlFromThumbnailUrl = (
  url: string
): ImageUrlInfo | null => {
  const result: any | null = url.match(urlRegex)?.groups;
  if (!result) return null;
  return {
    ...result,
    size: parseInt(result.size as string, 10),
    url: `${result.urlPrefix ?? ""}${result.urlSuffix}`,
  };
};

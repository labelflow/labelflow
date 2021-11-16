export const getThumbnailUrlFromImageUrl = ({
  size,
  extension = "jpeg",
  url,
}: {
  size: number;
  extension: string;
  url: string;
}) => {
  const urlLastSlash = url.lastIndexOf("/");
  const urlPrefix = url.substring(0, urlLastSlash + 1);
  const urlSuffix = url.substring(urlLastSlash + 1);

  const thumbnailUrl = `${urlPrefix}thumbnails/${size}/${urlSuffix}.${extension}`;
  return thumbnailUrl;
};

const urlRegex =
  /^(?<urlPrefix>.*\/)?thumbnails\/(?<size>[0-9]+)\/(?<urlSuffix>[^/]+)\.(?<extension>[\w.]+)$/;

export const getImageUrlFromThumbnailUrl = (
  url: string
): {
  size: number;
  extension: string;
  url: string;
} | null => {
  const result: any | null = url.match(urlRegex)?.groups;

  if (!result) {
    return null;
  }

  return {
    size: parseInt(result.size as string, 10),
    extension: result.extension,
    url: `${result.urlPrefix ?? ""}${result.urlSuffix}`,
  };
};

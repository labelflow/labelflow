import type { Repository, ThumbnailSizes } from "@labelflow/common-resolvers";
import {
  getThumbnailUrlFromImageUrl,
  ImageUrlInfo,
} from "@labelflow/common-resolvers/src/utils/thumbnail-url";
import Blob from "fetch-blob";
import Jimp from "jimp/es";
import { isEmpty, isNil } from "lodash/fp";
import { AsyncReturnType } from "type-fest";

globalThis.Blob = Blob;

type ProcessImageResolver = Repository["imageProcessing"]["processImage"];
type ProcessImageInput = Parameters<ProcessImageResolver>[0];
type PutImageCallback = Parameters<ProcessImageResolver>[2];
type ProcessImageResult = AsyncReturnType<ProcessImageResolver>;

const DEFAULT_MAX_IMAGE_SIZE_PX: number = 60e6;
const MAX_IMAGE_SIZES_PX: { [mimetype: string]: number } = {
  "image/jpeg": 100e6,
  "image/png": 60e6,
};

type ImageSize = {
  width: number;
  height: number;
  mimetype: string;
};

const validateImageSize = ({
  width,
  height,
  mimetype,
}: ImageSize): ImageSize => {
  const imageSize = width * height;
  const maxImageSize =
    MAX_IMAGE_SIZES_PX?.[mimetype] ?? DEFAULT_MAX_IMAGE_SIZE_PX;
  if (imageSize > maxImageSize) {
    throw new Error(`
    Image is too big! Dimensions are ${width} x ${height} = ${Math.round(
      imageSize * 1e-6
    )}Mpx while limit is ${Math.round(maxImageSize * 1e-6)}Mpx
    `);
  }
  return { width, height, mimetype };
};

type GenerateThumbnailOptions = {
  image: Jimp;
  url: string;
  size: ThumbnailSizes;
  putThumbnail: PutImageCallback;
};

/**
 * Generate a thumbnail of a given size from an image & upload it.
 * This function doesn't update the image in the database to store the thumbnail url.
 */
const generateThumbnail = async ({
  image,
  url,
  size,
  putThumbnail,
}: GenerateThumbnailOptions): Promise<[string, Jimp | undefined]> => {
  try {
    const urlInfo: ImageUrlInfo = { url, size, extension: "jpeg" };
    const thumbnailUrl = getThumbnailUrlFromImageUrl(urlInfo);
    const jimpThumbnail = image
      .clone()
      .scaleToFit(size, size, Jimp.RESIZE_BILINEAR);
    const buffer = await jimpThumbnail.getBufferAsync("image/jpeg");
    const blob = new Blob([buffer], { type: "image/jpeg" });
    await putThumbnail(thumbnailUrl, blob);
    return [thumbnailUrl, jimpThumbnail];
  } catch (e) {
    console.error(e);
    return [url, undefined];
  }
};

type GenerateThumbnailFromSizeOptions = {
  thumbnailUrl?: string;
} & Pick<GenerateThumbnailOptions, "url" | "image" | "putThumbnail" | "size">;

const generateThumbnailFromSize = async ({
  thumbnailUrl,
  ...options
}: GenerateThumbnailFromSizeOptions): Promise<string> => {
  if (!isNil(thumbnailUrl) && !isEmpty(thumbnailUrl)) return thumbnailUrl;
  const [result] = await generateThumbnail(options);
  return result;
};

type ThumbnailsKeys =
  | "thumbnail20Url"
  | "thumbnail50Url"
  | "thumbnail100Url"
  | "thumbnail200Url"
  | "thumbnail500Url";

type GenerateThumbnailsOptions = Pick<
  GenerateThumbnailOptions,
  "image" | "url" | "putThumbnail"
> &
  Pick<ProcessImageInput, ThumbnailsKeys>;

type GenerateThumbnailsResult = Pick<ProcessImageResult, ThumbnailsKeys>;

const generateThumbnails = async ({
  image,
  url,
  thumbnail20Url,
  thumbnail50Url,
  thumbnail100Url,
  thumbnail200Url,
  thumbnail500Url,
  putThumbnail,
}: GenerateThumbnailsOptions): Promise<GenerateThumbnailsResult> => {
  // Generate a first lower-res thumbnail so that the next ones will be faster
  // to downscale
  const [thumbnail500UrlNew, imageSrc] = thumbnail500Url
    ? [thumbnail500Url, image]
    : await generateThumbnail({ size: 500, image, url, putThumbnail });
  const thumbnailsToGen: { url?: string | null; size: ThumbnailSizes }[] = [
    { url: thumbnail20Url, size: 20 },
    { url: thumbnail50Url, size: 50 },
    { url: thumbnail100Url, size: 100 },
    { url: thumbnail200Url, size: 200 },
    { url: thumbnail500UrlNew, size: 500 },
  ];
  const generatedThumbnailUrls = await Promise.all(
    thumbnailsToGen.map((options) =>
      generateThumbnailFromSize({
        thumbnailUrl: options.url ?? undefined,
        size: options.size,
        image: imageSrc ?? image,
        putThumbnail,
        url,
      })
    )
  );
  return {
    thumbnail20Url: generatedThumbnailUrls[0],
    thumbnail50Url: generatedThumbnailUrls[1],
    thumbnail100Url: generatedThumbnailUrls[2],
    thumbnail200Url: generatedThumbnailUrls[3],
    thumbnail500Url: generatedThumbnailUrls[4],
  };
};

const shouldNotLoadImage = ({
  url,
  width,
  height,
  mimetype,
  thumbnail20Url,
  thumbnail50Url,
  thumbnail100Url,
  thumbnail200Url,
  thumbnail500Url,
}: Parameters<Repository["imageProcessing"]["processImage"]>[0]): boolean =>
  [width, height, mimetype, url].every((value) => !isEmpty(value)) &&
  [
    thumbnail20Url,
    thumbnail50Url,
    thumbnail100Url,
    thumbnail200Url,
    thumbnail500Url,
  ].some((value) => !isEmpty(value));
/**
 * Given a partial image, return a completed version of the image, probing it if necessary
 */
export const processImage: Repository["imageProcessing"]["processImage"] =
  async (input, getImage, putThumbnail) => {
    if (shouldNotLoadImage(input)) {
      return input as AsyncReturnType<
        Repository["imageProcessing"]["processImage"]
      >;
    }
    const { width, height, mimetype, url } = input;
    const buffer = await getImage(url);
    const image = await Jimp.read(buffer as Buffer);
    const thumbnails = await generateThumbnails({
      ...input,
      image,
      putThumbnail,
    });
    const size = validateImageSize({
      width: width ?? image.bitmap.width,
      height: height ?? image.bitmap.height,
      mimetype: mimetype ?? image.getMIME(),
    });
    return { ...size, ...thumbnails };
  };

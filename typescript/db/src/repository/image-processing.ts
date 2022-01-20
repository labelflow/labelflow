import Blob from "fetch-blob";

import { getThumbnailUrlFromImageUrl } from "@labelflow/common-resolvers/src/utils/thumbnail-url";
import Jimp from "jimp/es";
import type { Repository, ThumbnailSizes } from "@labelflow/common-resolvers";

globalThis.Blob = Blob;

const defaultMaxImageSizePixel: number = 60e6;
const maxImageSizePixel: { [mimetype: string]: number } = {
  "image/jpeg": 100e6,
  "image/png": 60e6,
};

const validateImageSize = ({
  width,
  height,
  mimetype,
}: {
  width: number;
  height: number;
  mimetype: string;
}): {
  width: number;
  height: number;
  mimetype: string;
} => {
  const imageSize = width * height;
  const maxImageSize: number =
    maxImageSizePixel?.[mimetype] ?? defaultMaxImageSizePixel;
  if (imageSize > maxImageSize) {
    throw new Error(`
    Image is too big! Dimensions are ${width} x ${height} = ${Math.round(
      imageSize * 1e-6
    )}Mpx while limit is ${Math.round(maxImageSize * 1e-6)}Mpx
    `);
  }
  return {
    width,
    height,
    mimetype,
  };
};

/**
 * Generate a thumbnail of a given size from an image & upload it.
 * This function doesn't update the image in the database to store the thumbnail url.
 */
const generateThumbnail = async ({
  image,
  url,
  size,
  putImage,
}: {
  image: Jimp;
  url: string;
  size: ThumbnailSizes;
  putImage: (url: string, blob: Blob) => Promise<void>;
}): Promise<{ url: string; image?: Jimp }> => {
  try {
    const thumbnailUrl = getThumbnailUrlFromImageUrl({
      url,
      size,
      extension: "jpeg",
    });
    const jimpThumbnail = image
      .clone()
      .scaleToFit(size, size, Jimp.RESIZE_BILINEAR);
    const vipsThumbnail = await jimpThumbnail.getBufferAsync("image/jpeg");

    await putImage(
      thumbnailUrl,
      new Blob([vipsThumbnail], { type: "image/jpeg" })
    );
    return {
      url: thumbnailUrl,
      image: jimpThumbnail,
    };
  } catch (e) {
    console.error(e);
    return { url };
  }
};

/**
 * Given a partial image, return a completed version of the image, probing it if necessary
 */
export const processImage: Repository["imageProcessing"]["processImage"] =
  async (
    {
      width,
      height,
      mimetype,
      url,
      thumbnail20Url,
      thumbnail50Url,
      thumbnail100Url,
      thumbnail200Url,
      thumbnail500Url,
    },
    getImage,
    putImage
  ) => {
    const buffer = await getImage(url);
    const image = await Jimp.read(buffer as Buffer);

    const { url: thumbnail500UrlNew, image: imageSrc } = thumbnail500Url
      ? { url: thumbnail500Url, image }
      : ((await generateThumbnail({ size: 500, image, url, putImage })) as {
          url: string;
          image: Jimp;
        });

    const generateThumbnailFromSize = async (
      thumbUrl: string | null | undefined,
      size: ThumbnailSizes
    ) =>
      thumbUrl ??
      (
        await generateThumbnail({
          size,
          image: imageSrc,
          url,
          putImage,
        })
      ).url;

    const thumbnailsToGen: { url?: string | null; size: ThumbnailSizes }[] = [
      { url: thumbnail20Url, size: 20 },
      { url: thumbnail50Url, size: 50 },
      { url: thumbnail100Url, size: 100 },
      { url: thumbnail200Url, size: 200 },
      { url: thumbnail500UrlNew, size: 500 },
    ];

    const generatedThumbnailUrls = await Promise.all(
      thumbnailsToGen.map((thumbGenInfo) =>
        generateThumbnailFromSize(thumbGenInfo.url, thumbGenInfo.size)
      )
    );

    return {
      ...validateImageSize({
        width: width ?? image.bitmap.width,
        height: height ?? image.bitmap.height,
        mimetype: mimetype ?? image.getMIME(),
      }),
      thumbnail20Url: generatedThumbnailUrls[0],
      thumbnail50Url: generatedThumbnailUrls[1],
      thumbnail100Url: generatedThumbnailUrls[2],
      thumbnail200Url: generatedThumbnailUrls[3],
      thumbnail500Url: generatedThumbnailUrls[4],
    };
  };

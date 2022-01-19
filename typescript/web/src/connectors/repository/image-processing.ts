// It seems that this file is almost a copy past of `typescript/db/src/repository/image-processing.ts`
// We should either: merge/factorize the two files, or let them diverge and have a dedicated
// version for each repository.

import { getThumbnailUrlFromImageUrl } from "@labelflow/common-resolvers/src/utils/thumbnail-url";
import type { Repository, ThumbnailSizes } from "@labelflow/common-resolvers";

// The Jimp import need to like this, otherwise storybook does not work...
import Jimp from "jimp/browser/lib/jimp";

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
}): Promise<string> => {
  try {
    const thumbnailUrl = getThumbnailUrlFromImageUrl({
      url,
      size,
      extension: "jpeg",
    });
    const vipsThumbnail = await image
      .clone()
      .scaleToFit(size, size, Jimp.RESIZE_BILINEAR)
      .getBufferAsync("image/jpeg");

    await putImage(
      thumbnailUrl,
      new Blob([vipsThumbnail], { type: "image/jpeg" })
    );

    return thumbnailUrl;
  } catch (e) {
    console.error(e);
    return url;
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

    const generateThumbnailFromSize = (size: ThumbnailSizes) =>
      generateThumbnail({
        size,
        image,
        url,
        putImage,
      });

    const generatedThumbnailUrls = await Promise.all([
      thumbnail20Url ?? (await generateThumbnailFromSize(20)),
      thumbnail50Url ?? (await generateThumbnailFromSize(50)),
      thumbnail100Url ?? (await generateThumbnailFromSize(100)),
      thumbnail200Url ?? (await generateThumbnailFromSize(200)),
      thumbnail500Url ?? (await generateThumbnailFromSize(500)),
    ]);

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

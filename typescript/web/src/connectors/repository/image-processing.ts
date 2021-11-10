import { getThumbnailUrlFromImageUrl } from "@labelflow/common-resolvers/src/utils/thumbnail-url";

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
 * Given a partial image, return a completed version of the image, probing it if necessary
 */
export const processImage = async (
  {
    width,
    height,
    mimetype,
    url,
  }: {
    width: number | null | undefined;
    height: number | null | undefined;
    mimetype: string | null | undefined;
    url: string;
  },
  getImage: (url: string) => Promise<ArrayBuffer>,
  putImage: (url: string, blob: Blob) => Promise<void>
): Promise<{
  width: number;
  height: number;
  mimetype: string;
}> => {
  const buffer = await getImage(url);

  const image = await Jimp.read(buffer as Buffer);

  const result = {
    width: image.bitmap.width,
    height: image.bitmap.height,
    mimetype: image.getMIME(),
  };

  const vipsThumbnail20 = await image
    .clone()
    .scaleToFit(20, 20, Jimp.RESIZE_BEZIER)
    .getBufferAsync("image/jpeg");

  putImage(
    getThumbnailUrlFromImageUrl({ url, size: 20, extension: "jpeg" }),
    new Blob([vipsThumbnail20], { type: "image/jpeg" })
  );

  const vipsThumbnail50 = await image
    .clone()
    .scaleToFit(50, 50, Jimp.RESIZE_BEZIER)
    .getBufferAsync("image/jpeg");

  putImage(
    getThumbnailUrlFromImageUrl({ url, size: 50, extension: "jpeg" }),
    new Blob([vipsThumbnail50], { type: "image/jpeg" })
  );

  const vipsThumbnail100 = await image
    .clone()
    .scaleToFit(100, 100, Jimp.RESIZE_BEZIER)
    .getBufferAsync("image/jpeg");

  putImage(
    getThumbnailUrlFromImageUrl({ url, size: 100, extension: "jpeg" }),
    new Blob([vipsThumbnail100], { type: "image/jpeg" })
  );

  const vipsThumbnail200 = await image
    .clone()
    .scaleToFit(200, 200, Jimp.RESIZE_BEZIER)
    .getBufferAsync("image/jpeg");

  putImage(
    getThumbnailUrlFromImageUrl({ url, size: 200, extension: "jpeg" }),
    new Blob([vipsThumbnail200], { type: "image/jpeg" })
  );

  const vipsThumbnail500 = await image
    .clone()
    .scaleToFit(500, 500, Jimp.RESIZE_BEZIER)
    .getBufferAsync("image/jpeg");

  putImage(
    getThumbnailUrlFromImageUrl({ url, size: 500, extension: "jpeg" }),
    new Blob([vipsThumbnail500], { type: "image/jpeg" })
  );

  return validateImageSize({
    width: width ?? result.width,
    height: height ?? result.height,
    mimetype: mimetype ?? result.mimetype,
  });
};

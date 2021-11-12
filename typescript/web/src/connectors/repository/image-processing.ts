import { getThumbnailUrlFromImageUrl } from "@labelflow/common-resolvers/src/utils/thumbnail-url";
import type { Repository } from "@labelflow/common-resolvers";

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
 * Generate a thumbnail of a given size from an image, upload it, and update the image in the db, with the new thumbnail url
 */
const generateThumbnail = async ({
  id,
  image,
  url,
  size,
  putImage,
  updateImage,
  user,
}: {
  id: string;
  image: Jimp;
  url: string;
  size: 20 | 50 | 100 | 200 | 500;
  putImage: (url: string, blob: Blob) => Promise<void>;
  updateImage: (
    input: { id: string },
    data: {},
    user?: { id: string }
  ) => Promise<boolean>;
  user?: { id: string };
}) => {
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
    await updateImage({ id }, { [`thumbnail${size}Url`]: thumbnailUrl }, user);
    return true;
  } catch (e) {
    return false;
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
      id,
      thumbnail20Url,
      thumbnail50Url,
      thumbnail100Url,
      thumbnail200Url,
      thumbnail500Url,
    },
    getImage,
    putImage,
    updateImage,
    user
  ) => {
    const buffer = await getImage(url);

    const image = await Jimp.read(buffer as Buffer);

    const result = {
      width: image.bitmap.width,
      height: image.bitmap.height,
      mimetype: image.getMIME(),
    };

    const thumbnailGenerationInput = {
      id,
      image,
      url,
      putImage,
      updateImage,
      user,
    };

    if (!thumbnail20Url) {
      generateThumbnail({
        size: 20,
        ...thumbnailGenerationInput,
      });
    }

    if (!thumbnail50Url) {
      generateThumbnail({
        size: 50,
        ...thumbnailGenerationInput,
      });
    }

    if (!thumbnail100Url) {
      generateThumbnail({
        size: 100,
        ...thumbnailGenerationInput,
      });
    }

    if (!thumbnail200Url) {
      generateThumbnail({
        size: 200,
        ...thumbnailGenerationInput,
      });
    }

    if (!thumbnail500Url) {
      generateThumbnail({
        size: 500,
        ...thumbnailGenerationInput,
      });
    }

    return {
      thumbnail20Url,
      thumbnail50Url,
      thumbnail100Url,
      thumbnail200Url,
      thumbnail500Url,
      ...validateImageSize({
        width: width ?? result.width,
        height: height ?? result.height,
        mimetype: mimetype ?? result.mimetype,
      }),
    };
  };

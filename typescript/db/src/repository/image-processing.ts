// ES6 module
// @ts-ignore
import Vips from "wasm-vips";

const vipsPromise = Vips();

const defaultMaxImageSizePixel: number = 60e6;
const maxImageSizePixel: { [mimetype: string]: number } = {
  "image/jpeg": 100e6,
  "image/png": 60e6,
};

// Map from Vips loaders to MIME types
// Done manually and verified by me
// See https://www.rubydoc.info/gems/ruby-vips/Vips/Image for the list of all image.xxload() methods
// See https://www.iana.org/assignments/media-types/media-types.xhtml for list of all mime types
const vipsFormats: { [key: string]: string } = {
  analyzeload: "image/analyze", // Not sure
  csvload: "text/csv",
  fitsload: "image/fits",
  gifload: "image/gif",
  heifload: "image/heif",
  jp2kload: "image/jp2",
  jpegload: "image/jpeg",
  jxlload: "image/jxl",
  magickload: "image/bmp", // Not sure, but vips use magick to load bmp See https://www.libvips.org/API/8.6/VipsForeignSave.html
  matload: "application/x-matlab-data",
  matrixload: "image/matrix", // Not sure
  niftiload: "image/nifti", // Not sure
  openexrload: "image/x-exr", // See https://lists.gnu.org/archive/html/openexr-devel/2014-05/msg00014.html
  openslideload: "image/openslide", // Not sure
  pdfload: "application/pdf",
  pngload: "image/png",
  ppmload: "image/x-portable-anymap", // See https://fr.wikipedia.org/wiki/Portable_pixmap
  radload: "image/vnd.radiance",
  rawload: "image/raw", // Not sure, maybe not relevant
  svgload: "image/svg+xml",
  tiffload: "image/tiff",
  vipsload: "image/vips", // Not sure
  webpload: "image/webp",
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
  const vipsObject = await vipsPromise;
  // The type comes from typescript/db/src/@types/wasm-vips.d.ts
  const VipsImage: typeof vips.Image = vipsObject.Image as typeof vips.Image;

  const buffer = await getImage(url);

  try {
    const vipsImage = VipsImage.newFromBuffer(buffer);

    const vipsThumbnail20 = VipsImage.thumbnailBuffer(buffer, 20).writeToBuffer(
      ".jpg"
    );

    const vipsThumbnail50 = VipsImage.thumbnailBuffer(buffer, 50).writeToBuffer(
      ".jpg"
    );

    const vipsThumbnail100 = VipsImage.thumbnailBuffer(
      buffer,
      100
    ).writeToBuffer(".jpg");

    const vipsThumbnail200 = VipsImage.thumbnailBuffer(
      buffer,
      200
    ).writeToBuffer(".jpg");

    const vipsThumbnail500 = VipsImage.thumbnailBuffer(
      buffer,
      500
    ).writeToBuffer(".jpg");

    return validateImageSize({
      width: width ?? vipsImage.width,
      height: height ?? vipsImage.height,
      mimetype: mimetype ?? vipsFormats[vipsImage.getString("vips-loader")],
    });
  } catch (e) {
    throw new Error(
      `Could not probe the external image at url ${url} it may be damaged or corrupted.`
    );
  }
};

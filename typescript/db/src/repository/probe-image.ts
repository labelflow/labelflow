// ES6 module
import Vips from "wasm-vips";
import probe from "probe-image-size";

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
export const probeImage = async (
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
  getImage: (url: string) => Promise<ArrayBuffer>
): Promise<{
  width: number;
  height: number;
  mimetype: string;
}> => {
  const vips = await Vips();

  const mask = vips.Image.newFromArray(
    [
      [-1, -1, -1],
      [-1, 16, -1],
      [-1, -1, -1],
    ],
    8.0
  );

  // Finally, write the result to a buffer
  const outBuffer = mask.writeToBuffer(".jpg");

  console.log("outBuffer", outBuffer);

  if (width && height && mimetype) {
    return { width, height, mimetype };
  }

  const probeInput = new Uint8Array(await getImage(url));

  // TODO: It would be nice to import "probe-image-size" asynchronously to reduce initial bundle size of sw, but webpack config todo.
  // const probe = await import(/* webpackPrefetch: true */ "probe-image-size");
  const probeResult = probe.sync(probeInput as Buffer);

  if (probeResult == null) {
    throw new Error(
      `Could not probe the external image at url ${url} it may be damaged or corrupted.`
    );
  }

  return validateImageSize({
    width: width ?? probeResult.width,
    height: height ?? probeResult.height,
    mimetype: mimetype ?? probeResult.mime,
  });
};

import probe from "probe-image-size";

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

  return {
    width: width ?? probeResult.width,
    height: height ?? probeResult.height,
    mimetype: mimetype ?? probeResult.mime,
  };
};

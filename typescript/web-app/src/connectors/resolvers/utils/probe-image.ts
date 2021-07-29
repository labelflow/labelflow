import probe from "probe-image-size";
import { uploadsCacheName } from "../upload";

/**
 * Given a partial image, return a completed version of the image, probing it if necessary
 */
export const probeImage = async ({
  width,
  height,
  mimetype,
  url,
}: {
  width: number | null | undefined;
  height: number | null | undefined;
  mimetype: string | null | undefined;
  url: string;
}): Promise<{
  width: number;
  height: number;
  mimetype: string;
}> => {
  if (width && height && mimetype) {
    return { width, height, mimetype };
  }

  // TODO: It would be nice to import "probe-image-size" asynchronously to reduce initial bundle size of sw, but webpack config todo.
  // const probe = await import(/* webpackPrefetch: true */ "probe-image-size");

  const cacheResult = await (await caches.open(uploadsCacheName)).match(url);

  const fetchResult =
    cacheResult ??
    (await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: new Headers({
        Accept: "image/tiff,image/jpeg,image/png,image/*,*/*;q=0.8",
        "Sec-Fetch-Dest": "image",
      }),
      credentials: "omit",
    }));

  if (fetchResult.status !== 200) {
    throw new Error(
      `Could not fetch image at url ${url} properly, code ${fetchResult.status}`
    );
  }

  const probeInput = new Uint8Array(await fetchResult.arrayBuffer());

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

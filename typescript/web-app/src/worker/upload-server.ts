import { RouteHandlerObject, RouteHandlerCallbackOptions } from "workbox-core";

export class UploadServer implements RouteHandlerObject {
  private cacheName: string;

  constructor(options: { cacheName: string }) {
    const { cacheName } = options;
    this.cacheName = cacheName;
  }

  async handle({ request }: RouteHandlerCallbackOptions): Promise<Response> {
    const formData = await request.formData();
    const blob = formData.get("image") as Blob;

    if (!blob) {
      return new Response("", {
        status: 400,
        statusText:
          "Could not retrieve image blob from form data. It needs to be stored under the 'image' key",
      });
    }

    const responseOfGet = new Response(blob, {
      status: 200,
      statusText: "OK",
      headers: new Headers({
        "Content-Type":
          request.headers?.get?.("Content-Type") ??
          blob?.type ??
          "application/octet-stream",
        "Content-Length":
          request.headers?.get?.("Content-Length") ??
          blob?.size.toString() ??
          "0",
      }),
    });

    const cache = await caches.open(this.cacheName);
    await cache.put(request.url, responseOfGet);

    const response = new Response("", {
      status: 200,
      statusText: "OK",
    });

    return response;
  }
}

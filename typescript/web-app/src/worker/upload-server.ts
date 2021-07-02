import { RouteHandlerObject, RouteHandlerCallbackOptions } from "workbox-core";

export class UploadServer implements RouteHandlerObject {
  private cachePromise: Promise<Cache>;

  private cache?: Cache;

  constructor(options: { cacheName: string }) {
    const { cacheName } = options;
    this.cachePromise = caches.open(cacheName);
  }

  async handle({ request }: RouteHandlerCallbackOptions): Promise<Response> {
    console.log("Handling an upload");
    if (!this.cache) {
      this.cache = await this.cachePromise;
    }
    const requestOfGet = new Request({
      ...request,
      bodyUsed: false,
      body: null,
      method: "GET",
    });
    const responseOfGet = new Response((request as Request).body, {
      status: 200,
      statusText: "OK",
      headers: new Headers({
        "Content-Type":
          (request as Request).headers.get("Content-Type") ??
          "application/octet-stream",
      }),
    });
    this.cache.put(requestOfGet, responseOfGet);

    const response = new Response("", {
      status: 200,
      statusText: "OK",
      headers: new Headers(),
    });

    return response;
  }
}

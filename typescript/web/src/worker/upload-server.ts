import { RouteHandlerObject, RouteHandlerCallbackOptions } from "workbox-core";
import { captureException } from "@sentry/nextjs";

export class UploadServer implements RouteHandlerObject {
  private cacheName: string;

  constructor(options: { cacheName: string }) {
    const { cacheName } = options;
    this.cacheName = cacheName;
  }

  async handle({ request }: RouteHandlerCallbackOptions): Promise<Response> {
    try {
      const cache = await caches.open(this.cacheName);
      switch (request.method) {
        // Handles upload
        case "PUT": {
          const blob = await request.blob();

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
              "Content-Type": blob.type ?? "application/octet-stream",
              "Content-Length": blob.size.toString() ?? "0",
            }),
          });

          await cache.put(request.url, responseOfGet);
          break;
        }
        // Handles "unupload" when the given asset is deleted
        case "DELETE": {
          await cache.delete(request.url);
          break;
        }
        default:
          throw new Error(`Method ${request.method} not allowed`);
      }

      const response = new Response("", {
        status: 200,
        statusText: "OK",
      });

      return response;
    } catch (error) {
      captureException(error);
      throw error;
    }
  }
}

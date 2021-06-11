import { isString, trimCharsEnd } from "lodash/fp";
import { db } from "../connectors/database";

declare let self: ServiceWorkerGlobalScope;

export const server = {
  installListener: (path = "/api/worker/files") => {
    const trimmedPath = trimCharsEnd("/", path);
    const regex = new RegExp(`${trimmedPath}/(?<fileId>.*)`);

    self.addEventListener("fetch", (event: any) => {
      const { request } = event;

      if (request.method === "GET") {
        const url = new URL(request.url);
        const found = url.pathname.match(regex);
        if (!isString(found?.groups?.fileId)) {
          return;
        }
        const fileId = found?.groups?.fileId as string;
        const buildResponse = async () => {
          const file = await db.file.get(fileId);
          if (!file || !("blob" in file)) {
            throw new Error(`No file found for id ${fileId}`);
          }
          const { blob } = file;
          const response = new Response(blob, {
            status: 200,
            statusText: "OK",
            headers: new Headers(),
          });
          return response;
        };
        event.respondWith(buildResponse());
      }

      if (request.method === "PUT") {
        const url = new URL(request.url);
        const found = url.pathname.match(regex);
        if (!isString(found?.groups?.fileId)) {
          return;
        }
        const fileId = found?.groups?.fileId as string;
        const buildResponse = async () => {
          const blob = await request.blob();
          await db.file.add({ id: fileId, blob });
          const response = new Response("", {
            status: 200,
            statusText: "OK",
            headers: new Headers(),
          });
          return response;
        };
        event.respondWith(buildResponse());
      }
    });
  },
};

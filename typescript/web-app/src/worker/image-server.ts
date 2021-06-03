import { isString, trimCharsEnd } from "lodash/fp";

declare let self: ServiceWorkerGlobalScope;

export const server = {
  installListener: (path = "/worker/images") => {
    const trimedPath = trimCharsEnd("/", path);
    console.log(`image service worker activated on ${trimedPath}`);
    // const regex = new RegExp(`${trimedPath}/(?<id>.*)`);
    const regex = /\/worker\/images\/(?<id>.*)/;
    self.addEventListener("fetch", (event: any) => {
      const { request } = event;
      const url = new URL(request.url);

      console.log("Imaggege");
      console.log(url.pathname);
      const found = url.pathname.match(regex);

      if (!isString(found?.groups?.id)) {
        return;
      }

      const id = found?.groups?.id as string;

      console.log("Imaggege IDDD");
      console.log(id);

      const response = new Response(id, {
        status: 200,
        statusText: "ok",
      });

      event.respondWith(response);
    });
  },
};

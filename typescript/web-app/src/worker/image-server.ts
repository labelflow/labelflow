declare let self: ServiceWorkerGlobalScope;

export const server = {
  installListener: (path = "/worker/images") => {
    console.log(`image service worker activated on ${path}`);
    self.addEventListener("fetch", (event: any) => {
      const { request } = event;
      const url = new URL(request.url);

      // expected output: Array ["T", "I"]

      if (!url.pathname.startsWith(path)) {
        return;
      }

      console.log("image service worker answering random request");
      console.log(url.pathname);

      const regex = /(\/worker\/images\/)(.*)/g;
      const found = url.pathname.match(regex);

      console.log("found");
      console.log(found);

      console.log("It's a image request!");

      const response = new Response("Hi", {
        status: 200,
        statusText: "ok",
      });

      event.respondWith(response);
    });
  },
};

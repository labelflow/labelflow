// Custom service worker code
// See https://github.com/shadowwalker/next-pwa/blob/master/examples/custom-ts-worker/worker/index.ts
import { precacheAndRoute } from "workbox-precaching";

import { server as graphqlServer } from "./graphql-server";
import { server as fileServer } from "./file-server";

declare let self: ServiceWorkerGlobalScope;

self.addEventListener("message", (event) => {
  // HOW TO TEST THIS?
  // Run this in your browser console:
  //     window.navigator.serviceWorker.controller.postMessage({command: 'log', message: 'hello world'})
  // OR use next-pwa injected workbox object
  //     window.workbox.messageSW({command: 'log', message: 'hello world'})

  if (event?.data?.type === "SKIP_WAITING") {
    // Refresh service worker to next version
    self.skipWaiting();
    return;
  }

  console.warn("Received unsupported message from window:");
  console.warn(event?.data);
});

self.addEventListener("activate", (event) => {
  event?.waitUntil(self.clients.claim());
});

// Install the listener of the graphql server
graphqlServer.installListener("/api/worker/graphql");

// Install the listener of the file server
fileServer.installListener("/api/worker/files");

// Inject the manifest
// See https://github.com/GoogleChrome/workbox/issues/2519#issuecomment-634164566
// eslint-disable-next-line @typescript-eslint/no-use-before-define
// eslint-disable-next-line no-underscore-dangle
const manifest = self.__WB_MANIFEST;

precacheAndRoute(manifest);

// To disable all workbox logging during development, you can set self.__WB_DISABLE_DEV_LOGS to true
// https://developers.google.com/web/tools/workbox/guides/configure-workbox#disable_logging
//
// self.__WB_DISABLE_DEV_LOGS = true

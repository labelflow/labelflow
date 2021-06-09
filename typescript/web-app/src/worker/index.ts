// Custom service worker code
// See https://github.com/shadowwalker/next-pwa/blob/master/examples/custom-ts-worker/worker/index.ts
import { precacheAndRoute } from "workbox-precaching";

import { server as graphqlServer } from "./graphql-server";
import { server as imageServer } from "./image-server";

declare let self: ServiceWorkerGlobalScope;

// let resolveIsServerReadyPromise: (() => void) | undefined;
// const isServerReadyPromise = new Promise<void>((resolve) => {
//   resolveIsServerReadyPromise = resolve;
// });

let resolveIsWorkerActivePromise: (() => void) | undefined;
const isWorkerActivePromise = new Promise<void>((resolve) => {
  resolveIsWorkerActivePromise = resolve;
});

const notifyServerReadyWhenReady = async (event: ExtendableMessageEvent) => {
  await isWorkerActivePromise;

  (event.source as Client).postMessage({ type: "NOTIFY_SERVER_READY" });
};

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
  if (event?.data?.type === "CHECK_SERVER_READY") {
    // Tell client side that the server (GraphQL, file server) is ready
    notifyServerReadyWhenReady(event);
    return;
  }
  console.warn("Received unsupported message from window:");
  console.warn(event?.data);
});

self.addEventListener("push", (event) => {
  const data = JSON.parse(event?.data.text() || "{}");
  event?.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.message,
      icon: "/static/icon-192x192.png",
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event?.notification.close();
  event?.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        if (clientList.length > 0) {
          let client = clientList[0];
          for (let i = 0; i < clientList.length; i += 1) {
            if (clientList[i].focused) {
              client = clientList[i];
            }
          }
          return client.focus();
        }
        return self.clients.openWindow("/");
      })
  );
});

// self.addEventListener("install", (event) => {
//   // The promise that skipWaiting() returns can be safely ignored.
//   // self.skipWaiting();

//   // Perform any other actions required for your
//   // service worker to install, potentially inside

//   event?.waitUntil(isServerReadyPromise);
// });

self.addEventListener("activate", (event) => {
  // The promise that skipWaiting() returns can be safely ignored.
  // self.skipWaiting();
  // Perform any other actions required for your
  // service worker to install, potentially inside

  // self.clients.claim();
  event?.waitUntil(
    (async () => {
      await self.clients.claim();
      if (resolveIsWorkerActivePromise) {
        setTimeout(() => resolveIsWorkerActivePromise?.(), 1);
      } else {
        console.error(
          "Cannot resolve the resolveIsWorkerActivePromise in service worker, this should not happen"
        );
      }
    })()
  );
});

// Install the listener of the graphql server
graphqlServer.installListener("/api/worker/graphql");

// Install the listener of the image server
imageServer.installListener("/api/worker/files");

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

// // Notify that the servier
// if (resolveIsServerReadyPromise) {
//   setTimeout(() => resolveIsServerReadyPromise?.(), 1);
// } else {
//   console.error(
//     "Cannot resolve the resolveIsServerReadyPromise in service worker, this should not happen"
//   );
// }

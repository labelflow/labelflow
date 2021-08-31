// Custom service worker code. This can be customized
// See https://github.com/shadowwalker/next-pwa/blob/master/examples/offline-fallback/service-worker.js

import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import {
  NetworkOnly,
  CacheOnly,
  CacheFirst,
  StaleWhileRevalidate,
} from "workbox-strategies";
import { registerRoute, setCatchHandler } from "workbox-routing";
import { matchPrecache, cleanupOutdatedCaches } from "workbox-precaching";
// import { initialize as initializeGoogleAnalytics } from "workbox-google-analytics";

import { trimCharsEnd } from "lodash/fp";
import typeDefs from "../../../../data/__generated__/schema.graphql";
import { resolvers } from "../connectors/resolvers";
import {
  uploadsCacheName,
  uploadsRoute,
} from "../connectors/repository/upload";
import { ApolloServerServiceWorker } from "./apollo-server-service-worker";
import { UploadServer } from "./upload-server";
import { repository } from "../connectors/repository";

declare let self: ServiceWorkerGlobalScope;

// To disable all workbox logging during development, you can set self.__WB_DISABLE_DEV_LOGS to true
// https://developers.google.com/web/tools/workbox/guides/configure-workbox#disable_logging
// eslint-disable-next-line no-underscore-dangle
self.__WB_DISABLE_DEV_LOGS = true;

self.addEventListener("message", (event) => {
  // TO TEST THIS? Run this in your browser console:
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

clientsClaim();

// See https://github.com/GoogleChrome/workbox/issues/2519#issuecomment-634164566
// eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-unused-expressions
self.__WB_MANIFEST;

// // Initialize workbox Google analytics. For some reason this is broken right now, so we commented it.
// initializeGoogleAnalytics();

cleanupOutdatedCaches();

// Routes
// See https://github.com/shadowwalker/next-pwa/issues/38

registerRoute(
  "/api/worker/graphql",
  new ApolloServerServiceWorker({
    typeDefs,
    resolvers,
    context: ({ req, res }) => {
      return { req, res, repository };
    },
    introspection: true,
  }),
  "POST"
);

const trimmedUploadsRoute = trimCharsEnd("/", uploadsRoute);
const uploadsRouteRegex = new RegExp(`${trimmedUploadsRoute}/(?<fileId>.*)`);
const uploadServer = new UploadServer({ cacheName: uploadsCacheName });

registerRoute(uploadsRouteRegex, uploadServer, "PUT");
registerRoute(uploadsRouteRegex, uploadServer, "DELETE");
registerRoute(
  uploadsRouteRegex,
  new CacheOnly({
    cacheName: uploadsCacheName,
  }),
  "GET"
);

registerRoute(/\/_next\/webpack-hmr\/.*$/i, new NetworkOnly({}), "GET");

registerRoute(
  /\/_next\/static\/webpack\/.*\.hot-update\..*$/i,
  new NetworkOnly({}),
  "GET"
);

registerRoute(
  /\/_next\/static\/.*$/i,
  new StaleWhileRevalidate({
    cacheName: "next-js-artifacts",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10000,
        maxAgeSeconds: 86400 * 7,
        purgeOnQuotaError: true,
      }),
    ],
  }),
  "GET"
);
registerRoute(
  /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
  new CacheFirst({
    cacheName: "google-fonts",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 86400 * 365,
        purgeOnQuotaError: true,
      }),
    ],
  }),
  "GET"
);

registerRoute(
  /\/static\/.*$/i,
  new StaleWhileRevalidate({
    cacheName: "static-assets",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 1000,
        maxAgeSeconds: 86400 * 7,
        purgeOnQuotaError: true,
      }),
    ],
  }),
  "GET"
);

// Following lines gives you control of the offline fallback strategies
// See https://developers.google.com/web/tools/workbox/guides/advanced-recipes#comprehensive_fallbacks
// // Use a stale-while-revalidate strategy for all other requests.
// setDefaultHandler(new StaleWhileRevalidate({}));
// See https://github.com/shadowwalker/next-pwa/blob/master/examples/offline-fallback/service-worker.js
setCatchHandler(async ({ event }) => {
  switch (event.request.destination) {
    case "document":
      // If using precached URLs:
      return (await matchPrecache("/_fallback")) ?? Response.error();
    default:
      // If we don't have a fallback, just return an error response.
      return Response.error();
  }
});

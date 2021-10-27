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
import {
  matchPrecache,
  precacheAndRoute,
  cleanupOutdatedCaches,
} from "workbox-precaching";
import { gql } from "apollo-server-core";
// import { initialize as initializeGoogleAnalytics } from "workbox-google-analytics";

import { trimCharsEnd } from "lodash/fp";
import * as Sentry from "@sentry/browser";

import { resolvers } from "../connectors/resolvers";
import {
  uploadsCacheName,
  uploadsRoute,
} from "../connectors/repository/upload";
import { ApolloServerServiceWorker } from "./apollo-server-service-worker";
import { UploadServer } from "./upload-server";
import { repository } from "../connectors/repository";

// Configure and initialize Sentry in the service worker
const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
Sentry.init({
  dsn: SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? "development",
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  //  that it will also get attached to your source maps
});

declare let self: ServiceWorkerGlobalScope;

// To disable all workbox logging during development, you can set self.__WB_DISABLE_DEV_LOGS to true
// https://developers.google.com/web/tools/workbox/guides/configure-workbox#disable_logging
// eslint-disable-next-line no-underscore-dangle
self.__WB_DISABLE_DEV_LOGS = true;

// Declare expiration plugins for caches
const nextJsArtifactsExpirationPlugin = new ExpirationPlugin({
  maxEntries: 10000,
  maxAgeSeconds: 86400 * 7,
  purgeOnQuotaError: true,
});
const googleFontsExpirationPlugin = new ExpirationPlugin({
  maxEntries: 10,
  maxAgeSeconds: 86400 * 365,
  purgeOnQuotaError: true,
});
const staticAssetsExpirationPlugin = new ExpirationPlugin({
  maxEntries: 1000,
  maxAgeSeconds: 86400 * 7,
  purgeOnQuotaError: true,
});

self.addEventListener("message", (event) => {
  // TO TEST THIS? Run this in your browser console:
  //     window.navigator.serviceWorker.controller.postMessage({command: 'log', message: 'hello world'})
  // OR use next-pwa injected workbox object
  //     window.workbox.messageSW({command: 'log', message: 'hello world'})

  if (event?.data?.type === "SKIP_WAITING") {
    console.log("[Service Worker] Skip waiting");
    // Refresh service worker to next version
    self.skipWaiting();
    return;
  }

  // TODO Send this message from client side when user wants to load app to work online
  if (event?.data?.type === "PRECACHE_ALL") {
    // Inject the manifest
    // See https://github.com/GoogleChrome/workbox/issues/2519#issuecomment-634164566
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    // eslint-disable-next-line no-underscore-dangle
    const WB_MANIFEST = self.__WB_MANIFEST;
    precacheAndRoute(WB_MANIFEST);
    // @ts-ignore
    self.WB_MANIFEST = WB_MANIFEST;
    return;
  }

  console.warn(
    "[Service Worker] Received unsupported message from window:",
    event?.data
  );
});

// Clear service worker cache when it becomes active
self.addEventListener("activate", (event) => {
  if (event == null) {
    nextJsArtifactsExpirationPlugin.deleteCacheAndMetadata();
    googleFontsExpirationPlugin.deleteCacheAndMetadata();
    staticAssetsExpirationPlugin.deleteCacheAndMetadata();
    return;
  }
  event.waitUntil(
    Promise.all([
      nextJsArtifactsExpirationPlugin.deleteCacheAndMetadata(),
      googleFontsExpirationPlugin.deleteCacheAndMetadata(),
      staticAssetsExpirationPlugin.deleteCacheAndMetadata(),
    ])
  );
});

clientsClaim();

// // Initialize workbox Google analytics. For some reason this is broken right now, so we commented it.
// initializeGoogleAnalytics();

cleanupOutdatedCaches();

// Routes
// See https://github.com/shadowwalker/next-pwa/issues/38

registerRoute(
  "/api/worker/graphql",
  new ApolloServerServiceWorker({
    typeDefs: gql`
      scalar ColorHex

      type Dataset {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        name: String!
        slug: String!
        images(first: Int, skip: Int): [Image!]!
        labels: [Label!]!
        labelClasses: [LabelClass!]!
        imagesAggregates: ImagesAggregates!
        labelsAggregates: LabelsAggregates!
        labelClassesAggregates: LabelClassesAggregates!
        workspace: Workspace!
      }

      input DatasetCreateInput {
        id: ID
        name: String!
        workspaceSlug: String!
      }

      input DatasetImportInput {
        url: String!
        format: ExportFormat!
        options: ImportOptions
      }

      input DatasetUpdateInput {
        name: String!
      }

      input DatasetWhereInput {
        workspaceSlug: String!
      }

      input DatasetWhereUniqueInput {
        id: ID
        slugs: WorkspaceSlugAndDatasetSlug
      }

      scalar DateTime

      type Example {
        id: ID
        createdAt: DateTime
        updatedAt: DateTime
        name: String
      }

      input ExampleCreateInput {
        name: String!
        id: ID
      }

      enum ExampleOrderByInput {
        id_ASC
        id_DESC
      }

      input ExampleWhereInput {
        id: ID
      }

      input ExampleWhereUniqueInput {
        id: ID!
      }

      enum ExportFormat {
        YOLO
        COCO
      }

      input ExportOptions {
        coco: ExportOptionsCoco
        yolo: ExportOptionsYolo
      }

      input ExportOptionsCoco {
        name: String
        exportImages: Boolean
        avoidImageNameCollisions: Boolean
      }

      input ExportOptionsYolo {
        name: String
        exportImages: Boolean
        includePolygons: Boolean
        avoidImageNameCollisions: Boolean
      }

      input ExportWhereUniqueInput {
        datasetId: ID!
      }

      type Geometry {
        type: String!
        coordinates: JSON!
      }

      input GeometryInput {
        type: String!
        coordinates: JSON!
      }

      type Image {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        url: String!
        externalUrl: String
        name: String!
        path: String!
        mimetype: String!
        height: Int!
        width: Int!
        labels: [Label!]!
        dataset: Dataset!
      }

      input ImageCreateInput {
        id: ID
        datasetId: ID!
        createdAt: DateTime
        name: String
        path: String
        mimetype: String
        height: Int
        width: Int
        file: Upload
        url: String
        externalUrl: String
      }

      input ImageWhereInput {
        datasetId: ID
      }

      input ImageWhereUniqueInput {
        id: ID!
      }

      type ImagesAggregates {
        totalCount: Int!
      }

      input ImportOptions {
        coco: ImportOptionsCoco
      }

      input ImportOptionsCoco {
        annotationsOnly: Boolean
      }

      type ImportStatus {
        error: String
      }

      enum InvitationStatus {
        Sent
        UserAlreadyIn
        Error
      }

      input InviteMemberInput {
        email: String!
        role: MembershipRole!
        workspaceSlug: String!
      }

      type IogInferenceResult {
        polygons: [[[Float!]]]!
      }

      scalar JSON

      type Label {
        id: ID!
        type: LabelType!
        createdAt: DateTime!
        updatedAt: DateTime!
        imageId: ID!
        geometry: Geometry!
        labelClass: LabelClass
        x: Float!
        y: Float!
        height: Float!
        width: Float!
      }

      type LabelClass {
        id: ID!
        index: Int!
        createdAt: DateTime!
        updatedAt: DateTime!
        name: String!
        color: ColorHex!
        labels: [Label!]!
        dataset: Dataset!
      }

      input LabelClassCreateInput {
        id: ID
        name: String!
        color: ColorHex
        datasetId: ID!
      }

      input LabelClassReorderInput {
        index: Int!
      }

      input LabelClassUpdateInput {
        name: String
        color: ColorHex
      }

      input LabelClassWhereInput {
        datasetId: ID
      }

      input LabelClassWhereUniqueInput {
        id: ID!
      }

      type LabelClassesAggregates {
        totalCount: Int!
      }

      input LabelCreateInput {
        id: ID
        type: LabelType
        imageId: ID!
        labelClassId: ID
        geometry: GeometryInput!
      }

      enum LabelType {
        Classification
        Polygon
        Box
      }

      input LabelUpdateInput {
        labelClassId: ID
        geometry: GeometryInput
      }

      input LabelWhereInput {
        imageId: ID
        labelClassId: ID
        datasetId: ID
      }

      input LabelWhereUniqueInput {
        id: ID!
      }

      type LabelsAggregates {
        totalCount: Int!
      }

      type Membership {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        role: MembershipRole!
        user: User
        workspace: Workspace!
        invitationEmailSentTo: String
        invitationToken: ID
      }

      input MembershipCreateInput {
        id: ID
        role: MembershipRole!
        userId: ID
        workspaceSlug: String!
      }

      enum MembershipRole {
        Owner
        Admin
        Member
      }

      input MembershipUpdateInput {
        role: MembershipRole
      }

      input MembershipWhereInput {
        workspaceSlug: String
      }

      input MembershipWhereUniqueInput {
        id: ID!
      }

      type Mutation {
        createExample(data: ExampleCreateInput!): Example
        getUploadTarget(data: UploadTargetInput!): UploadTarget!
        createImage(data: ImageCreateInput!): Image
        deleteImage(where: ImageWhereUniqueInput!): Image
        createLabel(data: LabelCreateInput!): Label
        updateLabel(
          where: LabelWhereUniqueInput!
          data: LabelUpdateInput!
        ): Label
        deleteLabel(where: LabelWhereUniqueInput!): Label
        createLabelClass(data: LabelClassCreateInput!): LabelClass
        updateLabelClass(
          where: LabelClassWhereUniqueInput!
          data: LabelClassUpdateInput!
        ): LabelClass
        reorderLabelClass(
          where: LabelClassWhereUniqueInput!
          data: LabelClassReorderInput!
        ): LabelClass
        deleteLabelClass(where: LabelClassWhereUniqueInput!): LabelClass
        createDataset(data: DatasetCreateInput!): Dataset
        createDemoDataset: Dataset
        runIog(data: RunIogInput!): IogInferenceResult
        updateDataset(
          where: DatasetWhereUniqueInput!
          data: DatasetUpdateInput!
        ): Dataset
        deleteDataset(where: DatasetWhereUniqueInput!): Dataset
        importDataset(
          where: DatasetWhereUniqueInput!
          data: DatasetImportInput!
        ): ImportStatus
        createWorkspace(data: WorkspaceCreateInput!): Workspace
        updateWorkspace(
          where: WorkspaceWhereUniqueInput!
          data: WorkspaceUpdateInput!
        ): Workspace
        createMembership(data: MembershipCreateInput!): Membership
        updateMembership(
          where: MembershipWhereUniqueInput!
          data: MembershipUpdateInput!
        ): Membership
        deleteMembership(where: MembershipWhereUniqueInput!): Membership
        inviteMember(where: InviteMemberInput!): InvitationStatus
        updateUser(where: UserWhereUniqueInput!, data: UserUpdateInput!): User
      }

      type Query {
        hello: String
        example(where: ExampleWhereUniqueInput!): Example!
        examples(
          where: ExampleWhereInput
          first: Int
          skip: Int
          orderBy: ExampleOrderByInput
        ): [Example!]!
        image(where: ImageWhereUniqueInput!): Image!
        images(where: ImageWhereInput, first: Int, skip: Int): [Image!]!
        imagesAggregates: ImagesAggregates!
        labelClass(where: LabelClassWhereUniqueInput!): LabelClass!
        labelClasses(
          where: LabelClassWhereInput
          first: Int
          skip: Int
        ): [LabelClass!]!
        labelClassesAggregates: LabelClassesAggregates!
        labelsAggregates: LabelsAggregates!
        label(where: LabelWhereUniqueInput!): Label!
        labels(where: LabelWhereInput, first: Int, skip: Int): [Label!]!
        dataset(where: DatasetWhereUniqueInput!): Dataset!
        datasets(where: DatasetWhereInput, first: Int, skip: Int): [Dataset!]!
        searchDataset(where: DatasetWhereUniqueInput!): Dataset
        workspace(where: WorkspaceWhereUniqueInput!): Workspace!
        workspaces(
          first: Int
          skip: Int
          where: WorkspaceWhereInput
        ): [Workspace!]!
        membership(where: MembershipWhereUniqueInput!): Membership!
        memberships(
          where: MembershipWhereInput
          first: Int
          skip: Int
        ): [Membership!]!
        user(where: UserWhereUniqueInput!): User!
        users(first: Int, skip: Int): [User!]!
        exportDataset(
          where: ExportWhereUniqueInput!
          format: ExportFormat!
          options: ExportOptions
        ): String!
        debug: JSON!
      }

      input RunIogInput {
        id: ID!
        imageUrl: String
        x: Float
        y: Float
        width: Float
        height: Float
        pointsInside: [[Float!]]
        pointsOutside: [[Float!]]
        centerPoint: [Float!]
      }

      scalar Upload

      union UploadTarget = UploadTargetDirect | UploadTargetHttp

      type UploadTargetDirect {
        direct: Boolean!
      }

      type UploadTargetHttp {
        uploadUrl: String!
        downloadUrl: String!
      }

      input UploadTargetInput {
        key: String!
      }

      type User {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        name: String
        email: String
        image: String
        memberships: [Membership!]!
      }

      input UserUpdateInput {
        name: String
        image: String
      }

      input UserWhereUniqueInput {
        id: ID!
      }

      type Workspace {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        name: String!
        slug: String!
        image: String
        type: WorkspaceType!
        plan: WorkspacePlan!
        datasets: [Dataset!]!
        memberships: [Membership!]!
      }

      input WorkspaceCreateInput {
        id: ID
        name: String!
        image: String
      }

      enum WorkspacePlan {
        Community
        Starter
        Pro
        Enterprise
      }

      input WorkspaceSlugAndDatasetSlug {
        slug: String!
        workspaceSlug: String!
      }

      enum WorkspaceType {
        Local
        Online
      }

      input WorkspaceUpdateInput {
        name: String
        image: String
      }

      input WorkspaceWhereInput {
        slug: String
      }

      input WorkspaceWhereUniqueInput {
        id: ID
        slug: String
      }
    `,
    resolvers,
    context: ({ req, res }) => {
      return { req, res, repository };
    },
    introspection: true,
    formatError: (error) => {
      Sentry.captureException(error);
      return error;
    },
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
    plugins: [nextJsArtifactsExpirationPlugin],
  }),
  "GET"
);
registerRoute(
  /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
  new CacheFirst({
    cacheName: "google-fonts",
    plugins: [googleFontsExpirationPlugin],
  }),
  "GET"
);

registerRoute(
  /\/static\/.*$/i,
  new StaleWhileRevalidate({
    cacheName: "static-assets",
    plugins: [staticAssetsExpirationPlugin],
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

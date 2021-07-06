// eslint-disable-next-line import/no-extraneous-dependencies
import "@testing-library/jest-dom";
/* eslint-disable-next-line import/no-extraneous-dependencies */
import "fake-indexeddb/auto";
// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from "jest-fetch-mock";
// eslint-disable-next-line import/no-extraneous-dependencies
import CacheStorage from "service-worker-mock/models/CacheStorage";
// eslint-disable-next-line import/no-extraneous-dependencies
import Request from "service-worker-mock/models/Request";
// eslint-disable-next-line import/no-extraneous-dependencies
import Response from "service-worker-mock/models/Response";

Object.assign(global, {
  caches: new CacheStorage(),
  Request,
  Response,
});

fetchMock.enableMocks();

/**
 * We bypass the structured clone algorithm as its current js implementation
 * as its current js implementation doesn't support blobs.
 * It might make our tests a bit different from what would actually happen
 * in a browser.
 */
jest.mock("fake-indexeddb/build/lib/structuredClone", () => ({
  default: (i: any) => i,
}));

export {};

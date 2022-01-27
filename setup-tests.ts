import "@testing-library/jest-dom";
import "fake-indexeddb/auto";
import { configure } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";

// FIXME Default timeout is often exceeded on our CI
const TESTING_LIBRARY_TIMEOUT = 30000;
const JEST_TIMEOUT = TESTING_LIBRARY_TIMEOUT * 2;
jest.setTimeout(JEST_TIMEOUT);
configure({ asyncUtilTimeout: TESTING_LIBRARY_TIMEOUT });

fetchMock.enableMocks();

/**
 * We bypass the structured clone algorithm as its current js implementation
 * doesn't support blobs.
 * It might make our tests a bit different from what would actually happen
 * in a browser.
 */
jest.mock("fake-indexeddb/build/lib/structuredClone", () => ({
  default: (i: any) => i,
}));

export {};

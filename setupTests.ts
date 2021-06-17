import "@testing-library/jest-dom";
/* eslint-disable-next-line import/no-extraneous-dependencies */
import "fake-indexeddb/auto";

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

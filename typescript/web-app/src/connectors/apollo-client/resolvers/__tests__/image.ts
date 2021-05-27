import "fake-indexeddb/auto";

import {
  createImage,
  image,
  images,
  clearGetUrlFromImageIdMem,
} from "../image";
import { db } from "../../../database";

/**
 * We bypass the structured clone algorithm as its current js implementation
 * as its current js implementation doesn't support blobs.
 * It might make our tests a bit different from what would actually happen
 * in a browser.
 */
jest.mock("fake-indexeddb/build/lib/structuredClone", () => ({
  default: (i: any) => i,
}));

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => "mockedUrl");
});

describe("Image resolver test suite", () => {
  beforeEach(async () => {
    db.tables.map((table) => table.clear());
    return clearGetUrlFromImageIdMem();
  });

  // @ts-ignore
  global.Image = class Image extends HTMLElement {
    width: number;

    height: number;

    constructor() {
      super();
      this.width = 42;
      this.height = 36;
      setTimeout(() => {
        this?.onload?.(new Event("onload")); // simulate success
      }, 100);
    }
  };
  // @ts-ignore
  customElements.define("image-custom", global.Image);

  test("Query image when db is empty", async () => {
    const queryResult = await images(undefined, {});

    expect(queryResult.length).toEqual(0);
  });

  test("Create image with Blob", async () => {
    const createResult = await createImage(undefined, {
      data: { name: "test image", file: new Blob() },
    });

    expect(createResult?.name).toEqual("test image");
    expect(await image(undefined, { where: { id: createResult.id } })).toEqual(
      createResult
    );
  });

  test("Create image with URL and specified ID", async () => {
    const createResult = await createImage(undefined, {
      data: {
        name: "test image",
        file: new Blob(),
        id: "myID",
      },
    });

    expect(createResult.id).toEqual("myID");
    expect(await image(undefined, { where: { id: createResult.id } })).toEqual(
      createResult
    );
  });

  test("Query images", async () => {
    const createResult1 = await createImage(undefined, {
      data: {
        file: new Blob(),
        id: "1",
      },
    });
    const createResult2 = await createImage(undefined, {
      data: {
        file: new Blob(),
        id: "2",
      },
    });

    const queryResult = await images(undefined, {});

    expect(queryResult.length).toEqual(2);
    expect(queryResult).toEqual([createResult1, createResult2]);
  });
});

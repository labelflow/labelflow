import "fake-indexeddb/auto";

import {
  initMockedDate,
  // incrementMockedDate,
} from "@labelflow/dev-utils/utils";
import gql from "graphql-tag";
import {
  // createImage,
  // image,
  // images,
  clearGetUrlFromImageIdMem,
} from "../image";
// import { createLabel } from "../label";
import { db } from "../../../database";

import { client } from "../../index";

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
    initMockedDate();
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

  test.only("Query image when db is empty", async () => {
    const queryResult = await client.query({
      query: gql`
        query {
          images {
            id
          }
        }
      `,
    });

    expect(queryResult.data.images.length).toEqual(0);
  });

  // test("Create image with Blob", async () => {
  //   const createResult = await createImage(undefined, {
  //     data: { name: "test image", file: new Blob() },
  //   });

  //   expect(createResult?.name).toEqual("test image");
  //   expect(await image(undefined, { where: { id: createResult.id } })).toEqual(
  //     createResult
  //   );
  // });

  // test("Create image with URL and specified ID", async () => {
  //   const createResult = await createImage(undefined, {
  //     data: {
  //       name: "test image",
  //       file: new Blob(),
  //     },
  //   });

  //   expect(createResult.name).toEqual("test image");
  //   expect(await image(undefined, { where: { id: createResult.id } })).toEqual(
  //     createResult
  //   );
  // });

  // test("Query images", async () => {
  //   const createResult1 = await createImage(undefined, {
  //     data: {
  //       file: new Blob(),
  //     },
  //   });

  //   incrementMockedDate(1);
  //   const createResult2 = await createImage(undefined, {
  //     data: {
  //       file: new Blob(),
  //     },
  //   });

  //   const queryResult = await images(undefined, {});

  //   expect(queryResult.length).toEqual(2);
  //   expect(queryResult).toEqual([createResult1, createResult2]);
  // });

  // test("Querying paginated images", async () => {
  //   await createImage(undefined, {
  //     data: { file: new Blob(), name: "test1" },
  //   });

  //   incrementMockedDate(1);
  //   await createImage(undefined, {
  //     data: { file: new Blob(), name: "test2" },
  //   });

  //   incrementMockedDate(1);
  //   await createImage(undefined, {
  //     data: { file: new Blob(), name: "test3" },
  //   });

  //   incrementMockedDate(1);
  //   await createImage(undefined, {
  //     data: { file: new Blob(), name: "test4" },
  //   });

  //   const queryResult = await images(undefined, { skip: 1, first: 1 });

  //   expect(queryResult.length).toBe(1);
  //   expect(queryResult[0].name).toBe("test2");
  // });

  // test("Querying an image with labels", async () => {
  //   const newImage = await createImage(undefined, {
  //     data: { file: new Blob(), name: "test1" },
  //   });

  //   await createLabel(undefined, {
  //     data: {
  //       imageId: newImage.id,
  //       x: 1,
  //       y: 1,
  //       height: 1,
  //       width: 1,
  //     },
  //   });

  //   incrementMockedDate(-10);

  //   await createLabel(undefined, {
  //     data: {
  //       imageId: newImage.id,
  //       x: 2,
  //       y: 2,
  //       height: 2,
  //       width: 2,
  //     },
  //   });

  //   incrementMockedDate(200);
  //   await createLabel(undefined, {
  //     data: {
  //       imageId: newImage.id,
  //       x: 3,
  //       y: 3,
  //       height: 3,
  //       width: 3,
  //     },
  //   });

  //   const { labels } = await image(undefined, {
  //     where: { id: newImage.id },
  //   });

  //   const labelHeights = labels.map((l) => l.height);

  //   // labels should show in the right order
  //   expect(labelHeights).toEqual([2, 1, 3]);
  // });
});

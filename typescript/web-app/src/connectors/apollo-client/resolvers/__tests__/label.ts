import "fake-indexeddb/auto";

import {
  initMockedDate,
  incrementMockedDate,
} from "@labelflow/dev-utils/utils";
import { createLabel, label, labels } from "../label";
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

const createEmptyImage = async (imageId: string) => {
  return db.image.add({
    id: imageId,
    createdAt: null,
    updatedAt: null,
    name: "",
    width: 0,
    height: 0,
    fileId: "",
  });
};

describe("Label resolver test suite", () => {
  beforeEach(async () => {
    Promise.all(db.tables.map((table) => table.clear()));
    initMockedDate();
  });

  test("Query label when db is empty", async () => {
    const queryResult = await labels(undefined, {});

    expect(queryResult.length).toEqual(0);
  });

  test("Query label when id doesn't exists", async () => {
    const queryNoId = async () =>
      label(undefined, {
        where: { id: "this id doesn't exists" },
      });

    expect(queryNoId()).rejects.toThrow();
  });

  test("Creating a label should fail if its image doesn't exist", async () => {
    const createResultNoImage = async () =>
      createLabel(undefined, {
        data: {
          imageId: "0024fbc1-387b-444f-8ad0-d7a3e316726a",
          x: 3.14,
          y: 42.0,
          height: 768,
          width: 362,
        },
      });

    expect(createResultNoImage()).rejects.toThrow();
  });

  test("Create label", async () => {
    await createEmptyImage("0024fbc1-387b-444f-8ad0-d7a3e316726a");

    const createResult = await createLabel(undefined, {
      data: {
        imageId: "0024fbc1-387b-444f-8ad0-d7a3e316726a",
        x: 3.14,
        y: 42.0,
        height: 768,
        width: 362,
      },
    });

    expect(createResult?.imageId).toEqual(
      "0024fbc1-387b-444f-8ad0-d7a3e316726a"
    );
    expect(await label(undefined, { where: { id: createResult.id } })).toEqual(
      createResult
    );
  });

  test("Query labels", async () => {
    await createEmptyImage("an image id");
    await createEmptyImage("another image id");

    const createResult1 = await createLabel(undefined, {
      data: {
        imageId: "an image id",
        x: 3.14,
        y: 42.0,
        height: 768,
        width: 362,
      },
    });

    incrementMockedDate(1);
    const createResult2 = await createLabel(undefined, {
      data: {
        imageId: "another image id",
        x: 3.14,
        y: 42.0,
        height: 768,
        width: 362,
      },
    });

    const queryResult = await labels(undefined, {});

    expect(queryResult.length).toEqual(2);
    expect(queryResult).toEqual([createResult1, createResult2]);
  });

  test("Querying paginated labels", async () => {
    await createEmptyImage("imageId1");
    await createEmptyImage("imageId2");
    await createEmptyImage("imageId3");
    await createEmptyImage("imageId4");

    await createLabel(undefined, {
      data: {
        imageId: "imageId1",
        x: 3.14,
        y: 42.0,
        height: 768,
        width: 362,
      },
    });

    incrementMockedDate(1);
    await createLabel(undefined, {
      data: {
        imageId: "imageId2",
        x: 3.14,
        y: 42.0,
        height: 768,
        width: 362,
      },
    });

    incrementMockedDate(1);
    await createLabel(undefined, {
      data: {
        imageId: "imageId3",
        x: 3.14,
        y: 42.0,
        height: 768,
        width: 362,
      },
    });

    const queryResult = await labels(undefined, { skip: 1, first: 1 });

    expect(queryResult.length).toBe(1);
    expect(queryResult[0].imageId).toBe("imageId2");
  });
});

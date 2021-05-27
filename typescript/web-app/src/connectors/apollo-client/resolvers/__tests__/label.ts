import "fake-indexeddb/auto";

// import { v4 as uuidv4 } from "uuid";
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

// beforeAll(() => {
//   global.URL.createObjectURL = jest.fn(() => "mockedUrl");
// });

describe("Label resolver test suite", () => {
  beforeEach(async () => {
    db.tables.map((table) => table.clear());
  });

  test("Query label when db is empty", async () => {
    const queryResult = await labels(undefined, {});

    expect(queryResult.length).toEqual(0);
  });

  // test("Query label when id doesn't exists", async () => {
  //   const queryResult = await label(undefined, {
  //     where: { id: "this id doesn't exists" },
  //   });

  //   expect(queryResult.length).toEqual(0);
  // });

  test("Create label with Blob", async () => {
    const createResult = await createLabel(undefined, {
      data: {
        imageId: "0024fbc1-387b-444f-8ad0-d7a3e316726a",
        x: 3.14,
        y: 42.0,
        height: 768,
        width: 362,
      },
    });

    expect(createResult?.x).toEqual(3.14);
    expect(await label(undefined, { where: { id: createResult.id } })).toEqual(
      createResult
    );
  });

  test("Create label with URL and specified ID", async () => {
    const createResult = await createLabel(undefined, {
      data: {
        imageId: "0024fbc1-387b-444f-8ad0-d7a3e316726a",
        x: 3.14,
        y: 42.0,
        height: 768,
        width: 362,
      },
    });

    expect(createResult.imageId).toEqual(
      "0024fbc1-387b-444f-8ad0-d7a3e316726a"
    );
    expect(await label(undefined, { where: { id: createResult.id } })).toEqual(
      createResult
    );
  });

  test("Query labels", async () => {
    const createResult1 = await createLabel(undefined, {
      data: {
        imageId: "an image id",
        x: 3.14,
        y: 42.0,
        height: 768,
        width: 362,
      },
    });
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
    // need to wait in between tests, otherwise createdAt timestamp
    // are the same and we can't order the query result properly
    const sleep = () => {
      return new Promise((resolve) => {
        setTimeout(resolve, 1);
      });
    };

    await createLabel(undefined, {
      data: {
        imageId: "imageId1",
        x: 3.14,
        y: 42.0,
        height: 768,
        width: 362,
      },
    });
    await sleep();
    await createLabel(undefined, {
      data: {
        imageId: "imageId2",
        x: 3.14,
        y: 42.0,
        height: 768,
        width: 362,
      },
    });
    await sleep();
    await createLabel(undefined, {
      data: {
        imageId: "imageId3",
        x: 3.14,
        y: 42.0,
        height: 768,
        width: 362,
      },
    });
    await sleep();
    await createLabel(undefined, {
      data: {
        imageId: "imageId4",
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

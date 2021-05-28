import "fake-indexeddb/auto";

// import { v4 as uuidv4 } from "uuid";
import { createLabelClass, labelClass, labelClasses } from "../label-class";
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

// need to wait in between tests, otherwise createdAt timestamp
// are the same and we can't order the query result properly
const sleep = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 1);
  });
};

describe("LabelClass resolver test suite", () => {
  beforeEach(async () => {
    Promise.all(db.tables.map((table) => table.clear()));
  });

  test("Query labelClass when db is empty", async () => {
    const queryResult = await labelClasses(undefined, {});

    expect(queryResult.length).toEqual(0);
  });

  test("Query labelClass when id doesn't exists", async () => {
    const queryNoId = async () =>
      labelClass(undefined, {
        where: { id: "this id doesn't exists" },
      });

    expect(queryNoId()).rejects.toThrow();
  });

  test("Create labelClass", async () => {
    const createResult = await createLabelClass(undefined, {
      data: {
        name: "toto",
        color: 0xffffff,
      },
    });

    expect(createResult?.name).toEqual("toto");
    expect(
      await labelClass(undefined, { where: { id: createResult.id } })
    ).toEqual(createResult);
  });

  test("Query labelClasses", async () => {
    const createResult1 = await createLabelClass(undefined, {
      data: {
        name: "1",
        color: 0xffffff,
      },
    });
    await sleep();
    const createResult2 = await createLabelClass(undefined, {
      data: {
        name: "2",
        color: 0xffffff,
      },
    });

    const queryResult = await labelClasses(undefined, {});
    expect(queryResult.length).toEqual(2);
    expect(queryResult).toEqual([createResult1, createResult2]);
  });

  test("Querying paginated labelClasses", async () => {
    await createLabelClass(undefined, {
      data: {
        name: "1",
        color: 0xffffff,
      },
    });
    await sleep();
    await createLabelClass(undefined, {
      data: {
        name: "2",
        color: 0xffffff,
      },
    });
    await sleep();
    await createLabelClass(undefined, {
      data: {
        name: "3",
        color: 0xffffff,
      },
    });
    await sleep();
    await createLabelClass(undefined, {
      data: {
        name: "4",
        color: 0xffffff,
      },
    });

    const queryResult = await labelClasses(undefined, { skip: 1, first: 1 });
    expect(queryResult.length).toBe(1);
    expect(queryResult[0].name).toBe("2");
  });
});

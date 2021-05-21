import localforage from "localforage";
import { createExample, example, examples } from "../example";

jest.mock("localforage", () => ({
  setItem: jest.fn(async () => {}),
  getItem: jest.fn(async () => {}),
}));

const mockedLocalForage = <
  {
    getItem: jest.Mock<Promise<any>>;
    setItem: jest.Mock<Promise<any>>;
  }
>(localforage as unknown);

describe("Example resolver test suite", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("Query example when db is empty", async () => {
    const queryResult = await examples();

    expect(queryResult.length).toBe(0);
  });

  test("Create example", async () => {
    const createResult = await createExample(undefined, {
      data: { name: "test" },
    });

    expect(createResult?.name).toBe("test");
    expect(mockedLocalForage.setItem.mock.calls[0][0]).toEqual(
      `Example:${createResult.id}`
    );
  });

  test("Query example", async () => {
    await example(undefined, {
      where: { id: "testId" },
    });

    expect(mockedLocalForage.getItem.mock.calls[0][0]).toEqual(
      "Example:testId"
    );
  });

  test("Query examples", async () => {
    mockedLocalForage.getItem.mockReturnValue(
      Promise.resolve([
        "Example:1",
        "Example:2",
        "Example:3",
        "Example:4",
        "Example:5",
      ])
    );

    const queryResult = await examples();

    expect(queryResult.length).toEqual(5);
    expect(mockedLocalForage.getItem.mock.calls[0][0]).toEqual(`Example:list`);
    expect(mockedLocalForage.getItem.mock.calls[1][0]).toEqual(`Example:1`);
    expect(mockedLocalForage.getItem.mock.calls[2][0]).toEqual(`Example:2`);
    expect(mockedLocalForage.getItem.mock.calls[3][0]).toEqual(`Example:3`);
    expect(mockedLocalForage.getItem.mock.calls[4][0]).toEqual(`Example:4`);
    expect(mockedLocalForage.getItem.mock.calls[5][0]).toEqual(`Example:5`);
    expect(mockedLocalForage.getItem.mock.calls[6]).toBeUndefined();
  });
});

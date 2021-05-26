import localforage from "localforage";
import { getListFromStorage, appendToListInStorage } from "../utils";

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

describe("Resolver utils tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test("Get list from storage when list is empty", async () => {
    mockedLocalForage.getItem.mockReturnValue(Promise.resolve(null));

    const listOfEntities = await getListFromStorage("Entity:list");

    expect(listOfEntities).toEqual([]);
    expect(mockedLocalForage.getItem.mock.calls[0][0]).toEqual("Entity:list");
  });

  test("Get list from storage", async () => {
    mockedLocalForage.getItem.mockReturnValue(
      Promise.resolve(["Entity:1", "Entity:2", "Entity:3"])
    );
    const listOfEntities = await getListFromStorage("Entity:list");

    expect(listOfEntities.length).toEqual(3);
    expect(mockedLocalForage.getItem.mock.calls[0][0]).toEqual("Entity:list");
    expect(mockedLocalForage.getItem.mock.calls[1][0]).toEqual("Entity:1");
    expect(mockedLocalForage.getItem.mock.calls[2][0]).toEqual("Entity:2");
    expect(mockedLocalForage.getItem.mock.calls[3][0]).toEqual("Entity:3");
    expect(mockedLocalForage.getItem.mock.calls[4]).toBeUndefined();
  });

  test("Get list from storage when list is empty", async () => {
    await appendToListInStorage("Entity:list", "Entity:1");

    expect(mockedLocalForage.getItem.mock.calls[0][0]).toEqual("Entity:list");
    expect(mockedLocalForage.setItem.mock.calls[0][0]).toEqual("Entity:list");
    expect(mockedLocalForage.setItem.mock.calls[0][1]).toEqual(["Entity:1"]);
  });

  test("Get list from storage", async () => {
    mockedLocalForage.getItem.mockReturnValue(Promise.resolve(["Entity:1"]));

    await appendToListInStorage("Entity:list", "Entity:2");

    expect(mockedLocalForage.getItem.mock.calls[0][0]).toEqual("Entity:list");
    expect(mockedLocalForage.setItem.mock.calls[0][0]).toEqual("Entity:list");
    expect(mockedLocalForage.setItem.mock.calls[0][1]).toEqual([
      "Entity:1",
      "Entity:2",
    ]);
  });

  describe("With pagination", () => {
    beforeEach(() => {
      mockedLocalForage.getItem.mockResolvedValue([
        "Entity:1",
        "Entity:2",
        "Entity:3",
        "Entity:4",
        "Entity:5",
      ]);
    });

    test("Query list with skip ", async () => {
      const queryResultSkippingOne = await getListFromStorage("Entity:list", {
        skip: 1,
      });

      expect(queryResultSkippingOne.length).toEqual(4);

      expect(mockedLocalForage.getItem).toHaveBeenNthCalledWith(
        1,
        "Entity:list"
      );
      expect(mockedLocalForage.getItem).toHaveBeenNthCalledWith(2, "Entity:2");
      expect(mockedLocalForage.getItem).toHaveBeenNthCalledWith(3, "Entity:3");
      expect(mockedLocalForage.getItem).toHaveBeenNthCalledWith(4, "Entity:4");
      expect(mockedLocalForage.getItem).toHaveBeenNthCalledWith(5, "Entity:5");

      // the 4 items on the skipped list + one call to get the list itself
      expect(mockedLocalForage.getItem).toBeCalledTimes(5);
    });

    test("Query list with first ", async () => {
      const queryResultFirstTwo = await getListFromStorage("Entity:list", {
        first: 2,
      });

      expect(queryResultFirstTwo.length).toEqual(2);

      expect(mockedLocalForage.getItem).toHaveBeenNthCalledWith(
        1,
        "Entity:list"
      );
      expect(mockedLocalForage.getItem).toHaveBeenNthCalledWith(2, "Entity:1");
      expect(mockedLocalForage.getItem).toHaveBeenNthCalledWith(3, "Entity:2");

      // the 2 first items of list + one call to get the list itself
      expect(mockedLocalForage.getItem).toBeCalledTimes(3);
    });

    test("Query list with skip and first ", async () => {
      const queryResultFirstTwoSkipOne = await getListFromStorage(
        "Entity:list",
        {
          first: 2,
          skip: 1,
        }
      );

      expect(queryResultFirstTwoSkipOne.length).toEqual(2);

      expect(mockedLocalForage.getItem).toHaveBeenNthCalledWith(
        1,
        "Entity:list"
      );
      expect(mockedLocalForage.getItem).toHaveBeenNthCalledWith(2, "Entity:2");
      expect(mockedLocalForage.getItem).toHaveBeenNthCalledWith(3, "Entity:3");

      // the 2 first items of skipped list + one call to get the list itself
      expect(mockedLocalForage.getItem).toBeCalledTimes(3);
    });

    test("Query more items than available", async () => {
      const queryResultFirstTwoSkipFour = await getListFromStorage(
        "Entity:list",
        {
          first: 2,
          skip: 4,
        }
      );

      expect(queryResultFirstTwoSkipFour.length).toEqual(1);

      expect(mockedLocalForage.getItem).toHaveBeenNthCalledWith(
        1,
        "Entity:list"
      );
      expect(mockedLocalForage.getItem).toHaveBeenNthCalledWith(2, "Entity:5");

      // the last items of list + one call to get the list itself
      expect(mockedLocalForage.getItem).toBeCalledTimes(2);
    });
  });
});

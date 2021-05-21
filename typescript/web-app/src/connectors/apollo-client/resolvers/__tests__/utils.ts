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
});

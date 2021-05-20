import localforage from "localforage";
import { getListFromStorage } from "../utils";

jest.mock("localforage");

const mockedLocalForage = <
  {
    getItem: jest.Mock<Promise<any>>;
    setItem: jest.Mock<Promise<any>>;
  }
>(localforage as unknown);

describe("Resolver utils tests", () => {
  test("Get list from storage when list is empty", async () => {
    mockedLocalForage.getItem = jest.fn(async () => null);

    const listOfEntities = await getListFromStorage("Entity:list");

    expect(listOfEntities).toEqual([]);
    expect(mockedLocalForage.getItem.mock.calls[0][0]).toEqual("Entity:list");
  });

  test("Get list from storage", async () => {
    mockedLocalForage.getItem = jest.fn(async () => [
      "Entity:1",
      "Entity:2",
      "Entity:3",
    ]);

    const listOfEntities = await getListFromStorage("Entity:list");

    expect(listOfEntities.length).toEqual(3);
    expect(mockedLocalForage.getItem.mock.calls[0][0]).toEqual("Entity:list");
    expect(mockedLocalForage.getItem.mock.calls[1][0]).toEqual("Entity:1");
    expect(mockedLocalForage.getItem.mock.calls[2][0]).toEqual("Entity:2");
    expect(mockedLocalForage.getItem.mock.calls[3][0]).toEqual("Entity:3");
    expect(mockedLocalForage.getItem.mock.calls[4]).toBeUndefined();
  });
});

import localforage from "localforage";
import { createImage, image, images } from "../image";

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

describe("Image resolver test suite", () => {
  test("Query image when db is empty", async () => {
    mockedLocalForage.getItem = jest.fn(async () => {});

    const queryResult = await images(undefined, {});

    expect(queryResult.length).toBe(0);
  });

  test("Create image", async () => {
    mockedLocalForage.setItem = jest.fn(async () => {});

    const createResult = await createImage(undefined, {
      data: { name: "test image", width: 1000, height: 600, url: "myUrl" },
    });

    expect(createResult?.name).toBe("test image");
    expect(mockedLocalForage.setItem.mock.calls[0][0]).toEqual(
      `Image:${createResult.id}`
    );
  });

  test("Create image with specified ID", async () => {
    mockedLocalForage.setItem = jest.fn(async () => {});

    const createResult = await createImage(undefined, {
      data: {
        name: "test image",
        width: 1000,
        height: 600,
        url: "myUrl",
        id: "myID",
      },
    });

    expect(createResult.id).toBe("myID");
    expect(mockedLocalForage.setItem.mock.calls[0][0]).toEqual(
      `Image:${createResult.id}`
    );
  });

  test("Query image", async () => {
    mockedLocalForage.getItem = jest.fn(async () => ({
      id: "1",
      name: "Test",
    }));

    const queryResult = await image(undefined, {
      where: { id: "1" },
    });

    expect(queryResult).toEqual({ id: "1", name: "Test" });
    expect(mockedLocalForage.getItem.mock.calls[0][0]).toEqual(`Image:1`);
  });

  test("Query images", async () => {
    mockedLocalForage.getItem = jest.fn(async () => ["Image:1", "Image:2"]);

    const queryResult = await images(undefined, {});

    expect(queryResult.length).toEqual(2);
    expect(mockedLocalForage.getItem.mock.calls[0][0]).toEqual(`Image:list`);
    expect(mockedLocalForage.getItem.mock.calls[1][0]).toEqual(`Image:1`);
    expect(mockedLocalForage.getItem.mock.calls[2][0]).toEqual(`Image:2`);
    expect(mockedLocalForage.getItem.mock.calls[3]).toBeUndefined();
  });

  test("Query images with skip ", async () => {
    mockedLocalForage.getItem = jest.fn(async () => [
      "Image:1",
      "Image:2",
      "Image:3",
      "Image:4",
      "Image:5",
    ]);

    const queryResultSkippingOne = await images(undefined, { skip: 1 });

    expect(queryResultSkippingOne.length).toEqual(4);
  });

  test("Query images with first ", async () => {
    mockedLocalForage.getItem = jest.fn(async () => [
      "Image:1",
      "Image:2",
      "Image:3",
      "Image:4",
      "Image:5",
    ]);

    const queryResultFirstTwo = await images(undefined, { first: 2 });

    expect(queryResultFirstTwo.length).toEqual(2);
  });
  test("Query images with skip and first ", async () => {
    mockedLocalForage.getItem = jest.fn(async () => [
      "Image:1",
      "Image:2",
      "Image:3",
      "Image:4",
      "Image:5",
    ]);
    const queryResultFirstTwoSkipOne = await images(undefined, {
      first: 2,
      skip: 1,
    });
    const queryResultFirstTwoSkipFour = await images(undefined, {
      first: 2,
      skip: 4,
    });

    expect(queryResultFirstTwoSkipOne.length).toEqual(2);
    expect(queryResultFirstTwoSkipFour.length).toEqual(1);
  });
});

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
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test("Query image when db is empty", async () => {
    const queryResult = await images(undefined, {});

    expect(queryResult.length).toBe(0);
  });

  test("Create image", async () => {
    const createResult = await createImage(undefined, {
      data: { name: "test image", width: 1000, height: 600, url: "myUrl" },
    });

    expect(createResult?.name).toBe("test image");
    expect(mockedLocalForage.setItem.mock.calls[0][0]).toEqual(
      `Image:${createResult.id}`
    );
  });

  test("Create image with specified ID", async () => {
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
    mockedLocalForage.getItem.mockResolvedValueOnce({
      id: "1",
      name: "Test",
    });

    const queryResult = await image(undefined, {
      where: { id: "1" },
    });

    expect(queryResult).toEqual({ id: "1", name: "Test" });
    expect(mockedLocalForage.getItem.mock.calls[0][0]).toEqual(`Image:1`);
  });
  describe("Test list queries", () => {
    beforeEach(() => {
      mockedLocalForage.getItem.mockReturnValue(
        new Promise((resolve) => {
          resolve(["Image:1", "Image:2", "Image:3", "Image:4", "Image:5"]);
        })
      );
    });
    test("Query images", async () => {
      const queryResult = await images(undefined, {});

      expect(queryResult.length).toEqual(5);
      expect(mockedLocalForage.getItem.mock.calls[0][0]).toEqual(`Image:list`);
      expect(mockedLocalForage.getItem.mock.calls[1][0]).toEqual(`Image:1`);
      expect(mockedLocalForage.getItem.mock.calls[2][0]).toEqual(`Image:2`);
      expect(mockedLocalForage.getItem.mock.calls[3][0]).toEqual(`Image:3`);
      expect(mockedLocalForage.getItem.mock.calls[4][0]).toEqual(`Image:4`);
      expect(mockedLocalForage.getItem.mock.calls[5][0]).toEqual(`Image:5`);
      expect(mockedLocalForage.getItem.mock.calls[6]).toBeUndefined();
    });

    test("Query images with skip ", async () => {
      const queryResultSkippingOne = await images(undefined, { skip: 1 });

      expect(queryResultSkippingOne.length).toEqual(4);
    });

    test("Query images with first ", async () => {
      const queryResultFirstTwo = await images(undefined, { first: 2 });

      expect(queryResultFirstTwo.length).toEqual(2);
    });
    test("Query images with skip and first ", async () => {
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
});

import localforage from "localforage";
import { createImage, image, images } from "../image";

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => "mockedUrl");
});
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
    mockedLocalForage.getItem.mockReturnValue(Promise.resolve(null));

    const queryResult = await images(undefined, {});

    expect(queryResult.length).toEqual(0);
  });

  test("Create image", async () => {
    const createResult = await createImage(undefined, {
      data: { name: "test image", width: 1000, height: 600, url: "myUrl" },
    });

    expect(createResult?.name).toEqual("test image");
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

    expect(createResult.id).toEqual("myID");
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

  test("Query images", async () => {
    mockedLocalForage.getItem.mockReturnValue(
      Promise.resolve(["Image:1", "Image:2", "Image:3", "Image:4", "Image:5"])
    );

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
});

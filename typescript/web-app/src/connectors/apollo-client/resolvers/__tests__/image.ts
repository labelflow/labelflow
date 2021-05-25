import localforage from "localforage";
import { createImage, image, images } from "../image";

jest.mock("localforage", () => ({
  setItem: jest.fn(async () => {}),
  getItem: jest.fn(async () => {}),
}));

jest.mock("mem", () => (func: any) => func);

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => "mockedUrl");
});

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

  test("Create image with URL", async () => {
    const createResult = await createImage(undefined, {
      data: { name: "test image", file: new Blob() },
    });

    expect(createResult?.name).toEqual("test image");
    expect(mockedLocalForage.setItem.mock.calls[0][0]).toEqual(
      `Image:${createResult.id}`
    );
  });

  test("Create image with URL and specified ID", async () => {
    const createResult = await createImage(undefined, {
      data: {
        name: "test image",
        file: new Blob(),
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
    expect(mockedLocalForage.getItem.mock.calls[0][0]).toEqual("Image:1");
  });

  test("Query images", async () => {
    jest.resetAllMocks();
    mockedLocalForage.getItem.mockImplementation((key) => {
      if (key === "Image:list") {
        return Promise.resolve([
          "Image:1",
          "Image:2",
          "Image:3",
          "Image:4",
          "Image:5",
        ]);
      }

      // console.log(key.split(":"));
      return Promise.resolve({ id: key.split(":")[1] });
    });

    const queryResult = await images(undefined, {});

    expect(queryResult.length).toEqual(5);

    // First Call to get the list of keys
    expect(mockedLocalForage.getItem).toHaveBeenNthCalledWith(1, "Image:list");

    // For each key, we get the related image
    expect(mockedLocalForage.getItem).toHaveBeenNthCalledWith(2, "Image:1");
    expect(mockedLocalForage.getItem).toHaveBeenNthCalledWith(3, "Image:2");
    expect(mockedLocalForage.getItem).toHaveBeenNthCalledWith(4, "Image:3");
    expect(mockedLocalForage.getItem).toHaveBeenNthCalledWith(5, "Image:4");
    expect(mockedLocalForage.getItem).toHaveBeenNthCalledWith(6, "Image:5");

    // For each image, we get the related blob
    expect(mockedLocalForage.getItem).toHaveBeenNthCalledWith(
      7,
      "Image:1:blob"
    );
    expect(mockedLocalForage.getItem).toHaveBeenNthCalledWith(
      8,
      "Image:2:blob"
    );
    expect(mockedLocalForage.getItem).toHaveBeenNthCalledWith(
      9,
      "Image:3:blob"
    );
    expect(mockedLocalForage.getItem).toHaveBeenNthCalledWith(
      10,
      "Image:4:blob"
    );
    expect(mockedLocalForage.getItem).toHaveBeenNthCalledWith(
      11,
      "Image:5:blob"
    );

    expect(mockedLocalForage.getItem).toBeCalledTimes(11);
  });
});

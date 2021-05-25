import localforage from "localforage";
import { createImage, image, images, clearGetUrlFromKeyMem } from "../image";

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => "mockedUrl");
});

describe("Image resolver test suite", () => {
  beforeEach(() => {
    clearGetUrlFromKeyMem();
    return localforage.clear();
  });

  // @ts-ignore
  global.Image = class Image extends HTMLElement {
    width: number;

    height: number;

    constructor() {
      super();
      this.width = 42;
      this.height = 36;
      setTimeout(() => {
        this?.onload?.(new Event("onload")); // simulate success
      }, 100);
    }
  };
  // @ts-ignore
  customElements.define("image-custom", global.Image);

  test("Query image when db is empty", async () => {
    const queryResult = await images(undefined, {});

    expect(queryResult.length).toEqual(0);
  });

  test("Create image with Blob", async () => {
    const createResult = await createImage(undefined, {
      data: { name: "test image", file: new Blob() },
    });

    expect(createResult?.name).toEqual("test image");
    expect(await image(undefined, { where: { id: createResult.id } })).toEqual(
      createResult
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
    expect(await image(undefined, { where: { id: createResult.id } })).toEqual(
      createResult
    );
  });

  test("Query images", async () => {
    const createResult1 = await createImage(undefined, {
      data: {
        file: new Blob(),
        id: "1",
      },
    });
    const createResult2 = await createImage(undefined, {
      data: {
        file: new Blob(),
        id: "2",
      },
    });

    const queryResult = await images(undefined, {});

    expect(queryResult.length).toEqual(2);
    expect(queryResult).toEqual([createResult1, createResult2]);
  });
});

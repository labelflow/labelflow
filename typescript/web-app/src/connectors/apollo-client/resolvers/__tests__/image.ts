import localforage from "localforage";
import { createImage, image, images } from "../image";

describe("Image resolver test suite", () => {
  test("Query image when db is empty", async () => {
    const queryResult = await images();
    expect(queryResult.length).toBe(0);
  });
  test("Create image", async () => {
    const createResult = await createImage(undefined, {
      data: { name: "test image", width: 1000, height: 600, url: "myUrl" },
    });
    expect(createResult?.name).toBe("test image");
    expect(await localforage.getItem(`Image:${createResult.id}`)).toBe(
      createResult
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
    expect(await localforage.getItem(`Image:${createResult.id}`)).toBe(
      createResult
    );
  });
  test("Query image", async () => {
    const createResult = await createImage(undefined, {
      data: { name: "test image 2", width: 1000, height: 600, url: "myUrl" },
    });
    const queryResult = await image(undefined, {
      where: { id: createResult.id },
    });
    expect(queryResult).toBe(createResult);
  });
  test("Query images", async () => {
    const createResult = await createImage(undefined, {
      data: { name: "test image 3", width: 1000, height: 600, url: "myUrl" },
    });
    const queryResult = await images();
    expect(queryResult.length).toBe(4);
    expect(queryResult[queryResult.length - 1]).toBe(createResult);
  });
});

import localforage from "localforage";
import { createImage, image, images } from "../image";

describe("Image resolver test suite", () => {
  test("Query image when db is empty", async () => {
    const queryResult = await images(undefined, {});
    expect(queryResult.length).toBe(0);
  });
  test("Create image", async () => {
    const createResult = await createImage(undefined, {
      data: { name: "test image", width: 1000, height: 600, url: "myUrl" },
    });
    expect(createResult?.name).toBe("test image");
    expect(await localforage.getItem(`Image:${createResult.id}`)).toEqual(
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
    expect(await localforage.getItem(`Image:${createResult.id}`)).toEqual(
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
    expect(queryResult).toEqual(createResult);
  });
  test("Query images", async () => {
    const createResult = await createImage(undefined, {
      data: { name: "test image 3", width: 1000, height: 600, url: "myUrl" },
    });
    const queryResult = await images(undefined, {});
    expect(queryResult.length).toEqual(4);
    expect(queryResult[queryResult.length - 1]).toEqual(createResult);
  });
  test("Query images with skip and first", async () => {
    const createResult = await createImage(undefined, {
      data: { name: "test image 4", width: 1000, height: 600, url: "myUrl" },
    });
    const queryResultSkippingOne = await images(undefined, { skip: 1 });
    expect(queryResultSkippingOne.length).toEqual(4);
    const queryResultFirstTwo = await images(undefined, { first: 2 });
    expect(queryResultFirstTwo.length).toEqual(2);
    const queryResultFirstTwoSkipOne = await images(undefined, {
      first: 2,
      skip: 1,
    });
    expect(queryResultFirstTwoSkipOne.length).toEqual(2);
    const queryResultFirstTwoSkipFour = await images(undefined, {
      first: 2,
      skip: 4,
    });
    expect(queryResultFirstTwoSkipFour.length).toEqual(1);
    expect(queryResultFirstTwoSkipFour[0]).toEqual(createResult);
  });
});

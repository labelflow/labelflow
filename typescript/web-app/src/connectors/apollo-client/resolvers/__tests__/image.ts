import "fake-indexeddb/auto";

import {
  initMockedDate,
  incrementMockedDate,
} from "@labelflow/dev-utils/mockdate";
import gql from "graphql-tag";
import {
  // createImage,
  // image,
  // images,
  clearGetUrlFromImageIdMem,
} from "../image";
// import { createLabel } from "../label";
import { db } from "../../../database";

import { client } from "../../index";

/**
 * We bypass the structured clone algorithm as its current js implementation
 * as its current js implementation doesn't support blobs.
 * It might make our tests a bit different from what would actually happen
 * in a browser.
 */
jest.mock("fake-indexeddb/build/lib/structuredClone", () => ({
  default: (i: any) => i,
}));

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => "mockedUrl");
});

describe("Image resolver test suite", () => {
  beforeEach(async () => {
    await Promise.all(db.tables.map((table) => table.clear()));
    await client.clearStore();
    initMockedDate();
    clearGetUrlFromImageIdMem();
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

  const createImage = async (name: String) => {
    const mutationResult = await client.mutate({
      mutation: gql`
        mutation createImage($file: Upload!, $name: String!) {
          createImage(data: { name: $name, file: $file }) {
            id
          }
        }
      `,
      variables: {
        file: new Blob(),
        name,
      },
    });

    const {
      data: {
        createImage: { id },
      },
    } = mutationResult;

    return id;
  };

  const createLabel = (imageId: number, x: number) => {
    return client.mutate({
      mutation: gql`
        mutation createLabel($data: LabelCreateInput!) {
          createLabel(data: $data) {
            id
          }
        }
      `,
      variables: {
        data: {
          imageId,
          x,
          y: 1,
          height: 1,
          width: 1,
        },
      },
    });
  };

  test("Query images when db is empty", async () => {
    const queryResult = await client.query({
      query: gql`
        query {
          images {
            id
          }
        }
      `,
    });

    expect(queryResult.data.images.length).toEqual(0);
  });

  test("Create image with Blob", async () => {
    const id = await createImage("new test image");

    const queryResult = await client.query({
      query: gql`
        query getImage($id: ID!) {
          image(where: { id: $id }) {
            id
            name
            url
          }
        }
      `,
      variables: {
        id,
      },
    });

    expect(queryResult.data.image).toEqual(
      expect.objectContaining({
        id,
        name: "new test image",
        url: "mockedUrl",
      })
    );
  });

  test("Query several images", async () => {
    const imageId2 = await createImage("image 2");
    incrementMockedDate(1);
    const imageId1 = await createImage("image 1");
    incrementMockedDate(1);
    const imageId3 = await createImage("image 3");

    const queryResult = await client.query({
      query: gql`
        query {
          images {
            id
          }
        }
      `,
    });

    expect(queryResult.data.images.length).toEqual(3);
    expect(
      queryResult.data.images.map((image: { id: string }) => image.id)
    ).toEqual([imageId2, imageId1, imageId3]);
  });

  test("Querying paginated images", async () => {
    await createImage("image 2");
    incrementMockedDate(1);
    const imageId1 = await createImage("image 1");
    incrementMockedDate(1);
    const imageId3 = await createImage("image 3");
    incrementMockedDate(1);
    await createImage("image 4");

    const queryResult = await client.query({
      query: gql`
        query {
          images(first: 2, skip: 1) {
            id
          }
        }
      `,
    });

    expect(queryResult.data.images.length).toEqual(2);
    expect(
      queryResult.data.images.map((image: { id: string }) => image.id)
    ).toEqual([imageId1, imageId3]);
  });

  test("Querying an image with labels", async () => {
    const imageId = await createImage("an image");

    await createLabel(imageId, 2);
    incrementMockedDate(1);
    await createLabel(imageId, 1);

    const queryResult = await client.query({
      query: gql`
        query getImage($id: ID!) {
          image(where: { id: $id }) {
            id
            labels {
              x
            }
          }
        }
      `,
      variables: {
        id: imageId,
      },
    });

    // labels should show in the right order
    expect(
      queryResult.data.image.labels.map((l: { x: number }) => l.x)
    ).toEqual([2, 1]);
  });
});

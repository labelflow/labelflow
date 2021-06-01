import "fake-indexeddb/auto";
import {
  initMockedDate,
  incrementMockedDate,
} from "@labelflow/dev-utils/mockdate";
import gql from "graphql-tag";
import { db } from "../../../database";
import { client } from "../../index";
import { LabelCreateInput } from "../../../../types.generated";

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

const labelData = {
  x: 3.14,
  y: 42.0,
  height: 768,
  width: 362,
};

const createLabel = (data: LabelCreateInput) => {
  return client.mutate({
    mutation: gql`
      mutation createLabel($data: LabelCreateInput!) {
        createLabel(data: $data) {
          id
        }
      }
    `,
    variables: {
      data,
    },
  });
};

describe("Label resolver test suite", () => {
  beforeEach(async () => {
    Promise.all(db.tables.map((table) => table.clear()));
    await client.clearStore();
    initMockedDate();
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

  test("Creating a label should fail if its image doesn't exist", async () => {
    const imageId = "0024fbc1-387b-444f-8ad0-d7a3e316726a";
    return expect(
      createLabel({
        ...labelData,
        imageId,
      })
    ).rejects.toThrow(`The image id ${imageId} doesn't exist.`);
  });

  test("Create label", async () => {
    const imageId = await createImage("an image");

    const createResult = await createLabel({
      ...labelData,
      imageId,
    });

    expect(
      await client.query({
        query: gql`
          query getImage($id: ID!) {
            image(where: { id: $id }) {
              labels {
                id
              }
            }
          }
        `,
        variables: {
          id: imageId,
        },
      })
    ).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          image: expect.objectContaining({
            labels: [
              expect.objectContaining({ id: createResult.data.createLabel.id }),
            ],
          }),
        }),
      })
    );
  });

  test("Create several labels", async () => {
    const imageId = await createImage("an image");

    await createLabel({
      ...labelData,
      x: 1,
      imageId,
    });
    incrementMockedDate(1);
    await createLabel({
      ...labelData,
      x: 2,
      imageId,
    });

    const queryResult = await client.query({
      query: gql`
        query getImage($id: ID!) {
          image(where: { id: $id }) {
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

    expect(
      queryResult.data.image.labels.map(
        (label: { x: number }): number => label.x
      )
    ).toEqual([1, 2]);
  });
});

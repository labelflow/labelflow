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

const createEmptyImage = (imageId: string) => {
  return db.image.add({
    id: imageId,
    createdAt: null,
    updatedAt: null,
    name: "",
    width: 0,
    height: 0,
    fileId: "",
  });
};

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

  test("Query labels when db is empty", async () => {
    const queryResult = await client.query({
      query: gql`
        query {
          labels {
            id
          }
        }
      `,
    });

    expect(queryResult.data.labels.length).toEqual(0);
  });

  test("Query label when id doesn't exists", async () => {
    return expect(
      client.query({
        query: gql`
          query getLabel($id: ID!) {
            label(where: { id: $id }) {
              id
            }
          }
        `,
        variables: {
          id: "some-id",
        },
      })
    ).rejects.toThrow("No label with such id");
  });

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
    await createEmptyImage("0024fbc1-387b-444f-8ad0-d7a3e316726a");

    const createResult = await createLabel({
      ...labelData,
      imageId: "0024fbc1-387b-444f-8ad0-d7a3e316726a",
    });

    expect(
      await client.query({
        query: gql`
          query getLabel($id: ID!) {
            label(where: { id: $id }) {
              id
            }
          }
        `,
        variables: {
          id: createResult.data.createLabel.id,
        },
      })
    ).toEqual(
      expect.objectContaining({
        data: {
          label: expect.objectContaining({
            id: createResult.data.createLabel.id,
          }),
        },
      })
    );
  });

  test("Query labels", async () => {
    await createEmptyImage("an image id");
    await createEmptyImage("another image id");

    const createResult1 = await createLabel({
      ...labelData,
      imageId: "an image id",
    });

    incrementMockedDate(1);
    const createResult2 = await createLabel({
      ...labelData,
      imageId: "another image id",
    });

    const queryResult = await client.query({
      query: gql`
        query {
          labels {
            id
          }
        }
      `,
    });

    expect(queryResult.data.labels.length).toEqual(2);
    expect(queryResult.data.labels).toEqual([
      createResult1.data.createLabel,
      createResult2.data.createLabel,
    ]);
  });

  test("Querying paginated labels", async () => {
    await createEmptyImage("imageId1");
    await createEmptyImage("imageId2");
    await createEmptyImage("imageId3");

    await createLabel({
      ...labelData,
      imageId: "imageId1",
    });

    incrementMockedDate(1);
    await createLabel({
      ...labelData,
      imageId: "imageId2",
    });

    incrementMockedDate(1);
    await createLabel({
      ...labelData,
      imageId: "imageId3",
    });

    const queryResult = await client.query({
      query: gql`
        query getLabels($skip: Int, $first: Int) {
          labels(skip: $skip, first: $first) {
            id
            imageId
          }
        }
      `,
      variables: {
        skip: 1,
        first: 1,
      },
    });

    expect(queryResult.data.labels.length).toBe(1);
    expect(queryResult.data.labels[0].imageId).toBe("imageId2");
  });
});

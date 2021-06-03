import "fake-indexeddb/auto";
import {
  initMockedDate,
  incrementMockedDate,
} from "@labelflow/dev-utils/mockdate";
import gql from "graphql-tag";
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

const createLabelClass = async (data: {
  name: string;
  color: string;
  id?: string;
}) => {
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createLabelClass($data: LabelClassCreateInput!) {
        createLabelClass(data: $data) {
          id
        }
      }
    `,
    variables: {
      data,
    },
  });

  const {
    data: {
      createLabelClass: { id },
    },
  } = mutationResult;

  return id;
};

const createLabel = async (labelClassId: number, x: number) => {
  const {
    data: {
      createImage: { id: imageId },
    },
  } = await client.mutate({
    mutation: gql`
      mutation createImage($file: Upload!, $name: String!) {
        createImage(data: { name: $name, file: $file }) {
          id
        }
      }
    `,
    variables: {
      file: new Blob(),
      name: "someImageName",
    },
  });
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
        labelClassId,
        x,
        y: 1,
        height: 1,
        width: 1,
      },
    },
  });
};

describe("LabelClass resolver test suite", () => {
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

  test("Query labelClass when db is empty", async () => {
    const queryResult = await client.query({
      query: gql`
        query {
          labelClasses {
            id
          }
        }
      `,
    });

    expect(queryResult.data.labelClasses.length).toEqual(0);
  });

  test("Query labelClass when id doesn't exists", async () => {
    return expect(
      client.query({
        query: gql`
          query getLabelClass($id: ID!) {
            labelClass(where: { id: $id }) {
              id
            }
          }
        `,
        variables: {
          id: "some-id",
        },
      })
    ).rejects.toThrow("No labelClass with such id");
  });

  test("Create labelClass", async () => {
    const id = await createLabelClass({
      name: "toto",
      color: "#ff0000",
    });

    const queryResult = await client.query({
      query: gql`
        query getLabelClass($id: ID!) {
          labelClass(where: { id: $id }) {
            id
            name
            color
          }
        }
      `,
      variables: {
        id,
      },
    });

    expect(queryResult.data.labelClass).toEqual(
      expect.objectContaining({
        id,
        name: "toto",
        color: "#ff0000",
      })
    );
  });

  test("Create labelClass with an ID", async () => {
    const labelClassId = "a custom id";
    const id = await createLabelClass({
      id: labelClassId,
      name: "toto",
      color: "#ff0000",
    });

    const queryResult = await client.query({
      query: gql`
        query getLabelClass($id: ID!) {
          labelClass(where: { id: $id }) {
            id
          }
        }
      `,
      variables: {
        id,
      },
    });

    expect(queryResult.data.labelClass.id).toEqual(labelClassId);
  });

  test("Query labelClasses", async () => {
    const id1 = await createLabelClass({
      name: "labelClass1",
      color: "#ff0000",
    });
    incrementMockedDate(1);
    const id0 = await createLabelClass({
      name: "labelClass0",
      color: "#ff0000",
    });
    incrementMockedDate(1);
    const id2 = await createLabelClass({
      name: "labelClass2",
      color: "#ff0000",
    });

    const queryResult = await client.query({
      query: gql`
        query {
          labelClasses {
            id
          }
        }
      `,
    });

    expect(queryResult.data.labelClasses.length).toEqual(3);
    expect(
      queryResult.data.labelClasses.map(
        (labelClasses: { id: string }) => labelClasses.id
      )
    ).toEqual([id1, id0, id2]);
  });

  test("Querying paginated labelClasses", async () => {
    await createLabelClass({
      name: "labelClass1",
      color: "#ff0000",
    });
    incrementMockedDate(1);
    const id0 = await createLabelClass({
      name: "labelClass0",
      color: "#ff0000",
    });
    incrementMockedDate(1);
    const id2 = await createLabelClass({
      name: "labelClass2",
      color: "#ff0000",
    });
    incrementMockedDate(1);
    await createLabelClass({
      name: "labelClass3",
      color: "#ff0000",
    });

    const queryResult = await client.query({
      query: gql`
        query {
          labelClasses(first: 2, skip: 1) {
            id
          }
        }
      `,
    });

    expect(queryResult.data.labelClasses.length).toEqual(2);
    expect(
      queryResult.data.labelClasses.map(
        (labelClass: { id: string }) => labelClass.id
      )
    ).toEqual([id0, id2]);
  });

  test("Querying a labelClass with labels", async () => {
    const labelClassId = await createLabelClass({
      name: "some labelClass",
      color: "#ff0000",
    });

    await createLabel(labelClassId, 2);
    incrementMockedDate(1);
    await createLabel(labelClassId, 1);

    const queryResult = await client.query({
      query: gql`
        query getLabelClass($id: ID!) {
          labelClass(where: { id: $id }) {
            id
            labels {
              x
            }
          }
        }
      `,
      variables: {
        id: labelClassId,
      },
    });

    // labels should show in the right order
    expect(
      queryResult.data.labelClass.labels.map((l: { x: number }) => l.x)
    ).toEqual([2, 1]);
  });
});

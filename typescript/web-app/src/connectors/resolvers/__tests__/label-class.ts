import { incrementMockedDate } from "@labelflow/dev-utils/mockdate";
import gql from "graphql-tag";
// eslint-disable-next-line import/no-extraneous-dependencies
import { mocked } from "ts-jest/utils";
import probe from "probe-image-size";
import { client } from "../../apollo-client-schema";
import { setupTestsWithLocalDatabase } from "../../../utils/setup-local-db-tests";

setupTestsWithLocalDatabase();

jest.mock("probe-image-size");
const mockedProbeSync = mocked(probe.sync);
const testProjectId = "test project id";

const createLabelClass = async (data: {
  name: string;
  color: string;
  projectId: string;
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

const createLabel = async (
  labelClassId: string,
  x: number,
  projectId: string = testProjectId
) => {
  mockedProbeSync.mockReturnValue({
    width: 42,
    height: 36,
    mime: "image/jpeg",
    length: 1000,
    hUnits: "px",
    wUnits: "px",
    url: "https://example.com/image.jpeg",
    type: "jpg",
  });

  const {
    data: {
      createImage: { id: imageId },
    },
  } = await client.mutate({
    mutation: gql`
      mutation createImage($file: Upload!, $name: String!, $projectId: ID!) {
        createImage(data: { name: $name, file: $file, projectId: $projectId }) {
          id
        }
      }
    `,
    variables: {
      file: new Blob(),
      name: "someImageName",
      projectId,
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
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [x, 0],
              [x + 1, 0],
              [x + 1, 1],
              [x, 1],
              [x, 0],
            ],
          ],
        },
      },
    },
  });
};

const createProject = async (
  name: string,
  projectId: string = testProjectId
) => {
  return client.mutate({
    mutation: gql`
      mutation createProject($projectId: String, $name: String!) {
        createProject(data: { id: $projectId, name: $name }) {
          id
          name
        }
      }
    `,
    variables: {
      name,
      projectId,
    },
    fetchPolicy: "no-cache",
  });
};

describe("LabelClass resolver test suite", () => {
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
      projectId: "a project id",
    });

    const queryResult = await client.query({
      query: gql`
        query getLabelClass($id: ID!) {
          labelClass(where: { id: $id }) {
            id
            name
            color
            projectId
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
        projectId: "a project id",
      })
    );
  });

  test("Create labelClass with an ID", async () => {
    const labelClassId = "a custom id";
    const id = await createLabelClass({
      id: labelClassId,
      name: "toto",
      color: "#ff0000",
      projectId: "a project id",
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

  test("should delete a label class", async () => {
    const labelId = await createLabelClass({
      name: "toto",
      color: "#ff0000",
      projectId: "a project id",
    });

    client.mutate({
      mutation: gql`
        mutation deleteLabelClass($id: ID!) {
          deleteLabelClass(where: { id: $id }) {
            id
          }
        }
      `,
      variables: {
        id: labelId,
      },
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
        id: labelId,
      },
    });

    expect(queryResult.data.labelClasses).not.toBeDefined();
  });

  test("should throw when the label class to delete doesn't exist", () => {
    return expect(
      client.mutate({
        mutation: gql`
          mutation deleteLabelClass($id: ID!) {
            deleteLabelClass(where: { id: $id }) {
              id
            }
          }
        `,
        variables: {
          id: "id-of-a-label-that-doesnt-exist",
        },
      })
    ).rejects.toThrow("No labelClass with such id");
  });

  test("Query labelClasses", async () => {
    const id1 = await createLabelClass({
      name: "labelClass1",
      color: "#ff0000",
      projectId: "a project id",
    });
    incrementMockedDate(1);
    const id0 = await createLabelClass({
      name: "labelClass0",
      color: "#ff0000",
      projectId: "a project id",
    });
    incrementMockedDate(1);
    const id2 = await createLabelClass({
      name: "labelClass2",
      color: "#ff0000",
      projectId: "a project id",
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
      projectId: "a project id",
    });
    incrementMockedDate(1);
    const id0 = await createLabelClass({
      name: "labelClass0",
      color: "#ff0000",
      projectId: "a project id",
    });
    incrementMockedDate(1);
    const id2 = await createLabelClass({
      name: "labelClass2",
      color: "#ff0000",
      projectId: "a project id",
    });
    incrementMockedDate(1);
    await createLabelClass({
      name: "labelClass3",
      color: "#ff0000",
      projectId: "a project id",
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

  it("should query a labelClass with labels", async () => {
    await createProject("Test project", "a project id");

    const labelClassId = await createLabelClass({
      name: "some labelClass",
      color: "#ff0000",
      projectId: "a project id",
    });

    await createLabel(labelClassId, 2, "a project id");
    incrementMockedDate(1);
    await createLabel(labelClassId, 1, "a project id");

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

  it("should query label classes linked to a project", async () => {
    const labelClassId2 = await createLabelClass({
      name: "second labelClass",
      color: "#ff0000",
      projectId: "project 1",
    });
    incrementMockedDate(1);
    const labelClassId1 = await createLabelClass({
      name: "first labelClass",
      color: "#ff0000",
      projectId: "project 1",
    });
    incrementMockedDate(1);
    await createLabelClass({
      name: "other first labelClass",
      color: "#ff0000",
      projectId: "project 2",
    });

    const queryResult = await client.query({
      query: gql`
        query {
          labelClasses(where: { projectId: "project 1" }) {
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
    ).toEqual([labelClassId2, labelClassId1]);
  });

  it("It should returns the correct count of labelClasses", async () => {
    await Promise.all([
      createLabelClass({
        name: "first labelClass",
        color: "#ff0000",
        projectId: "project 1",
      }),
      createLabelClass({
        name: "second labelClass",
        color: "#ff0000",
        projectId: "project 2",
      }),
      createLabelClass({
        name: "third labelClass",
        color: "#ff0000",
        projectId: "project 2",
      }),
    ]);

    const queryResult = await client.query({
      query: gql`
        query getLabelClass {
          labelClassesAggregates {
            totalCount
          }
        }
      `,
    });

    expect(queryResult.data.labelClassesAggregates.totalCount).toEqual(3);
  });
});

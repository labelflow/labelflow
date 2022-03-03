import { gql } from "@apollo/client";
import { v4 as uuidV4 } from "uuid";
import { client, user } from "../../dev/apollo-client";
import { getPrismaClient } from "../../prisma-client";
import {
  createDataset,
  createLabelClass,
  createWorkspace,
} from "../../utils/tests";

// @ts-ignore
fetch.disableFetchMocks();

const testUser1Id = uuidV4();
const testUser2Id = uuidV4();
const testDatasetId = uuidV4();
const testLabelClassId = uuidV4();

const DELETE_LABEL_CLASS_TEST = gql`
  mutation deleteLabelClassTest($id: ID!) {
    deleteLabelClass(where: { id: $id }) {
      id
    }
  }
`;

describe("Access control for label-class", () => {
  beforeAll(async () => {
    await (
      await getPrismaClient()
    ).user.create({ data: { id: testUser1Id, name: "test-user-1" } });
    await (
      await getPrismaClient()
    ).user.create({ data: { id: testUser2Id, name: "test-user-2" } });
  });

  beforeEach(async () => {
    user.id = testUser1Id;
    await (await getPrismaClient()).membership.deleteMany({});
    await (await getPrismaClient()).workspace.deleteMany({});
    await createWorkspace({ name: "My workspace" });
    await createDataset("My dataset", "my-workspace", testDatasetId);
  });

  afterAll(async () => {
    // Needed to avoid having the test process running indefinitely after the test suite has been run
    await (await getPrismaClient()).$disconnect();
  });

  const labelClassData = {
    datasetId: testDatasetId,
    id: testLabelClassId,
    color: "#0000FF",
    name: "test class",
  };

  it("allows to create a label class to a user that has access to the dataset", async () => {
    const createdLabelClassId = await createLabelClass(labelClassData);
    expect(createdLabelClassId).toEqual(testLabelClassId);
  });

  it("fails to create a label class when the user does not have access to the dataset", async () => {
    user.id = testUser2Id;
    await expect(() => createLabelClass(labelClassData)).rejects.toThrow(
      `User not authorized to access dataset`
    );
  });

  it("allows to get a label class to the user that created it", async () => {
    const createdLabelClassId = await createLabelClass(labelClassData);
    const { data } = await client.query({
      query: gql`
        query labelClass($id: ID!) {
          labelClass(where: { id: $id }) {
            id
            name
            labels {
              id
            }
            dataset {
              id
            }
          }
        }
      `,
      variables: { id: createdLabelClassId },
      fetchPolicy: "no-cache",
    });
    expect(data.labelClass.name).toEqual(labelClassData.name);
    expect(data.labelClass.dataset.id).toEqual(testDatasetId);
    expect(data.labelClass.labels.length).toEqual(0);
  });

  it("fails to get a label class if the user does not have access to it", async () => {
    const createdLabelClassId = await createLabelClass(labelClassData);
    user.id = testUser2Id;
    await expect(() =>
      client.query({
        query: gql`
          query labelClass($id: ID!) {
            labelClass(where: { id: $id }) {
              id
              name
            }
          }
        `,
        variables: { id: createdLabelClassId },
        fetchPolicy: "no-cache",
      })
    ).rejects.toThrow(`User not authorized to access label class`);
  });

  it("gives the amount of label classes the user has access to", async () => {
    await createLabelClass(labelClassData);
    await createLabelClass({
      ...labelClassData,
      id: undefined,
      name: `${labelClassData.name} 2`,
    });
    await createLabelClass({
      ...labelClassData,
      id: undefined,
      name: `${labelClassData.name} 3`,
    });
    const { data } = await client.query({
      query: gql`
        query labelClasses {
          labelClasses {
            id
          }
          labelClassesAggregates {
            totalCount
          }
        }
      `,
      fetchPolicy: "no-cache",
    });
    expect(data.labelClassesAggregates.totalCount).toEqual(3);
    expect(data.labelClasses.length).toEqual(3);
  });

  it("returns zero elements if user does not have access to any label class", async () => {
    await createLabelClass(labelClassData);
    await createLabelClass({
      ...labelClassData,
      id: undefined,
      name: `${labelClassData.name} 2`,
    });
    await createLabelClass({
      ...labelClassData,
      id: undefined,
      name: `${labelClassData.name} 3`,
    });
    user.id = testUser2Id;
    const { data } = await client.query({
      query: gql`
        query labelClasses {
          labelClasses {
            id
          }
          labelClassesAggregates {
            totalCount
          }
        }
      `,
      fetchPolicy: "no-cache",
    });
    expect(data.labelClassesAggregates.totalCount).toEqual(0);
    expect(data.labelClasses.length).toEqual(0);
  });

  it("allows to update a label class to a user that has access to it", async () => {
    const createdLabelClassId = await createLabelClass(labelClassData);
    await client.query({
      query: gql`
        mutation updateLabelClass($id: ID!, $data: LabelClassUpdateInput!) {
          updateLabelClass(where: { id: $id }, data: $data) {
            id
          }
        }
      `,
      variables: {
        id: createdLabelClassId,
        data: {
          name: "Changed name",
        },
      },
      fetchPolicy: "no-cache",
    });
    const { data } = await client.query({
      query: gql`
        query labelClass($id: ID!) {
          labelClass(where: { id: $id }) {
            id
            name
          }
        }
      `,
      variables: { id: createdLabelClassId },
      fetchPolicy: "no-cache",
    });

    expect(data.labelClass.name).toEqual("Changed name");
  });

  it("fails to update a label class when the user does not have access to it", async () => {
    const createdLabelClassId = await createLabelClass(labelClassData);
    user.id = testUser2Id;
    await expect(() =>
      client.query({
        query: gql`
          mutation updateLabelClass($id: ID!, $data: LabelClassUpdateInput!) {
            updateLabelClass(where: { id: $id }, data: $data) {
              id
            }
          }
        `,
        variables: {
          id: createdLabelClassId,
          data: {
            name: "Changed name",
          },
        },
        fetchPolicy: "no-cache",
      })
    ).rejects.toThrow(`User not authorized to access label class`);
  });

  it("allows to delete a label class to a user that has access to it", async () => {
    const createdLabelClassId = await createLabelClass(labelClassData);
    await client.query({
      query: DELETE_LABEL_CLASS_TEST,
      variables: {
        id: createdLabelClassId,
      },
      fetchPolicy: "no-cache",
    });
    const { data } = await client.query({
      query: gql`
        query labelClasses {
          labelClassesAggregates {
            totalCount
          }
        }
      `,
      fetchPolicy: "no-cache",
    });
    expect(data.labelClassesAggregates.totalCount).toEqual(0);
  });

  it("fails to delete a label class to a user that has access to it", async () => {
    const createdLabelClassId = await createLabelClass(labelClassData);
    user.id = testUser2Id;
    await expect(() =>
      client.query({
        query: DELETE_LABEL_CLASS_TEST,
        variables: {
          id: createdLabelClassId,
        },
        fetchPolicy: "no-cache",
      })
    ).rejects.toThrow(`User not authorized to access label class`);
  });
});

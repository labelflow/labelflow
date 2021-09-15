import { incrementMockedDate } from "@labelflow/dev-utils/mockdate";
import { gql } from "@apollo/client";
import { probeImage } from "@labelflow/common-resolvers/src/utils/probe-image";
import { client } from "../../apollo-client/schema-client";
import { setupTestsWithLocalDatabase } from "../../../utils/setup-local-db-tests";

setupTestsWithLocalDatabase();

jest.mock("@labelflow/common-resolvers/src/utils/probe-image");
const mockedProbeSync = probeImage as jest.Mock;
const testDatasetId = "test dataset id";

const createLabelClass = async (data: {
  name: string;
  color: string;
  datasetId: string;
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
  datasetId: string = testDatasetId,
  labelId: string = "myLabelId"
) => {
  mockedProbeSync.mockReturnValue({
    width: 42,
    height: 36,
    mime: "image/jpeg",
  });

  const {
    data: {
      createImage: { id: imageId },
    },
  } = await client.mutate({
    mutation: gql`
      mutation createImage($file: Upload!, $name: String!, $datasetId: ID!) {
        createImage(data: { name: $name, file: $file, datasetId: $datasetId }) {
          id
        }
      }
    `,
    variables: {
      file: new Blob(),
      name: "someImageName",
      datasetId,
    },
  });
  return await client.mutate({
    mutation: gql`
      mutation createLabel($data: LabelCreateInput!) {
        createLabel(data: $data) {
          id
        }
      }
    `,
    variables: {
      data: {
        id: labelId,
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

const createDataset = async (
  name: string,
  datasetId: string = testDatasetId
) => {
  return await client.mutate({
    mutation: gql`
      mutation createDataset($datasetId: String, $name: String!) {
        createDataset(
          data: { id: $datasetId, name: $name, workspaceSlug: "local" }
        ) {
          id
          name
        }
      }
    `,
    variables: {
      name,
      datasetId,
    },
    fetchPolicy: "no-cache",
  });
};

describe("LabelClass resolver test suite", () => {
  test("Query labelClass when database is empty", async () => {
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

  it("should fail labelClass creation when there is a no dataset with the given id", async () => {
    expect.assertions(1);
    await expect(
      createLabelClass({
        name: "toto",
        color: "#ff0000",
        datasetId: testDatasetId,
      })
    ).rejects.toThrow("The dataset id test dataset id doesn't exist.");
  });

  it("should create labelClass when there is a dataset", async () => {
    await createDataset("Test dataset");

    const id = await createLabelClass({
      name: "toto",
      color: "#ff0000",
      datasetId: testDatasetId,
    });

    const queryResult = await client.query({
      query: gql`
        query getLabelClass($id: ID!) {
          labelClass(where: { id: $id }) {
            id
            name
            color
            datasetId
          }
        }
      `,
      variables: {
        id,
      },
      fetchPolicy: "no-cache",
    });

    expect(queryResult.data.labelClass).toEqual(
      expect.objectContaining({
        id,
        name: "toto",
        color: "#ff0000",
        datasetId: testDatasetId,
      })
    );
  });

  it("should increment labelClass index chronologically", async () => {
    await createDataset("Test dataset");

    const id0 = await createLabelClass({
      name: "toto",
      color: "#ff0000",
      datasetId: testDatasetId,
    });
    incrementMockedDate(1);
    const id1 = await createLabelClass({
      name: "tata",
      color: "#00ff00",
      datasetId: testDatasetId,
    });

    const queryResult0 = await client.query({
      query: gql`
        query getLabelClass($id: ID!) {
          labelClass(where: { id: $id }) {
            id
            index
            name
            color
            datasetId
          }
        }
      `,
      variables: {
        id: id0,
      },
      fetchPolicy: "no-cache",
    });

    expect(queryResult0.data.labelClass).toEqual(
      expect.objectContaining({
        id: id0,
        index: 0,
        name: "toto",
        color: "#ff0000",
        datasetId: testDatasetId,
      })
    );

    const queryResult1 = await client.query({
      query: gql`
        query getLabelClass($id: ID!) {
          labelClass(where: { id: $id }) {
            id
            index
            name
            color
            datasetId
          }
        }
      `,
      variables: {
        id: id1,
      },
      fetchPolicy: "no-cache",
    });

    expect(queryResult1.data.labelClass).toEqual(
      expect.objectContaining({
        id: id1,
        index: 1,
        name: "tata",
        color: "#00ff00",
        datasetId: testDatasetId,
      })
    );
  });

  it("should create labelClass with an ID", async () => {
    await createDataset("Test dataset");

    const labelClassId = "a custom id";
    const id = await createLabelClass({
      id: labelClassId,
      name: "toto",
      color: "#ff0000",
      datasetId: testDatasetId,
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

  it("should update a label class", async () => {
    await createDataset("Test dataset");

    const labelId = await createLabelClass({
      name: "toto",
      color: "#ff0000",
      datasetId: testDatasetId,
    });

    await client.mutate({
      mutation: gql`
        mutation updateLabelClass($id: ID!) {
          updateLabelClass(
            where: { id: $id }
            data: { name: "tata", color: "#0000ff" }
          ) {
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
            name
            color
          }
        }
      `,
      variables: {
        id: labelId,
      },
    });

    expect(queryResult.data.labelClass.name).toEqual("tata");
    expect(queryResult.data.labelClass.color).toEqual("#0000ff");
  });

  it("should throw when the label class to update doesn't exist", () => {
    return expect(
      client.mutate({
        mutation: gql`
          mutation updateLabelClass($id: ID!) {
            updateLabelClass(where: { id: $id }, data: { name: "tata" }) {
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

  it("should reorder labelClasses indices", async () => {
    await createDataset("Test dataset");

    const id0 = await createLabelClass({
      name: "toto",
      color: "#ff0000",
      datasetId: testDatasetId,
    });
    incrementMockedDate(1);
    const id1 = await createLabelClass({
      name: "tata",
      color: "#00ff00",
      datasetId: testDatasetId,
    });
    incrementMockedDate(1);
    const id2 = await createLabelClass({
      name: "tutu",
      color: "#0000ff",
      datasetId: testDatasetId,
    });

    const getLabelClassIndex = async (id: string) =>
      (
        await client.query({
          query: gql`
            query getLabelClass($id: ID!) {
              labelClass(where: { id: $id }) {
                id
                index
                name
                color
                datasetId
              }
            }
          `,
          variables: {
            id,
          },
          fetchPolicy: "no-cache",
        })
      ).data.labelClass.index;

    // Nominal/default configuration
    expect(await getLabelClassIndex(id0)).toEqual(0);
    expect(await getLabelClassIndex(id1)).toEqual(1);
    expect(await getLabelClassIndex(id2)).toEqual(2);

    await client.mutate({
      mutation: gql`
        mutation reorderLabelClasses($id: ID!, $index: Int!) {
          reorderLabelClass(where: { id: $id }, data: { index: $index }) {
            id
          }
        }
      `,
      variables: {
        id: id2,
        index: 0,
      },
    });
    // Now the third labelClass is at position 0, and so on
    expect(await getLabelClassIndex(id0)).toEqual(1);
    expect(await getLabelClassIndex(id1)).toEqual(2);
    expect(await getLabelClassIndex(id2)).toEqual(0);
  });

  it("should delete a label class and update index", async () => {
    await createDataset("Test dataset");

    const labelClassId = await createLabelClass({
      name: "toto",
      color: "#ff0000",
      datasetId: testDatasetId,
    });
    incrementMockedDate(1);
    // The following labelClass will have index 1
    const labelClassId1 = await createLabelClass({
      name: "tata",
      color: "#ff0000",
      datasetId: testDatasetId,
    });
    await createLabel(labelClassId, 2, testDatasetId);
    await client.mutate({
      mutation: gql`
        mutation deleteLabelClass($id: ID!) {
          deleteLabelClass(where: { id: $id }) {
            id
          }
        }
      `,
      variables: {
        id: labelClassId,
      },
    });
    const queryResultLabelClass = await client.query({
      query: gql`
        query getLabelClass($id: ID!) {
          labelClass(where: { id: $id }) {
            index
            datasetId
          }
        }
      `,
      variables: {
        id: labelClassId1,
      },
      fetchPolicy: "no-cache",
    });
    // Check that this labelClass now have index 0
    expect(queryResultLabelClass.data?.labelClass?.index).toEqual(0);
    const queryResult = client.query({
      query: gql`
        query getLabelClass($id: ID!) {
          labelClass(where: { id: $id }) {
            id
          }
        }
      `,
      variables: {
        id: labelClassId,
      },
    });
    return expect(queryResult).rejects.toThrow("No labelClass with such id");
  });
  it("should set all the labels linked to label class to labelClassId none when the class is deleted", async () => {
    await createDataset("Test dataset");

    const labelClassId = await createLabelClass({
      name: "toto",
      color: "#ff0000",
      datasetId: testDatasetId,
    });
    await createLabel(labelClassId, 2, testDatasetId);
    const labelQueryResultBeforeDelete = await client.query({
      query: gql`
        query getLabelData($id: ID!) {
          label(where: { id: $id }) {
            id
            labelClass {
              id
            }
          }
        }
      `,
      variables: {
        id: "myLabelId",
      },
    });
    expect(labelQueryResultBeforeDelete.data.label.labelClass.id).toBe(
      labelClassId
    );
    await client.mutate({
      mutation: gql`
        mutation deleteLabelClass($id: ID!) {
          deleteLabelClass(where: { id: $id }) {
            id
          }
        }
      `,
      variables: {
        id: labelClassId,
      },
    });
    const labelQueryResult = await client.query({
      query: gql`
        query getLabelData($id: ID!) {
          label(where: { id: $id }) {
            id
            labelClass {
              id
            }
          }
        }
      `,
      variables: {
        id: "myLabelId",
      },
      fetchPolicy: "no-cache",
    });
    expect(labelQueryResult.data.label.labelClass).toBeNull();
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

  it("should query labelClasses ignoring linked datasets", async () => {
    await createDataset("Test dataset 1", "dataset 1");

    const id1 = await createLabelClass({
      name: "labelClass1",
      color: "#ff0000",
      datasetId: "dataset 1",
    });
    incrementMockedDate(1);
    const id0 = await createLabelClass({
      name: "labelClass0",
      color: "#ff0000",
      datasetId: "dataset 1",
    });
    incrementMockedDate(1);
    const id2 = await createLabelClass({
      name: "labelClass2",
      color: "#ff0000",
      datasetId: "dataset 1",
    });

    const queryResult = await client.query({
      query: gql`
        query {
          labelClasses(where: { datasetId: "dataset 1" }) {
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

  it("should query paginated labelClasses ignoring linked datasets", async () => {
    await createDataset("Test dataset 1", "dataset 1");

    await createLabelClass({
      name: "labelClass0",
      color: "#ff0000",
      datasetId: "dataset 1",
    });
    incrementMockedDate(1);
    const id0 = await createLabelClass({
      name: "labelClass1",
      color: "#ff0000",
      datasetId: "dataset 1",
    });
    incrementMockedDate(1);
    const id1 = await createLabelClass({
      name: "labelClass2",
      color: "#ff0000",
      datasetId: "dataset 1",
    });
    incrementMockedDate(1);
    await createLabelClass({
      name: "labelClass3",
      color: "#ff0000",
      datasetId: "dataset 1",
    });

    const queryResult = await client.query({
      query: gql`
        query {
          labelClasses(first: 2, skip: 1, where: { datasetId: "dataset 1" }) {
            id
            name
            index
          }
        }
      `,
    });

    expect(queryResult.data.labelClasses.length).toEqual(2);
    expect(
      queryResult.data.labelClasses.map(
        (labelClass: { id: string }) => labelClass.id
      )
    ).toEqual([id0, id1]);
  });

  it("should query a labelClass with labels", async () => {
    await createDataset("Test dataset", "a dataset id");

    const labelClassId = await createLabelClass({
      name: "some labelClass",
      color: "#ff0000",
      datasetId: "a dataset id",
    });

    await createLabel(labelClassId, 2, "a dataset id", "myLabelId1");
    incrementMockedDate(1);
    await createLabel(labelClassId, 1, "a dataset id", "myLabelId2");

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

  it("should query label classes linked to a dataset", async () => {
    await createDataset("Test dataset 1", "dataset 1");
    await createDataset("Test dataset 2", "dataset 2");

    const labelClassId2 = await createLabelClass({
      name: "second labelClass",
      color: "#ff0000",
      datasetId: "dataset 1",
    });
    incrementMockedDate(1);
    const labelClassId1 = await createLabelClass({
      name: "first labelClass",
      color: "#ff0000",
      datasetId: "dataset 1",
    });
    incrementMockedDate(1);
    await createLabelClass({
      name: "other first labelClass",
      color: "#ff0000",
      datasetId: "dataset 2",
    });

    const queryResult = await client.query({
      query: gql`
        query {
          labelClasses(where: { datasetId: "dataset 1" }) {
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

  it("should returns the correct count of labelClasses", async () => {
    await createDataset("Test dataset 1", "dataset 1");
    await createDataset("Test dataset 2", "dataset 2");

    await Promise.all([
      createLabelClass({
        name: "first labelClass",
        color: "#ff0000",
        datasetId: "dataset 1",
      }),
      createLabelClass({
        name: "second labelClass",
        color: "#ff0000",
        datasetId: "dataset 2",
      }),
      createLabelClass({
        name: "third labelClass",
        color: "#ff0000",
        datasetId: "dataset 2",
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

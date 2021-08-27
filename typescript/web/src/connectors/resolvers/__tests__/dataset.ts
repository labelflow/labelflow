import { gql } from "@apollo/client";
import { incrementMockedDate } from "@labelflow/dev-utils/mockdate";
import { probeImage } from "@labelflow/common-resolvers/src/utils/probe-image";
import { client } from "../../apollo-client/schema-client";
import { setupTestsWithLocalDatabase } from "../../../utils/setup-local-db-tests";

setupTestsWithLocalDatabase();

jest.mock("@labelflow/common-resolvers/src/utils/probe-image");
const mockedProbeSync = probeImage as jest.Mock;

const createDataset = async (name: string, datasetId?: string | null) => {
  return await client.mutate({
    mutation: gql`
      mutation createDataset($datasetId: String, $name: String!) {
        createDataset(data: { id: $datasetId, name: $name }) {
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

const updateDatasetWithImageLabelAndClass = async (datasetId: string) => {
  await client.mutate({
    mutation: gql`
      mutation createImage($data: ImageCreateInput!) {
        createImage(data: $data) {
          id
        }
      }
    `,
    variables: {
      data: {
        datasetId,
        file: new Blob(),
        id: "image-id",
      },
    },
  });

  await client.mutate({
    mutation: gql`
      mutation createLabel($data: LabelCreateInput) {
        createLabel(data: $data) {
          id
        }
      }
    `,
    variables: {
      data: {
        imageId: "image-id",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [0, 0],
              [42, 0],
              [42, 36],
              [0, 36],
              [0, 0],
            ],
          ],
        },
      },
    },
  });

  await client.mutate({
    mutation: gql`
      mutation createLabelClass($data: LabelClassCreateInput) {
        createLabelClass(data: $data) {
          id
        }
      }
    `,
    variables: {
      data: {
        datasetId,
        name: "my-label",
        color: "#ffffff",
      },
    },
  });
};

describe("Dataset resolver test suite", () => {
  test("Create dataset should return the dataset id", async () => {
    const name = "My new dataset";

    const mutationResult = await client.mutate({
      mutation: gql`
        mutation createDataset($name: String!) {
          createDataset(data: { name: $name }) {
            id
            name
          }
        }
      `,
      variables: {
        name,
      },
    });

    expect(mutationResult.data.createDataset.name).toEqual(name);
    expect(typeof mutationResult.data.createDataset.id).toEqual("string");
  });

  test("Creating a dataset should fail if the dataset name already exists", async () => {
    await createDataset("my dataset", "an-id");

    return expect(createDataset("my dataset", "an-other-id")).rejects.toThrow(
      /Could not create the dataset/
    );
  });

  test("Creating a dataset should fail if the dataset slug already exists", async () => {
    await createDataset("my dataset", "an-id");

    return expect(createDataset("My Dataset", "an-other-id")).rejects.toThrow(
      /Could not create the dataset/
    );
  });

  test("Create dataset should fail if the dataset name is empty", () => {
    return expect(createDataset("", "an-id")).rejects.toEqual(
      new Error("Could not create the dataset with an empty name")
    );
  });

  test("Create dataset with an id should return the same id", async () => {
    const name = "My new dataset";
    const datasetId = "some id";

    const mutationResult = await client.mutate({
      mutation: gql`
        mutation createDataset($datasetId: String, $name: String!) {
          createDataset(data: { id: $datasetId, name: $name }) {
            id
            name
          }
        }
      `,
      variables: {
        name,
        datasetId,
      },
    });

    expect(mutationResult.data.createDataset.name).toEqual(name);
    expect(mutationResult.data.createDataset.id).toEqual(datasetId);
  });

  test("Read dataset", async () => {
    const name = "My new dataset";
    const datasetId = "some id";
    await createDataset(name, datasetId);

    const queryResult = await client.query({
      query: gql`
        query getDataset($id: ID!) {
          dataset(where: { id: $id }) {
            id
            name
          }
        }
      `,
      variables: {
        id: datasetId,
      },
    });

    expect(queryResult.data.dataset).toEqual(
      expect.objectContaining({
        id: datasetId,
        name,
      })
    );
  });

  test("that it throws when looking for a dataset that doesn't exist", async () => {
    return expect(
      client.query({
        query: gql`
          query getDataset($id: ID!) {
            dataset(where: { id: $id }) {
              id
              name
            }
          }
        `,
        variables: {
          id: "a id that doesn't exist",
        },
      })
    ).rejects.toThrow(/No dataset with id/);
  });

  test("Read multiple datasets", async () => {
    await createDataset("dataset 1");
    await createDataset("dataset 2");

    const queryResults = await client.query({
      query: gql`
        query getDatasets {
          datasets {
            id
            name
          }
        }
      `,
    });
    expect(queryResults.data.datasets).toHaveLength(2);
  });

  test("Read multiple datasets in order", async () => {
    await createDataset("dataset 1");
    incrementMockedDate(1);
    await createDataset("dataset 2");

    const queryResults = await client.query({
      query: gql`
        query getDatasets {
          datasets {
            id
            name
          }
        }
      `,
    });
    expect(queryResults.data.datasets[0].name).toEqual("dataset 1");
    expect(queryResults.data.datasets[1].name).toEqual("dataset 2");
  });

  test("Should return no datasets when database is empty", async () => {
    const queryResults = await client.query({
      query: gql`
        query getDatasets {
          datasets {
            id
            name
          }
        }
      `,
    });
    expect(queryResults.data.datasets).toHaveLength(0);
  });

  test("Read paginated datasets", async () => {
    await createDataset("dataset 1");
    incrementMockedDate(1);
    await createDataset("dataset 2");
    incrementMockedDate(1);
    await createDataset("dataset 3");

    const queryResults = await client.query({
      query: gql`
        query {
          datasets(first: 2) {
            id
            name
          }
        }
      `,
    });
    expect(queryResults.data.datasets).toHaveLength(2);
    expect(queryResults.data.datasets[0].name).toEqual("dataset 1");
    expect(queryResults.data.datasets[1].name).toEqual("dataset 2");
  });

  test("Read paginated datasets with skip", async () => {
    await createDataset("dataset 1");
    incrementMockedDate(1);
    await createDataset("dataset 2");
    incrementMockedDate(1);
    await createDataset("dataset 3");

    const queryResults = await client.query({
      query: gql`
        query {
          datasets(first: 2, skip: 1) {
            id
            name
          }
        }
      `,
    });
    expect(queryResults.data.datasets).toHaveLength(2);
    expect(queryResults.data.datasets[0].name).toEqual("dataset 2");
    expect(queryResults.data.datasets[1].name).toEqual("dataset 3");
  });

  test("should delete a dataset and its content", async () => {
    mockedProbeSync.mockReturnValue({
      width: 42,
      height: 36,
      mime: "image/jpeg",
    });
    const name = "My new dataset";
    const datasetId = "some id";
    await createDataset(name, datasetId);
    await updateDatasetWithImageLabelAndClass(datasetId);

    const mutationResult = await client.mutate({
      mutation: gql`
        mutation deleteDataset($id: ID!) {
          deleteDataset(where: { id: $id }) {
            id
            name
          }
        }
      `,
      variables: {
        id: datasetId,
      },
    });

    expect(mutationResult.data.deleteDataset.name).toEqual(name);

    const labels = await client.query({
      query: gql`
        query {
          labelsAggregates {
            totalCount
          }
        }
      `,
    });

    const labelClasses = await client.query({
      query: gql`
        query {
          labelClassesAggregates {
            totalCount
          }
        }
      `,
    });

    const images = await client.query({
      query: gql`
        query {
          imagesAggregates {
            totalCount
          }
        }
      `,
    });

    expect(labels.data.labelsAggregates.totalCount).toEqual(0);
    expect(labelClasses.data.labelClassesAggregates.totalCount).toEqual(0);
    expect(images.data.imagesAggregates.totalCount).toEqual(0);

    return expect(
      client.query({
        query: gql`
          query getDataset($id: ID!) {
            dataset(where: { id: $id }) {
              id
              name
            }
          }
        `,
        variables: {
          id: datasetId,
        },
      })
    ).rejects.toThrow(/No dataset with id/);
  });

  test("should throw an error if the dataset to delete does not exist", () => {
    return expect(
      client.mutate({
        mutation: gql`
          mutation deleteDataset($id: ID!) {
            deleteDataset(where: { id: $id }) {
              id
              name
            }
          }
        `,
        variables: {
          id: "not existing dataset id",
        },
      })
    ).rejects.toThrow(/No dataset with id/);
  });

  test("Should update a dataset with a new name", async () => {
    const name = "My new dataset";
    const datasetId = "some id";
    await createDataset(name, datasetId);

    const mutationResult = await client.mutate({
      mutation: gql`
        mutation updateDataset($id: ID!, $data: DatasetUpdateInput!) {
          updateDataset(where: { id: $id }, data: $data) {
            id
            name
          }
        }
      `,
      variables: {
        id: datasetId,
        data: { name: "My new dataset new name" },
      },
    });

    expect(mutationResult.data.updateDataset).toEqual(
      expect.objectContaining({
        id: datasetId,
        name: "My new dataset new name",
      })
    );

    const queryResult = await client.query({
      query: gql`
        query getDataset($id: ID!) {
          dataset(where: { id: $id }) {
            id
            name
          }
        }
      `,
      variables: {
        id: datasetId,
      },
    });

    expect(queryResult.data.dataset).toEqual(
      expect.objectContaining({
        id: datasetId,
        name: "My new dataset new name",
      })
    );
  });

  test("Should throw when updating a dataset with an existing name", async () => {
    const name1 = "My new dataset";
    const name2 = "My other dataset";
    const datasetId1 = "id1";
    const datasetId2 = "id2";
    await createDataset(name1, datasetId1);
    await createDataset(name2, datasetId2);

    const updateDatasetName = () =>
      client.mutate({
        mutation: gql`
          mutation updateDataset($id: ID!, $data: DatasetUpdateInput!) {
            updateDataset(where: { id: $id }, data: $data) {
              id
              name
            }
          }
        `,
        variables: {
          id: datasetId2,
          data: { name: name1 },
        },
      });

    return expect(updateDatasetName).rejects.toEqual(
      new Error("Could not update the dataset")
    );
  });

  test("Should throw when updating a dataset with an existing slug", async () => {
    const name1 = "My New Dataset";
    const name2 = "My other dataset";
    const datasetId1 = "id1";
    const datasetId2 = "id2";
    await createDataset(name1, datasetId1);
    await createDataset(name2, datasetId2);

    const updateDatasetName = () =>
      client.mutate({
        mutation: gql`
          mutation updateDataset($id: ID!, $data: DatasetUpdateInput!) {
            updateDataset(where: { id: $id }, data: $data) {
              id
              name
            }
          }
        `,
        variables: {
          id: datasetId2,
          data: { name: "my new dataset" },
        },
      });

    return expect(updateDatasetName).rejects.toEqual(
      new Error("Could not update the dataset")
    );
  });

  test("Should throw when trying to update a dataset that doesn't exist", () => {
    return expect(
      client.mutate({
        mutation: gql`
          mutation updateDataset($id: ID!, $data: DatasetUpdateInput!) {
            updateDataset(where: { id: $id }, data: $data) {
              id
              name
            }
          }
        `,
        variables: {
          id: "id that doesn't exists",
          data: { name: "My new dataset new name" },
        },
      })
    ).rejects.toThrow(/No dataset with id/);
  });

  test("Find dataset by name", async () => {
    const name = "My new dataset";
    const datasetId = "some id";
    await createDataset(name, datasetId);

    const queryResult = await client.query({
      query: gql`
        query getDataset($name: String!) {
          dataset(where: { name: $name }) {
            id
            name
          }
        }
      `,
      variables: {
        name,
      },
    });

    expect(queryResult.data.dataset).toEqual(
      expect.objectContaining({
        id: datasetId,
        name,
      })
    );
  });

  test("Find dataset by slug", async () => {
    const name = "My new dataset";
    const datasetId = "some id";
    await createDataset(name, datasetId);

    const queryResult = await client.query({
      query: gql`
        query getDataset($slug: String!) {
          dataset(where: { slug: $slug }) {
            id
            name
          }
        }
      `,
      variables: {
        slug: "my-new-dataset",
      },
    });

    expect(queryResult.data.dataset).toEqual(
      expect.objectContaining({
        id: datasetId,
        name,
      })
    );
  });

  it("should list a dataset images, label classes and labels", async () => {
    mockedProbeSync.mockReturnValue({
      width: 42,
      height: 36,
      mime: "image/jpeg",
    });

    const getDatasetData = async (datasetId: string) => {
      return await client.query({
        query: gql`
          query getDatasetData($id: ID!) {
            dataset(where: { id: $id }) {
              id
              images {
                id
              }
              labels {
                id
              }
              labelClasses {
                id
              }
            }
          }
        `,
        variables: {
          id: datasetId,
        },
        fetchPolicy: "network-only",
      });
    };

    const expectedResults = (queryResult: any, count: number) => {
      expect(queryResult.data.dataset.images.length).toEqual(count);
      expect(queryResult.data.dataset.labels.length).toEqual(count);
      expect(queryResult.data.dataset.labelClasses.length).toEqual(count);
    };

    const datasetId = "some id";
    const otherId = "some other id";

    createDataset("My new dataset", datasetId);
    createDataset("My other dataset", otherId);

    const initialCountQuery = await getDatasetData(datasetId);
    const otherInitialCountQuery = await getDatasetData(otherId);

    expectedResults(initialCountQuery, 0);
    expectedResults(otherInitialCountQuery, 0);

    await updateDatasetWithImageLabelAndClass(datasetId);

    const updateCountQuery = await getDatasetData(datasetId);
    const otherUpdateCountQuery = await getDatasetData(otherId);

    expectedResults(updateCountQuery, 1);
    expectedResults(otherUpdateCountQuery, 0);
  });

  it("should count a dataset images, label classes and labels", async () => {
    mockedProbeSync.mockReturnValue({
      width: 42,
      height: 36,
      mime: "image/jpeg",
    });

    const getDatasetCount = async (datasetId: string) => {
      return await client.query({
        query: gql`
          query getDatasetCounts($id: ID!) {
            dataset(where: { id: $id }) {
              id
              imagesAggregates {
                totalCount
              }
              labelsAggregates {
                totalCount
              }
              labelClassesAggregates {
                totalCount
              }
            }
          }
        `,
        variables: {
          id: datasetId,
        },
        fetchPolicy: "network-only",
      });
    };

    const expectedResults = (queryResult: any, count: number) => {
      expect(queryResult.data.dataset.imagesAggregates.totalCount).toEqual(
        count
      );
      expect(queryResult.data.dataset.labelsAggregates.totalCount).toEqual(
        count
      );
      expect(
        queryResult.data.dataset.labelClassesAggregates.totalCount
      ).toEqual(count);
    };

    const datasetId = "some id";
    const otherId = "some other id";

    createDataset("My new dataset", datasetId);
    createDataset("My other dataset", otherId);

    const initialCountQuery = await getDatasetCount(datasetId);
    const otherInitialCountQuery = await getDatasetCount(otherId);

    expectedResults(initialCountQuery, 0);
    expectedResults(otherInitialCountQuery, 0);

    await updateDatasetWithImageLabelAndClass(datasetId);

    const updateCountQuery = await getDatasetCount(datasetId);
    const otherUpdateCountQuery = await getDatasetCount(otherId);

    expectedResults(updateCountQuery, 1);
    expectedResults(otherUpdateCountQuery, 0);
  });

  test("Find dataset by name shortly after renaming it (bug that we noticed)", async () => {
    const name = "My old dataset";
    const newName = "My new dataset";
    const datasetId = "some id";
    await createDataset(name, datasetId);

    const queryResult1 = await client.query({
      query: gql`
        query getDataset($name: String!) {
          dataset(where: { name: $name }) {
            id
            name
          }
        }
      `,
      variables: {
        name,
      },
      fetchPolicy: "no-cache",
    });

    expect(queryResult1.data.dataset).toEqual(
      expect.objectContaining({
        id: datasetId,
        name,
      })
    );

    await client.mutate({
      mutation: gql`
        mutation updateDataset($id: ID, $name: String!) {
          updateDataset(where: { id: $id }, data: { name: $name }) {
            id
            name
          }
        }
      `,
      variables: {
        id: datasetId,
        name: newName,
      },
      fetchPolicy: "no-cache",
    });

    const queryResult2 = await client.query({
      query: gql`
        query getDataset($name: String!) {
          dataset(where: { name: $name }) {
            id
            name
          }
        }
      `,
      variables: {
        name: newName,
      },
      fetchPolicy: "no-cache",
    });

    expect(queryResult2.data.dataset).toEqual(
      expect.objectContaining({
        id: datasetId,
        name: newName,
      })
    );
  });
});

describe("Demo dataset mutation", () => {
  test("Should create a demo dataset named 'Tutorial dataset'", async () => {
    const demoDataset = await client.mutate({
      mutation: gql`
        mutation createDemoDataset {
          createDemoDataset {
            id
            name
          }
        }
      `,
    });
    expect(demoDataset?.data?.createDemoDataset?.name).toEqual(
      "Tutorial dataset"
    );
  });
  test("Should create a demo dataset with 4 images", async () => {
    const demoDataset = await client.mutate({
      mutation: gql`
        mutation createDemoDataset {
          createDemoDataset {
            id
            imagesAggregates {
              totalCount
            }
          }
        }
      `,
    });
    expect(
      demoDataset?.data?.createDemoDataset?.imagesAggregates?.totalCount
    ).toEqual(4);
  });
  test("Should create a demo dataset where the 3rd images already has labels", async () => {
    const demoDataset = await client.mutate({
      mutation: gql`
        mutation {
          createDemoDataset {
            id
            images {
              id
              labels {
                id
              }
            }
          }
        }
      `,
    });
    expect(
      demoDataset?.data?.createDemoDataset?.images?.[2]?.labels?.length
    ).toEqual(10);
  });
});

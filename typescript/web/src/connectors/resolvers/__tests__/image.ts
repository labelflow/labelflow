import { incrementMockedDate } from "@labelflow/dev-utils/mockdate";
import { gql } from "@apollo/client";
import { probeImage } from "@labelflow/common-resolvers/src/utils/probe-image";
import { client } from "../../apollo-client/schema-client";
import { setupTestsWithLocalDatabase } from "../../../utils/setup-local-db-tests";

setupTestsWithLocalDatabase();

jest.mock("@labelflow/common-resolvers/src/utils/probe-image");
const mockedProbeSync = probeImage as jest.Mock;

describe("Image resolver test suite", () => {
  const testDatasetId = "test dataset id";

  const createDataset = async (
    name: string,
    datasetId: string = testDatasetId
  ) => {
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

  const createImage = async (name: String, datasetId = testDatasetId) => {
    mockedProbeSync.mockReturnValue({
      width: 42,
      height: 36,
      mime: "image/jpeg",
    });

    const mutationResult = await client.mutate({
      mutation: gql`
        mutation createImage($file: Upload!, $name: String!, $datasetId: ID!) {
          createImage(
            data: { name: $name, file: $file, datasetId: $datasetId }
          ) {
            id
          }
        }
      `,
      variables: {
        datasetId,
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

  const createLabel = async (imageId: number, x: number) => {
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
          imageId,
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

  it("should query images when database is empty", async () => {
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

  it("should query image that does not exist", async () => {
    await expect(
      client.query({
        query: gql`
          query getImages($id: ID!) {
            image(where: { id: $id }) {
              id
            }
          }
        `,
        variables: {
          id: "some-id",
        },
      })
    ).rejects.toThrow(/No image with id/);
  });

  it("should fail when we want to create an image when there is no dataset created", async () => {
    expect.assertions(1);
    await expect(createImage("New test image")).rejects.toThrow(
      "The dataset id test dataset id doesn't exist."
    );
  });

  it("should create an image with the correct name when we want to create an image with Blob when there is a dataset", async () => {
    await createDataset("Test dataset");

    const id = await createImage("New test image");

    const {
      data: { image },
    } = await client.query({
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

    expect(image).toEqual(
      expect.objectContaining({
        id,
        name: "New test image",
      })
    );
  });

  it("should create an image with the correct name when we want to create an image with url when there is a dataset", async () => {
    await createDataset("Test dataset");

    // @ts-ignore
    fetch.mockResponseOnce(new Blob());
    // @ts-ignore
    const {
      data: {
        createImage: { id },
      },
    } = await client.mutate({
      mutation: gql`
        mutation createImage($url: String!, $datasetId: ID!) {
          createImage(data: { url: $url, datasetId: $datasetId }) {
            id
          }
        }
      `,
      variables: {
        datasetId: testDatasetId,
        url: "https://images.unsplash.com/photo-1579513141590-c597876aefbc?auto=format&fit=crop&w=882&q=80",
      },
    });

    const {
      data: { image },
    } = await client.query({
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

    expect(image).toEqual(
      expect.objectContaining({
        id,
        name: "photo-1579513141590-c597876aefbc",
      })
    );
  });

  it("should create an image with a custom id", async () => {
    await createDataset("Test dataset");

    const name = "an image";
    const imageId = "a custom id";

    const mutationResult = await client.mutate({
      mutation: gql`
        mutation createImage(
          $id: ID
          $file: Upload!
          $name: String!
          $datasetId: ID!
        ) {
          createImage(
            data: { id: $id, name: $name, file: $file, datasetId: $datasetId }
          ) {
            id
          }
        }
      `,
      variables: {
        id: imageId,
        datasetId: testDatasetId,
        file: new Blob(),
        name,
      },
    });

    expect(mutationResult.data.createImage.id).toEqual(imageId);
  });

  it("should create an image with the given createdAt value", async () => {
    await createDataset("Test dataset");

    const mutationResult = await client.mutate({
      mutation: gql`
        mutation createImage($file: Upload!, $datasetId: ID!) {
          createImage(
            data: {
              file: $file
              createdAt: "some custom date string"
              datasetId: $datasetId
            }
          ) {
            createdAt
          }
        }
      `,
      variables: {
        datasetId: testDatasetId,
        file: new Blob(),
      },
    });

    expect(mutationResult.data.createImage.createdAt).toEqual(
      "some custom date string"
    );
  });

  it("should query images linked to a dataset", async () => {
    await createDataset("Test dataset 1", "dataset 1");
    await createDataset("Test dataset 2", "dataset 2");

    const imageId1 = await createImage("Image 1", "dataset 1");
    incrementMockedDate(1);
    const imageId2 = await createImage("Image 2", "dataset 1");
    incrementMockedDate(1);
    await createImage("Image 3", "dataset 2");

    const queryResult = await client.query({
      query: gql`
        query {
          images(where: { datasetId: "dataset 1" }) {
            id
          }
        }
      `,
    });

    expect(queryResult.data.images.length).toEqual(2);
    expect(
      queryResult.data.images.map((image: { id: string }) => image.id)
    ).toEqual([imageId1, imageId2]);
  });

  it("should query all the images ignoring with which datasets there are linked", async () => {
    await createDataset("Test dataset 1", "dataset 1");
    await createDataset("Test dataset 2", "dataset 2");

    const imageId2 = await createImage("image 2", "dataset 1");
    incrementMockedDate(1);
    const imageId1 = await createImage("image 1", "dataset 1");
    incrementMockedDate(1);
    const imageId3 = await createImage("image 3", "dataset 2");

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

  it("should query paginated images", async () => {
    await createDataset("Test dataset 1", "dataset 1");
    await createDataset("Test dataset 2", "dataset 2");

    await createImage("image 2", "dataset 1");
    incrementMockedDate(1);
    const imageId1 = await createImage("image 1", "dataset 1");
    incrementMockedDate(1);
    const imageId3 = await createImage("image 3", "dataset 2");
    incrementMockedDate(1);
    await createImage("image 4", "dataset 2");

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

  it("should query an image with his labels", async () => {
    await createDataset("Test dataset");

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

  it("should count the images", async () => {
    await createDataset("Test dataset");

    await Promise.all([
      createImage("Image 1"),
      createImage("Image 2"),
      createImage("Image 3"),
    ]);

    const queryResult = await client.query({
      query: gql`
        query getImagesNumber {
          imagesAggregates {
            totalCount
          }
        }
      `,
    });

    expect(queryResult.data.imagesAggregates.totalCount).toEqual(3);
  });
});

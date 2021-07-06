import { incrementMockedDate } from "@labelflow/dev-utils/mockdate";
import gql from "graphql-tag";
import probe from "probe-image-size";

import { client } from "../../apollo-client-schema";
import { setupTestsWithLocalDatabase } from "../../../utils/setup-local-db-tests";

jest.mock("probe-image-size");

setupTestsWithLocalDatabase();

describe("Image resolver test suite", () => {
  const testProjectId = "test project id";

  const createImage = async (name: String, projectId = testProjectId) => {
    const mutationResult = await client.mutate({
      mutation: gql`
        mutation createImage($file: Upload!, $name: String!, $projectId: ID!) {
          createImage(
            data: { name: $name, file: $file, projectId: $projectId }
          ) {
            id
          }
        }
      `,
      variables: {
        projectId,
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

  test("Query image that does not exist", async () => {
    return expect(
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
    ).rejects.toThrow("No image with such id");
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

  test("Create image with url", async () => {
    // @ts-ignore
    fetch.mockResponseOnce(new Blob());
    // @ts-ignore
    probe.sync.mockReturnValueOnce({
      width: 10,
      height: 10,
      mime: "something",
    });

    const {
      data: {
        createImage: { id },
      },
    } = await client.mutate({
      mutation: gql`
        mutation createImage($url: String!, $projectId: ID!) {
          createImage(data: { url: $url, projectId: $projectId }) {
            id
          }
        }
      `,
      variables: {
        projectId: testProjectId,
        url: "https://images.unsplash.com/photo-1579513141590-c597876aefbc?auto=format&fit=crop&w=882&q=80",
      },
    });

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
        name: "photo-1579513141590-c597876aefbc",
        url: "mockedUrl",
      })
    );
  });

  test("Create image with an id", async () => {
    const name = "an image";
    const imageId = "a custom id";

    const mutationResult = await client.mutate({
      mutation: gql`
        mutation createImage(
          $id: ID
          $file: Upload!
          $name: String!
          $projectId: ID!
        ) {
          createImage(
            data: { id: $id, name: $name, file: $file, projectId: $projectId }
          ) {
            id
          }
        }
      `,
      variables: {
        id: imageId,
        projectId: testProjectId,
        file: new Blob(),
        name,
      },
    });

    expect(mutationResult.data.createImage.id).toEqual(imageId);
  });

  test("Create image with a createdAt", async () => {
    const mutationResult = await client.mutate({
      mutation: gql`
        mutation createImage($file: Upload!, $projectId: ID!) {
          createImage(
            data: {
              file: $file
              createdAt: "some custom date string"
              projectId: $projectId
            }
          ) {
            createdAt
          }
        }
      `,
      variables: {
        projectId: testProjectId,
        file: new Blob(),
      },
    });

    expect(mutationResult.data.createImage.createdAt).toEqual(
      "some custom date string"
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

  test("It returns the correct count of images", async () => {
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

    // labels should show in the right order
    expect(queryResult.data.imagesAggregates.totalCount).toEqual(3);
  });

  it("should query images linked to a project", async () => {
    const imageId1 = await createImage("Image 1", "project 1");
    incrementMockedDate(1);
    const imageId2 = await createImage("Image 2", "project 1");
    incrementMockedDate(1);
    await createImage("Image 1", "project 2");

    const queryResult = await client.query({
      query: gql`
        query {
          images(where: { projectId: "project 1" }) {
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

  it("should return the correct count of images for a project", async () => {
    await Promise.all([
      createImage("Image 1", "project 1"),
      createImage("Image 2", "project 1"),
      createImage("Image 3", "project 2"),
    ]);

    const queryResult = await client.query({
      query: gql`
        query getImagesNumber {
          imagesCount(where: { projectId: "project 1" })
        }
      `,
    });

    expect(queryResult.data.imagesCount).toEqual(2);
  });
});

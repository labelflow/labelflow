import { gql } from "@apollo/client";
import { v4 as uuidV4 } from "uuid";
import { client, user } from "../../dev/apollo-client";
import { getPrismaClient } from "../../prisma-client";
import { processImage } from "../../repository/image-processing";
import {
  createDataset,
  createWorkspace,
  CREATE_IMAGE_MUTATION,
} from "../../utils/tests";

jest.mock("../../repository/image-processing");
const mockedProcessImage = processImage as jest.Mock;

// @ts-ignore
fetch.disableFetchMocks();

const testUser1Id = uuidV4();
const testUser2Id = uuidV4();
const testDatasetId = uuidV4();
const testImageId = uuidV4();

const imageWidth = 500;
const imageHeight = 900;

const createImage = async (
  name: String,
  datasetId: String,
  imageId?: String
) => {
  mockedProcessImage.mockReturnValue({
    width: imageWidth,
    height: imageHeight,
    mimetype: "image/jpeg",
  });
  const mutationResult = await client.mutate({
    mutation: CREATE_IMAGE_MUTATION,
    variables: {
      imageId,
      datasetId,
      file: new Blob(),
      name,
      width: imageWidth,
      height: imageHeight,
    },
  });

  const {
    data: {
      createImage: { id },
    },
  } = mutationResult;

  return id;
};

describe("Access control for image", () => {
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

  it("allows to create an image to a user that has access to the dataset", async () => {
    const createdImageId = await createImage(
      "test-image",
      testDatasetId,
      testImageId
    );
    expect(createdImageId).toEqual(testImageId);
  });

  it("fails to create an image when the user does not have access to the dataset", async () => {
    user.id = testUser2Id;
    await expect(() =>
      createImage("test-image", testDatasetId, testImageId)
    ).rejects.toThrow(`User not authorized to access dataset`);
  });

  it("allows to get an image to the user that created it", async () => {
    const createdImageId = await createImage(
      "test-image",
      testDatasetId,
      testImageId
    );
    const { data } = await client.query({
      query: gql`
        query image($id: ID!) {
          image(where: { id: $id }) {
            id
            name
          }
        }
      `,
      variables: { id: createdImageId },
      fetchPolicy: "no-cache",
    });
    expect(data.image.name).toEqual("test-image");
  });

  it("fails to get an image if the user does not have access to it", async () => {
    const createdImageId = await createImage(
      "test-image",
      testDatasetId,
      testImageId
    );
    user.id = testUser2Id;
    await expect(() =>
      client.query({
        query: gql`
          query image($id: ID!) {
            image(where: { id: $id }) {
              id
              name
            }
          }
        `,
        variables: { id: createdImageId },
        fetchPolicy: "no-cache",
      })
    ).rejects.toThrow(`User not authorized to access image`);
  });

  it("gives the amount of images the user has access to", async () => {
    await createImage("test-image", testDatasetId);
    await createImage("test-image", testDatasetId);
    await createImage("test-image", testDatasetId);
    const { data } = await client.query({
      query: gql`
        query images {
          imagesAggregates {
            totalCount
          }
          images {
            id
          }
        }
      `,
      fetchPolicy: "no-cache",
    });
    expect(data.imagesAggregates.totalCount).toEqual(3);
    expect(data.images.length).toEqual(3);
  });

  it("returns zero elements if user does not have access to any image", async () => {
    await createImage("test-image", testDatasetId);
    await createImage("test-image", testDatasetId);
    await createImage("test-image", testDatasetId);
    user.id = testUser2Id;
    const { data } = await client.query({
      query: gql`
        query images {
          imagesAggregates {
            totalCount
          }
          images {
            id
          }
        }
      `,
      fetchPolicy: "no-cache",
    });
    expect(data.imagesAggregates.totalCount).toEqual(0);
    expect(data.images.length).toEqual(0);
  });
});

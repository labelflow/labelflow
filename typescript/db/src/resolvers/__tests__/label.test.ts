import { LabelType } from ".prisma/client";
import { gql } from "@apollo/client";
import { LabelCreateInput } from "@labelflow/graphql-types";
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

const getGeometryFromExtent = ({
  x,
  y,
  width,
  height,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
}): { type: string; coordinates: number[][][] } => ({
  type: "Polygon",
  coordinates: [
    [
      [x, y],
      [x + width, y],
      [x + width, y + height],
      [x, y + height],
      [x, y],
    ],
  ],
});
const labelDataExtent = {
  x: 3.14,
  y: 42,
  type: LabelType.Box,
  height: 768,
  width: 362,
};

const testUser1Id = uuidV4();
const testUser2Id = uuidV4();
const testDatasetId = uuidV4();
const testImageId = uuidV4();
const testLabelId = uuidV4();

const labelData = {
  geometry: getGeometryFromExtent(labelDataExtent),
  imageId: testImageId,
  id: testLabelId,
};
const imageWidth = 500;
const imageHeight = 900;

const UPDATE_LABEL_MUTATION_TEST = gql`
  mutation updateLabelTest($id: ID!, $data: LabelUpdateInput!) {
    updateLabel(where: { id: $id }, data: $data) {
      id
    }
  }
`;

const DELETE_LABEL_MUTATION_TEST = gql`
  mutation deleteLabelTest($id: ID!) {
    deleteLabel(where: { id: $id }) {
      id
    }
  }
`;

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

describe("Access control for label", () => {
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
    await createImage("test-image", testDatasetId, testImageId);
  });

  afterAll(async () => {
    // Needed to avoid having the test process running indefinitely after the test suite has been run
    await (await getPrismaClient()).$disconnect();
  });

  it("allows to create a label to a user that has access to the image", async () => {
    const createdLabel = await createLabel(labelData);
    expect(createdLabel.data.createLabel.id).toEqual(testLabelId);
  });

  it("fails to create a label when the user does not have access to the image", async () => {
    user.id = testUser2Id;
    await expect(() => createLabel(labelData)).rejects.toThrow(
      `User not authorized to access image`
    );
  });

  it("allows to get a label to the user that created it", async () => {
    const createdLabel = await createLabel(labelData);
    const { data } = await client.query({
      query: gql`
        query label($id: ID!) {
          label(where: { id: $id }) {
            id
            name
            labelClass {
              id
            }
          }
        }
      `,
      variables: { id: createdLabel.data.createLabel.id },
      fetchPolicy: "no-cache",
    });
    expect(data.label.id).toEqual(testLabelId);
    expect(data.labelClass).toEqual(undefined);
  });

  it("fails to get a label if the user does not have access to it", async () => {
    const createdLabel = await createLabel(labelData);
    user.id = testUser2Id;
    await expect(() =>
      client.query({
        query: gql`
          query label($id: ID!) {
            label(where: { id: $id }) {
              id
              name
            }
          }
        `,
        variables: { id: createdLabel.data.createLabel.id },
        fetchPolicy: "no-cache",
      })
    ).rejects.toThrow(`User not authorized to access label`);
  });

  it("gives the amount of labels the user has access to", async () => {
    await createLabel(labelData);
    await createLabel({ ...labelData, id: undefined });
    await createLabel({ ...labelData, id: undefined });
    const { data } = await client.query({
      query: gql`
        query labels {
          labelsAggregates {
            totalCount
          }
        }
      `,
      variables: { imageId: testImageId },
      fetchPolicy: "no-cache",
    });
    expect(data.labelsAggregates.totalCount).toEqual(3);
  });

  it("returns zero elements if user does not have access to any label", async () => {
    await createLabel(labelData);
    await createLabel({ ...labelData, id: undefined });
    await createLabel({ ...labelData, id: undefined });
    user.id = testUser2Id;
    const { data } = await client.query({
      query: gql`
        query labels {
          labelsAggregates {
            totalCount
          }
        }
      `,
      variables: { imageId: testImageId },
      fetchPolicy: "no-cache",
    });
    expect(data.labelsAggregates.totalCount).toEqual(0);
  });

  it("allows to update a label to a user that has access to it", async () => {
    const createdLabel = await createLabel(labelData);
    await client.query({
      query: UPDATE_LABEL_MUTATION_TEST,
      variables: {
        id: createdLabel.data.createLabel.id,
        data: {
          geometry: getGeometryFromExtent({ ...labelDataExtent, x: 0, y: 0 }),
        },
      },
      fetchPolicy: "no-cache",
    });
    const { data } = await client.query({
      query: gql`
        query label($id: ID!) {
          label(where: { id: $id }) {
            id
            geometry {
              coordinates
            }
          }
        }
      `,
      variables: { id: createdLabel.data.createLabel.id },
      fetchPolicy: "no-cache",
    });

    expect(data.label.geometry.coordinates).toEqual(
      getGeometryFromExtent({ ...labelDataExtent, x: 0, y: 0 }).coordinates
    );
  });

  it("fails to update a label when the user does not have access to it", async () => {
    const createdLabel = await createLabel(labelData);
    user.id = testUser2Id;

    await expect(() =>
      client.query({
        query: UPDATE_LABEL_MUTATION_TEST,
        variables: {
          id: createdLabel.data.createLabel.id,
          data: {
            geometry: getGeometryFromExtent({ ...labelDataExtent, x: 0, y: 0 }),
          },
        },
        fetchPolicy: "no-cache",
      })
    ).rejects.toThrow(`User not authorized to access label`);
  });

  it("allows to delete a label to a user that has access to it", async () => {
    const createdLabel = await createLabel(labelData);
    await client.query({
      query: DELETE_LABEL_MUTATION_TEST,
      variables: {
        id: createdLabel.data.createLabel.id,
      },
      fetchPolicy: "no-cache",
    });
    const { data } = await client.query({
      query: gql`
        query labels {
          labelsAggregates {
            totalCount
          }
        }
      `,
      variables: { imageId: testImageId },
      fetchPolicy: "no-cache",
    });
    expect(data.labelsAggregates.totalCount).toEqual(0);
  });

  it("fails to delete a label to a user that has access to it", async () => {
    const createdLabel = await createLabel(labelData);
    user.id = testUser2Id;

    await expect(() =>
      client.query({
        query: DELETE_LABEL_MUTATION_TEST,
        variables: {
          id: createdLabel.data.createLabel.id,
        },
        fetchPolicy: "no-cache",
      })
    ).rejects.toThrow(`User not authorized to access label`);
  });
});

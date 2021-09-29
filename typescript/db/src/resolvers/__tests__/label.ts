// eslint-disable-next-line import/no-extraneous-dependencies
import { gql } from "@apollo/client";
import { v4 as uuidV4 } from "uuid";
import {
  LabelCreateInput,
  MutationCreateWorkspaceArgs,
  Workspace,
} from "@labelflow/graphql-types";
import { probeImage } from "@labelflow/common-resolvers/src/utils/probe-image";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "../../repository/prisma-client";
import { client, user } from "../../dev/apollo-client";
import { LabelType } from ".prisma/client";

jest.mock("@labelflow/common-resolvers/src/utils/probe-image");
const mockedProbeSync = probeImage as jest.Mock;

jest.mock("@supabase/supabase-js");
const mockedSupabaseCreateClient = createClient as jest.Mock;

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

// @ts-ignore
fetch.disableFetchMocks();

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

const createWorkspace = async (
  data?: Partial<MutationCreateWorkspaceArgs["data"]>
) => {
  return await client.mutate<{
    createWorkspace: Pick<Workspace, "id" | "name" | "slug" | "plan" | "type">;
  }>({
    mutation: gql`
      mutation createWorkspace($data: WorkspaceCreateInput!) {
        createWorkspace(data: $data) {
          id
          name
          slug
          plan
          type
        }
      }
    `,
    variables: { data: { ...data, name: data?.name ?? "test" } },
  });
};

const createDataset = async (
  name: string,
  workspaceSlug: string,
  datasetId?: string | null
) => {
  return await client.mutate({
    mutation: gql`
      mutation createDataset(
        $datasetId: String
        $name: String!
        $workspaceSlug: String!
      ) {
        createDataset(
          data: { id: $datasetId, name: $name, workspaceSlug: $workspaceSlug }
        ) {
          id
          name
        }
      }
    `,
    variables: {
      name,
      datasetId,
      workspaceSlug,
    },
    fetchPolicy: "no-cache",
  });
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

const createImage = async (
  name: String,
  datasetId: String,
  imageId?: String
) => {
  mockedProbeSync.mockReturnValue({
    width: imageWidth,
    height: imageHeight,
    mimetype: "image/jpeg",
  });
  mockedSupabaseCreateClient.mockReturnValue({
    storage: { from: () => ({ upload: () => {} }) },
  });
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createImage(
        $datasetId: ID!
        $file: Upload!
        $name: String!
        $width: Int
        $height: Int
        $imageId: ID
      ) {
        createImage(
          data: {
            id: $imageId
            datasetId: $datasetId
            name: $name
            file: $file
            width: $width
            height: $height
          }
        ) {
          id
        }
      }
    `,
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

beforeAll(async () => {
  await prisma.user.create({ data: { id: testUser1Id, name: "test-user-1" } });
  await prisma.user.create({ data: { id: testUser2Id, name: "test-user-2" } });
});

beforeEach(async () => {
  user.id = testUser1Id;
  await prisma.membership.deleteMany({});
  await prisma.workspace.deleteMany({});
  await createWorkspace({ name: "My workspace" });
  await createDataset("My dataset", "my-workspace", testDatasetId);
  await createImage("test-image", testDatasetId, testImageId);
});

afterAll(async () => {
  // Needed to avoid having the test process running indefinitely after the test suite has been run
  await prisma.$disconnect();
});

describe("Access control for label", () => {
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
          }
        }
      `,
      variables: { id: createdLabel.data.createLabel.id },
      fetchPolicy: "no-cache",
    });
    expect(data.label.id).toEqual(testLabelId);
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
      query: gql`
        mutation updateLabel($id: ID!, $data: LabelUpdateInput!) {
          updateLabel(where: { id: $id }, data: $data) {
            id
          }
        }
      `,
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
        query: gql`
          mutation updateLabel($id: ID!, $data: LabelUpdateInput!) {
            updateLabel(where: { id: $id }, data: $data) {
              id
            }
          }
        `,
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
      query: gql`
        mutation deleteLabel($id: ID!) {
          deleteLabel(where: { id: $id }) {
            id
          }
        }
      `,
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
        query: gql`
          mutation deleteLabel($id: ID!) {
            deleteLabel(where: { id: $id }) {
              id
            }
          }
        `,
        variables: {
          id: createdLabel.data.createLabel.id,
        },
        fetchPolicy: "no-cache",
      })
    ).rejects.toThrow(`User not authorized to access label`);
  });
});

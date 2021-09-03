import { gql } from "@apollo/client";
import { omit } from "lodash/fp";
import {
  initialCocoDataset,
  CocoDataset,
  jsonToDataUri,
  dataUriToJson,
} from "@labelflow/common-resolvers";

import { probeImage } from "@labelflow/common-resolvers/src/utils/probe-image";
import { client } from "../../apollo-client/schema-client";

import { setupTestsWithLocalDatabase } from "../../../utils/setup-local-db-tests";

jest.mock("@labelflow/common-resolvers/src/utils/probe-image");
const mockedProbeSync = probeImage as jest.Mock;

setupTestsWithLocalDatabase();

const omitUrl = omit("images.0.coco_url");

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

const createImage = async (name: String): Promise<string> => {
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createImage($file: Upload!, $name: String!, $datasetId: ID!) {
        createImage(
          data: {
            name: $name
            file: $file
            datasetId: $datasetId
            width: 100
            height: 200
            mimetype: "image/jpeg"
          }
        ) {
          id
        }
      }
    `,
    variables: {
      file: new Blob(),
      name,
      datasetId: testDatasetId,
    },
  });

  const {
    data: {
      createImage: { id },
    },
  } = mutationResult;

  return id;
};

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
      data: { ...data, datasetId: testDatasetId },
    },
  });

  const {
    data: {
      createLabelClass: { id },
    },
  } = mutationResult;

  return id;
};

const createLabelWithLabelClass = (imageId: string, labelClassId: string) => {
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
              [1, 1],
              [2, 1],
              [2, 2],
              [1, 2],
              [1, 1],
            ],
          ],
        },
      },
    },
  });
};

describe.skip("Exporting a dataset to coco format", () => {
  beforeEach(async () => {
    // Images and label classes are always liked to a dataset
    await createDataset("Test dataset");
  });

  test("The exportToCoco graphql endpoint returns an empty dataset when no label class and no image exist", async () => {
    expect(
      (
        await client.query({
          query: gql`
            query exportToCoco($datasetId: ID!) {
              exportToCoco(where: { datasetId: $datasetId })
            }
          `,
          variables: {
            datasetId: testDatasetId,
          },
        })
      ).data.exportToCoco
    ).toEqual(jsonToDataUri(JSON.stringify(initialCocoDataset)));
  });

  test("The exportToCoco graphql endpoint returns a dataset with a category when a label class exist", async () => {
    await createLabelClass({
      name: "label-class-1",
      color: "#000000",
      id: "id-label-class-1",
    });

    const expectedDataset: CocoDataset = {
      ...initialCocoDataset,
      categories: [
        {
          id: 1,
          name: "label-class-1",
          supercategory: "",
        },
      ],
    };

    expect(
      (
        await client.query({
          query: gql`
            query exportToCoco($datasetId: ID!) {
              exportToCoco(where: { datasetId: $datasetId })
            }
          `,
          variables: {
            datasetId: testDatasetId,
          },
        })
      ).data.exportToCoco
    ).toEqual(jsonToDataUri(JSON.stringify(expectedDataset)));
  });

  test("The exportToCoco graphql endpoint returns a dataset with a category and an image when a label class, and an image exist", async () => {
    mockedProbeSync.mockReturnValue({
      width: 100,
      height: 200,
      mimetype: "image/jpeg",
    });

    await createLabelClass({
      name: "label-class-1",
      color: "#000000",
      id: "id-label-class-1",
    });
    const idImage = await createImage("image-1");
    await createLabelWithLabelClass(idImage, "id-label-class-1");

    const expectedDataset: CocoDataset = {
      ...initialCocoDataset,
      annotations: [
        {
          id: 1,
          image_id: 1,
          category_id: 1,
          segmentation: [[1, 199, 2, 199, 2, 198, 1, 198, 1, 199]],
          area: 1,
          bbox: [1, 198, 1, 1],
          iscrowd: 0,
        },
      ],
      categories: [
        {
          id: 1,
          name: "label-class-1",
          supercategory: "",
        },
      ],
      images: [
        {
          id: 1,
          file_name: `image-1_${idImage}.jpeg`,
          coco_url: "mockedUrl",
          date_captured: new Date().toISOString(),
          flickr_url: "",
          height: 200,
          width: 100,
          license: 0,
        },
      ],
    };

    expect(
      omitUrl(
        JSON.parse(
          dataUriToJson(
            (
              await client.query({
                query: gql`
                  query exportToCoco($datasetId: ID!) {
                    exportToCoco(where: { datasetId: $datasetId })
                  }
                `,
                variables: {
                  datasetId: testDatasetId,
                },
              })
            ).data.exportToCoco
          )
        )
      )
    ).toEqual(omitUrl(expectedDataset));
  });
});

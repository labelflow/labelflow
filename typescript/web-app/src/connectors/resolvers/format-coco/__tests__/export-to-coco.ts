import gql from "graphql-tag";
import probe from "probe-image-size";
// eslint-disable-next-line import/no-extraneous-dependencies
import { mocked } from "ts-jest/utils";
import { omit } from "lodash/fp";
import { client } from "../../../apollo-client-schema";

import { setupTestsWithLocalDatabase } from "../../../../utils/setup-local-db-tests";
import { initialCocoDataset } from "../coco-core/converters";
import { CocoDataset } from "../coco-core/types";
import { jsonToDataUri } from "..";
import { dataUriToJson } from "../json-to-data-uri";

jest.mock("probe-image-size");
const mockedProbeSync = mocked(probe.sync);

setupTestsWithLocalDatabase();

const omitUrl = omit(["images", 0, "coco_url"]);

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
              [0, 0],
              [1, 0],
              [1, 1],
              [0, 1],
              [0, 0],
            ],
          ],
        },
      },
    },
  });
};

const createImage = async (name: String): Promise<string> => {
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createImage($file: Upload!, $name: String!) {
        createImage(data: { name: $name, file: $file }) {
          id
        }
      }
    `,
    variables: {
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

describe("Exporting a dataset to coco format", () => {
  test("The exportToCoco graphql endpoint returns an empty dataset when no label class and no image exist", async () => {
    expect(
      (
        await client.query({
          query: gql`
            query {
              exportToCoco
            }
          `,
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
            query {
              exportToCoco
            }
          `,
        })
      ).data.exportToCoco
    ).toEqual(jsonToDataUri(JSON.stringify(expectedDataset)));
  });

  test("The exportToCoco graphql endpoint returns a dataset with a category and an image when a label class, and an image exist", async () => {
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

    await createLabelClass({
      name: "label-class-1",
      color: "#000000",
      id: "id-label-class-1",
    });
    await createLabelWithLabelClass(
      await createImage("image-1"),
      "id-label-class-1"
    );

    const expectedDataset: CocoDataset = {
      ...initialCocoDataset,
      annotations: [
        {
          id: 1,
          image_id: 1,
          category_id: 1,
          segmentation: [],
          area: 1,
          bbox: [0, 0, 1, 1],
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
          file_name: "image-1",
          coco_url: "mockedUrl",
          date_captured: new Date().toISOString(),
          flickr_url: "",
          height: 36,
          width: 42,
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
                  query {
                    exportToCoco
                  }
                `,
              })
            ).data.exportToCoco
          )
        )
      )
    ).toEqual(omitUrl(expectedDataset));
  });
});

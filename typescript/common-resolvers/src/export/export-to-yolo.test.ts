import { LabelType } from "@labelflow/graphql-types";
import { DbLabelClass, DbLabel, DbImageCreateInput, Context } from "../types";
import {
  generateNamesFile,
  generateDataFile,
  getImageUrlList,
  generateLabelsOfImageFile,
  GetImageUrlListOptions,
} from "./export-to-yolo";

const date = new Date("1995-12-17T03:24:00").toISOString();
const testDatasetId = "test-dataset-id";

const createLabelClass = (name: string, index: number = 0): DbLabelClass => ({
  id: `id-${name}`,
  index,
  createdAt: date,
  updatedAt: date,
  name,
  color: "#000000",
  datasetId: testDatasetId,
});

const createLabel = (
  imageId: string,
  labelClassId?: string,
  type: LabelType = LabelType.Box
): DbLabel => ({
  id: "id",
  createdAt: date,
  updatedAt: date,
  type,
  imageId,
  x: 1,
  y: 2,
  width: 3,
  height: 4,
  labelClassId,
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [1, 2],
        [1, 6],
        [4, 6],
        [4, 2],
        [1, 2],
      ],
    ],
  },
});

const createImage = (
  name: string,
  height: number = 10,
  width: number = 20
): DbImageCreateInput => ({
  id: `id-${name}`,
  name,
  createdAt: date,
  updatedAt: date,
  height,
  width,
  url: `https://${name}`,
  externalUrl: `https://${name}`,
  path: "/path",
  mimetype: "image/png",
  datasetId: testDatasetId,
});

const COMMON_GET_IMAGE_URL_LIST_OPTIONS: Pick<
  GetImageUrlListOptions,
  "images" | "datasetName" | "ctx"
> = {
  images: [createImage("titi"), createImage("toto")],
  datasetName: "my-dataset-name",
  ctx: {} as Context,
};

describe("Yolo converters", () => {
  it("generates the obj.names file string content", () => {
    expect(
      generateNamesFile([createLabelClass("titi"), createLabelClass("toto")])
    ).toEqual(
      `titi
toto`
    );
  });

  it("generates the obj.data file string content", () => {
    expect(generateDataFile(3, "my-dataset-name")).toEqual(
      `classes = 3
train = my-dataset-name/train.txt
data = my-dataset-name/obj.names`
    );
  });

  it("generates the train.txt file string content with each image information", async () => {
    expect(
      await getImageUrlList({
        ...COMMON_GET_IMAGE_URL_LIST_OPTIONS,
        options: { avoidImageNameCollisions: false },
        includeSignedUrl: false,
      })
    ).toEqual(
      `my-dataset-name/obj_train_data/titi.png
my-dataset-name/obj_train_data/toto.png`
    );
    expect(
      await getImageUrlList({
        ...COMMON_GET_IMAGE_URL_LIST_OPTIONS,
        options: { avoidImageNameCollisions: true },
        includeSignedUrl: false,
      })
    ).toEqual(
      `my-dataset-name/obj_train_data/titi_id-titi.png
my-dataset-name/obj_train_data/toto_id-toto.png`
    );
  });

  it("generates the train_url.txt file string content with each image information", async () => {
    expect(
      await getImageUrlList({
        ...COMMON_GET_IMAGE_URL_LIST_OPTIONS,
        options: { avoidImageNameCollisions: false },
        includeSignedUrl: true,
      })
    ).toEqual(
      `https://titi my-dataset-name/obj_train_data/titi.png
https://toto my-dataset-name/obj_train_data/toto.png`
    );
  });

  it("generates the file string content of one image labels information and dismiss polygons", () => {
    expect(
      generateLabelsOfImageFile(
        [
          createLabel("id-image-titi", "id-labelclass-titi"),
          createLabel("id-image-titi", "id-labelclass-toto"),
          createLabel("id-image-titi", "id-labelclass-toto", LabelType.Polygon),
        ],
        createImage("image-titi"),
        [
          createLabelClass("labelclass-titi", 2),
          createLabelClass("labelclass-toto", 5),
        ],
        { includePolygons: false }
      )
    ).toEqual(`2 0.05 0.2 0.15 0.4
5 0.05 0.2 0.15 0.4`);
  });

  it("generates the file string content of one image labels information and include polygons", () => {
    expect(
      generateLabelsOfImageFile(
        [
          createLabel("id-image-titi", "id-labelclass-titi"),
          createLabel("id-image-titi", "id-labelclass-toto"),
          createLabel("id-image-titi", "id-labelclass-titi", LabelType.Polygon),
        ],
        createImage("image-titi"),
        [
          createLabelClass("labelclass-titi", 2),
          createLabelClass("labelclass-toto", 5),
        ],
        { includePolygons: true }
      )
    ).toEqual(`2 0.05 0.2 0.15 0.4
5 0.05 0.2 0.15 0.4
2 0.05 0.2 0.15 0.4`);
  });
});

import { LabelType } from "@labelflow/graphql-types";
import { DbLabelClass, DbLabel, DbImage } from "../../../types";
import {
  generateNamesFile,
  generateDataFile,
  generateImagesListFile,
  generateLabelsOfImageFile,
} from "../export-to-yolo";

describe("Yolo converters", () => {
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
    width: number = 10
  ): DbImage => ({
    id: `id-${name}`,
    name,
    createdAt: date,
    updatedAt: date,
    height,
    width,
    url: "",
    externalUrl: `https://${name}`,
    path: "/path",
    mimetype: "image/png",
    datasetId: testDatasetId,
  });
  test("Should generate the obj.names file string content", () => {
    expect(
      generateNamesFile([createLabelClass("titi"), createLabelClass("toto")])
    ).toEqual(
      `titi
toto`
    );
  });

  test("Should generate the obj.data file string content", () => {
    expect(generateDataFile(3, "my-dataset-name")).toEqual(
      `classes = 3
train = my-dataset-name/train.txt
data = my-dataset-name/obj.names`
    );
  });

  test("Should generate the train.txt file string content with each image information", () => {
    expect(
      generateImagesListFile(
        [createImage("titi"), createImage("toto")],
        "my-dataset-name"
      )
    ).toEqual(
      `my-dataset-name/obj_train_data/titi.png
my-dataset-name/obj_train_data/toto.png`
    );
  });

  test("Should generate the file string content of one image labels information and dismiss polygons", () => {
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
        {
          includePolygons: false,
        }
      )
    ).toEqual(`2 0.1 0.2 0.3 0.4
5 0.1 0.2 0.3 0.4`);
  });

  test("Should generate the file string content of one image labels information and include polygons", () => {
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
        {
          includePolygons: true,
        }
      )
    ).toEqual(`2 0.1 0.2 0.3 0.4
5 0.1 0.2 0.3 0.4
2 0.1 0.2 0.3 0.4`);
  });
});

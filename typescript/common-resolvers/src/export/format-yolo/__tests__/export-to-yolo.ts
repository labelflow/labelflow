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

  const createLabelClass = (name: string): DbLabelClass => ({
    id: `id-${name}`,
    index: 0,
    createdAt: date,
    updatedAt: date,
    name,
    color: "#000000",
    datasetId: testDatasetId,
  });

  const createLabelWithImageDimensions = (
    id: string,
    imageId: string,
    labelClassId?: string
  ): DbLabel => ({
    id,
    createdAt: date,
    updatedAt: date,
    type: LabelType.Polygon,
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
    height: number,
    width: number
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
});

import { LabelType } from "@labelflow/graphql-types";
import { Context, DbImageCreateInput, DbLabelClass } from "../../../types";

import {
  convertLabelClassToCocoCategory,
  convertLabelClassesToCocoCategories,
  convertLabelToCocoAnnotation,
  convertLabelsOfImageToCocoAnnotations,
  convertImageToCocoImage,
  initialCocoDataset,
  convertLabelflowDatasetToCocoDataset,
  convertImagesToCocoImages,
  convertGeometryToSegmentation,
} from "./converters";
import {
  CocoCategory,
  CocoAnnotation,
  DbLabelWithImageDimensions,
} from "./types";

describe("Coco converters", () => {
  const date = new Date("1995-12-17T03:24:00").toISOString();
  const testDatasetId = "test-dataset-id";
  const fakeImageUrl = "https://fake-image-url";

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
    labelClassId: string = "someLabelClassId"
  ): DbLabelWithImageDimensions => ({
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
    imageDimensions: { width: 600, height: 200 },
  });

  const createImage = (
    name: string,
    height: number,
    width: number
  ): DbImageCreateInput => ({
    id: `id-${name}`,
    name,
    createdAt: date,
    updatedAt: date,
    height,
    width,
    url: fakeImageUrl,
    externalUrl: `https://${name}`,
    path: "/path",
    mimetype: "image/png",
    datasetId: testDatasetId,
  });

  it("converts a label class to a coco category", () => {
    const myLabelClass = createLabelClass("My Label Class");
    const cocoCategory = convertLabelClassToCocoCategory(myLabelClass, 1);
    const expectedCocoCategory: CocoCategory = {
      id: 1,
      name: "My Label Class",
      supercategory: "",
    };
    expect(cocoCategory).toEqual(expectedCocoCategory);
  });

  it("converts some label classes to coco categories", () => {
    const labelClassList = [
      createLabelClass("a-label-class"),
      createLabelClass("another-label-class"),
    ];
    const { cocoCategories, labelClassIdsMap } =
      convertLabelClassesToCocoCategories(labelClassList);
    const expectedCocoCategories = [{ id: 1 }, { id: 2 }];
    const expectedLabelClassIdsMap = {
      "id-a-label-class": 1,
      "id-another-label-class": 2,
    };
    expect(cocoCategories).toMatchObject(expectedCocoCategories);
    expect(labelClassIdsMap).toMatchObject(expectedLabelClassIdsMap);
  });

  it("converts a label to a coco annotation with a category", () => {
    const label = createLabelWithImageDimensions("a-label-id", "an-image-id");
    const cocoAnnotation = convertLabelToCocoAnnotation(label, 1, 42, 3);
    const expectedAnnotation: CocoAnnotation = {
      id: 1,
      image_id: 42,
      category_id: 3,
      segmentation: [[1, 198, 1, 194, 4, 194, 4, 198, 1, 198]],
      area: 12,
      bbox: [1, 194, 3, 4],
      iscrowd: 0,
    };
    expect(cocoAnnotation).toEqual(expectedAnnotation);
  });

  it("converts a label class to coco annotation and assign it to a category", () => {
    const label = createLabelWithImageDimensions("a-label-id", "an-image-id");
    const cocoAnnotation = convertLabelToCocoAnnotation(label, 1, 42, 1);
    const expectedAnnotation: Partial<CocoAnnotation> = { category_id: 1 };
    expect(cocoAnnotation).toMatchObject(expectedAnnotation);
  });

  it("converts some labels to coco annotations and assign them to an image without id offset", () => {
    const labels = [
      createLabelWithImageDimensions(
        "a-label-id",
        "an-image-id",
        "id-a-label-class"
      ),
      createLabelWithImageDimensions(
        "another-label-id",
        "an-image-id",
        "id-another-label-class"
      ),
    ];
    const imageIdsMap = { "an-image-id": 1 };
    const labelClassIdMap = {
      "id-a-label-class": 1,
      "id-another-label-class": 2,
    };
    const cocoAnnotations = convertLabelsOfImageToCocoAnnotations(
      labels,
      imageIdsMap,
      labelClassIdMap
    );
    const expectedAnnotations = [
      { id: 1, image_id: 1, category_id: 1 },
      { id: 2, image_id: 1, category_id: 2 },
    ];
    expect(cocoAnnotations).toMatchObject(expectedAnnotations);
  });

  it("converts an image to coco json image", async () => {
    const image = createImage("an-image", 1, 2);
    expect(
      await convertImageToCocoImage(
        image,
        1,
        {
          avoidImageNameCollisions: true,
        },
        {} as Context
      )
    ).toEqual({
      id: 1,
      date_captured: date,
      height: 1,
      width: 2,
      coco_url: "https://an-image",
      labelflow_url: fakeImageUrl,
      file_name: "an-image_id-an-image.png",
      license: 0,
    });
    expect(
      await convertImageToCocoImage(
        image,
        1,
        {
          avoidImageNameCollisions: false,
        },
        {} as Context
      )
    ).toEqual({
      id: 1,
      date_captured: date,
      height: 1,
      width: 2,
      coco_url: "https://an-image",
      labelflow_url: fakeImageUrl,
      file_name: "an-image.png",
      license: 0,
    });
  });

  it("converts a list of images to coco images", async () => {
    const images = [
      createImage("an-image", 1, 2),
      createImage("another-image", 3, 4),
    ];
    const { cocoImages, imageIdsMap } = await convertImagesToCocoImages(
      images,
      {
        avoidImageNameCollisions: false,
      },
      {} as Context
    );
    const expectedCocoImage = [{ id: 1 }, { id: 2 }];
    const expectedMapping = { "id-an-image": 1, "id-another-image": 2 };
    expect(cocoImages).toMatchObject(expectedCocoImage);
    expect(imageIdsMap).toEqual(expectedMapping);
  });

  it("converts a set of images and label classes to a coco dataset", async () => {
    const labelClass1 = createLabelClass("label-class-1");
    const labelClass2 = createLabelClass("label-class-2");
    const image1 = createImage("image-1", 1, 2);
    const image2 = createImage("image-2", 1, 2);
    const label1 = createLabelWithImageDimensions(
      "id-label-1",
      image1.id,
      labelClass1.id
    );
    const label2 = createLabelWithImageDimensions(
      "id-label-2",
      image1.id,
      labelClass2.id
    );
    const label3 = createLabelWithImageDimensions(
      "id-label-3",
      image2.id,
      labelClass2.id
    );
    const expectedCocoDataset = {
      ...initialCocoDataset, // default coco dataset
      categories: [{ id: 1 }, { id: 2 }],
      images: [{ id: 1 }, { id: 2 }],
      annotations: [
        { id: 1, image_id: 1, category_id: 1 },
        { id: 2, image_id: 1, category_id: 2 },
        { id: 3, image_id: 2, category_id: 2 },
      ],
    };
    expect(
      await convertLabelflowDatasetToCocoDataset(
        [image1, image2],
        [label1, label2, label3],
        [labelClass1, labelClass2],
        { avoidImageNameCollisions: false },
        {} as Context
      )
    ).toMatchObject(expectedCocoDataset);
  });

  it("converts polygon geometry into segmentation", () => {
    const polygonGeometry = {
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
    };
    const imageDimensions = { width: 600, height: 200 };
    const expectedSegmentation = [[1, 198, 1, 194, 4, 194, 4, 198, 1, 198]];
    expect(
      convertGeometryToSegmentation(polygonGeometry, imageDimensions.height)
    ).toEqual(expectedSegmentation);
  });

  it("converts multipolygon geometry into segmentation", () => {
    const multiPolygonGeometry = {
      type: "MultiPolygon",
      coordinates: [
        [
          [
            [0, 0],
            [3, 0],
            [1.5, 1.5],
            [0, 0],
          ],
        ],
        [
          [
            [0, 3],
            [3, 3],
            [1.5, 1.5],
            [0, 3],
          ],
        ],
      ],
    };
    const imageDimensions = { width: 600, height: 200 };
    const expectedSegmentation = [
      [0, 200, 3, 200, 1.5, 198.5, 0, 200],
      [0, 197, 3, 197, 1.5, 198.5, 0, 197],
    ];
    expect(
      convertGeometryToSegmentation(
        multiPolygonGeometry,
        imageDimensions.height
      )
    ).toEqual(expectedSegmentation);
  });

  it("converts multipolygon geometry with hole into segmentation without hole", () => {
    const multiPolygonGeometry = {
      type: "MultiPolygon",
      coordinates: [
        [
          [
            [0, 0],
            [3, 0],
            [3, 3],
            [0, 3],
            [0, 0],
          ],
          [
            [1, 1],
            [2, 1],
            [2, 2],
            [1, 2],
            [1, 1],
          ],
        ],
      ],
    };
    const imageDimensions = { width: 600, height: 200 };
    const expectedSegmentation = [[0, 200, 3, 200, 3, 197, 0, 197, 0, 200]];
    expect(
      convertGeometryToSegmentation(
        multiPolygonGeometry,
        imageDimensions.height
      )
    ).toEqual(expectedSegmentation);
  });
});

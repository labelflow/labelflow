import "fake-indexeddb/auto";
import gql from "graphql-tag";
import { v4 as uuidv4 } from "uuid";
import { client } from "../../index";
import {
  convertLabelClassToCocoCategory,
  CocoCategory,
  convertLabelClassesToCocoCategories,
  CocoAnnotation,
  convertLabelToCocoAnnotation,
  convertLabelsOfImageToCocoAnnotations,
  CacheLabelClassIdToCocoCategoryId,
  convertImageToCocoImage,
  CocoImage,
  CocoDataset,
  addImageToCocoDataset,
  convertImagesAndLabelClassesToCocoDataset,
} from "../export-to-coco";
import type { Label, LabelClass, Image } from "../../../../types.generated";

/**
 * We bypass the structured clone algorithm as its current js implementation
 * as its current js implementation doesn't support blobs.
 * It might make our tests a bit different from what would actually happen
 * in a browser.
 */
jest.mock("fake-indexeddb/build/lib/structuredClone", () => ({
  default: (i: any) => i,
}));

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => "mockedUrl");
});

describe("Atomic converters", () => {
  const date = new Date("1995-12-17T03:24:00").toISOString();

  const createLabelClass = (name: string): LabelClass => ({
    id: uuidv4(),
    createdAt: date,
    updatedAt: date,
    name,
    color: "#000000",
    labels: [],
  });

  test("Should create coco json category from a label class", () => {
    const myLabelClass = createLabelClass("My Label Class");

    const cocoCategory = convertLabelClassToCocoCategory(myLabelClass, 1);

    const expectedCocoCategory: CocoCategory = {
      id: 1,
      name: "My Label Class",
      supercategory: "",
    };

    expect(cocoCategory).toEqual(expectedCocoCategory);
  });

  test("Should create coco json categories from label classes", () => {
    const labelClassList = [
      createLabelClass("Class 1"),
      createLabelClass("Class 2"),
    ];

    const cocoCategories = convertLabelClassesToCocoCategories(labelClassList);

    const expectedCocoCategories: CocoCategory[] = [
      {
        id: 1,
        name: "Class 1",
        supercategory: "",
      },
      {
        id: 2,
        name: "Class 2",
        supercategory: "",
      },
    ];

    expect(cocoCategories).toEqual(expectedCocoCategories);
  });

  test("Should create coco json annotation from a label without label class", () => {
    const label: Label = {
      id: "test",
      createdAt: date,
      updatedAt: date,
      height: 4,
      imageId: "image-1",
      width: 2,
      x: 0,
      y: 1,
    };

    const cocoAnnotation = convertLabelToCocoAnnotation(label, 1, 42);

    const expectedAnnotation: CocoAnnotation = {
      id: 1,
      image_id: 42,
      category_id: null,
      segmentation: [],
      area: 8,
      bbox: [0, 1, 2, 4],
      iscrowd: 0,
    };

    expect(cocoAnnotation).toEqual(expectedAnnotation);
  });

  test("Should create coco json annotation from a label with label class", () => {
    const label: Label = {
      id: "test",
      createdAt: date,
      updatedAt: date,
      height: 4,
      imageId: "image-1",
      width: 2,
      x: 0,
      y: 1,
    };

    const cocoAnnotation = convertLabelToCocoAnnotation(label, 1, 42, 0);

    const expectedAnnotation: CocoAnnotation = {
      id: 1,
      image_id: 42,
      category_id: 0,
      segmentation: [],
      area: 8,
      bbox: [0, 1, 2, 4],
      iscrowd: 0,
    };

    expect(cocoAnnotation).toEqual(expectedAnnotation);
  });

  test("Should create coco json annotations from labels of one image without id offset", () => {
    const labels: Label[] = [
      {
        id: "test0",
        createdAt: date,
        updatedAt: date,
        height: 4,
        imageId: "image-1",
        width: 2,
        x: 0,
        y: 1,
        labelClass: {
          id: "labelClassId0",
          name: "labelClass0",
          createdAt: date,
          updatedAt: date,
          color: "#000000",
          labels: [],
        },
      },
      {
        id: "test1",
        createdAt: date,
        updatedAt: date,
        height: 4,
        imageId: "image-1",
        width: 2,
        x: 0,
        y: 1,
        labelClass: {
          id: "labelClassId1",
          name: "labelClass1",
          createdAt: date,
          updatedAt: date,
          color: "#000000",
          labels: [],
        },
      },
    ];

    const mapping: CacheLabelClassIdToCocoCategoryId = new Map();
    mapping.set("labelClassId1", 0);
    mapping.set("labelClassId0", 1);

    const cocoAnnotations = convertLabelsOfImageToCocoAnnotations(
      labels,
      1,
      mapping
    );

    const expectedAnnotations: CocoAnnotation[] = [
      {
        id: 1,
        image_id: 1,
        category_id: 1,
        segmentation: [],
        area: 8,
        bbox: [0, 1, 2, 4],
        iscrowd: 0,
      },
      {
        id: 2,
        image_id: 1,
        category_id: 0,
        segmentation: [],
        area: 8,
        bbox: [0, 1, 2, 4],
        iscrowd: 0,
      },
    ];

    expect(cocoAnnotations).toEqual(expectedAnnotations);
  });

  test("Should create coco json annotations from labels of one image with id offset", () => {
    const labels: Label[] = [
      {
        id: "test0",
        createdAt: date,
        updatedAt: date,
        height: 4,
        imageId: "image-1",
        width: 2,
        x: 0,
        y: 1,
        labelClass: {
          id: "labelClassId0",
          name: "labelClass0",
          createdAt: date,
          updatedAt: date,
          color: "#000000",
          labels: [],
        },
      },
      {
        id: "test1",
        createdAt: date,
        updatedAt: date,
        height: 4,
        imageId: "image-1",
        width: 2,
        x: 0,
        y: 1,
        labelClass: {
          id: "labelClassId1",
          name: "labelClass1",
          createdAt: date,
          updatedAt: date,
          color: "#000000",
          labels: [],
        },
      },
    ];

    const mapping: CacheLabelClassIdToCocoCategoryId = new Map();
    mapping.set("labelClassId1", 0);
    mapping.set("labelClassId0", 1);

    const cocoAnnotations = convertLabelsOfImageToCocoAnnotations(
      labels,
      1,
      mapping,
      5
    );

    const expectedAnnotations: CocoAnnotation[] = [
      {
        id: 5,
        image_id: 1,
        category_id: 1,
        segmentation: [],
        area: 8,
        bbox: [0, 1, 2, 4],
        iscrowd: 0,
      },
      {
        id: 6,
        image_id: 1,
        category_id: 0,
        segmentation: [],
        area: 8,
        bbox: [0, 1, 2, 4],
        iscrowd: 0,
      },
    ];

    expect(cocoAnnotations).toEqual(expectedAnnotations);
  });

  test("Should create coco json image from an image", () => {
    const myImage: Image = {
      id: "myImageId",
      name: "myImage.ext",
      createdAt: date,
      updatedAt: date,
      height: 100,
      width: 200,
      labels: [],
      url: "myUrl",
    };

    const cocoImage = convertImageToCocoImage(myImage, 1);

    const expectedCocoImage: CocoImage = {
      id: 1,
      date_captured: date,
      height: 100,
      width: 200,
      coco_url: "myUrl",
      file_name: "myImage.ext",
      flickr_url: "",
      license: 0,
    };

    expect(cocoImage).toEqual(expectedCocoImage);
  });

  test("Should add coco json image and annotations from an image to an existing coco dataset", () => {
    const cocoDataset: CocoDataset = {
      info: {
        contributor: "",
        date_created: "",
        description: "",
        url: "",
        version: "",
        year: "",
      },
      licenses: [
        {
          name: "",
          id: 0,
          url: "",
        },
      ],
      annotations: [
        {
          id: 1,
          image_id: 1,
          category_id: 1,
          segmentation: [],
          area: 8,
          bbox: [0, 1, 2, 4],
          iscrowd: 0,
        },
        {
          id: 2,
          image_id: 1,
          category_id: 0,
          segmentation: [],
          area: 8,
          bbox: [0, 1, 2, 4],
          iscrowd: 0,
        },
      ],
      categories: [
        {
          id: 1,
          name: "Class 1",
          supercategory: "",
        },
        {
          id: 2,
          name: "Class 2",
          supercategory: "",
        },
      ],
      images: [
        {
          id: 1,
          date_captured: date,
          height: 100,
          width: 200,
          coco_url: "myUrl",
          file_name: "myImage.ext",
          flickr_url: "",
          license: 0,
        },
      ],
    };

    const mapping: CacheLabelClassIdToCocoCategoryId = new Map();
    mapping.set("labelClassId1", 0);
    mapping.set("labelClassId0", 1);

    const myImage: Image = {
      id: "myImageId1",
      name: "myImage1.ext",
      createdAt: date,
      updatedAt: date,
      height: 200,
      width: 300,
      labels: [
        {
          id: "test",
          createdAt: date,
          updatedAt: date,
          height: 2,
          imageId: "myImageId1",
          width: 2,
          x: 0,
          y: 1,
          labelClass: {
            id: "labelClassId1",
            createdAt: date,
            updatedAt: date,
            name: "labelClass1",
            color: "#000000",
            labels: [],
          },
        },
      ],
      url: "myUrl1",
    };

    const cocoDatasetNew = addImageToCocoDataset(mapping)(cocoDataset, myImage);

    const expectedCocoDatasetNew: CocoDataset = {
      info: {
        contributor: "",
        date_created: "",
        description: "",
        url: "",
        version: "",
        year: "",
      },
      licenses: [
        {
          name: "",
          id: 0,
          url: "",
        },
      ],
      annotations: [
        {
          id: 1,
          image_id: 1,
          category_id: 1,
          segmentation: [],
          area: 8,
          bbox: [0, 1, 2, 4],
          iscrowd: 0,
        },
        {
          id: 2,
          image_id: 1,
          category_id: 0,
          segmentation: [],
          area: 8,
          bbox: [0, 1, 2, 4],
          iscrowd: 0,
        },
        {
          id: 3,
          image_id: 2,
          category_id: 0,
          segmentation: [],
          area: 4,
          bbox: [0, 1, 2, 2],
          iscrowd: 0,
        },
      ],
      categories: [
        {
          id: 1,
          name: "Class 1",
          supercategory: "",
        },
        {
          id: 2,
          name: "Class 2",
          supercategory: "",
        },
      ],
      images: [
        {
          id: 1,
          date_captured: date,
          height: 100,
          width: 200,
          coco_url: "myUrl",
          file_name: "myImage.ext",
          flickr_url: "",
          license: 0,
        },
        {
          id: 2,
          date_captured: date,
          height: 200,
          width: 300,
          coco_url: "myUrl1",
          file_name: "myImage1.ext",
          flickr_url: "",
          license: 0,
        },
      ],
    };

    expect(cocoDatasetNew).toEqual(expectedCocoDatasetNew);
  });

  test("Should return coco dataset from images and labelClasses", () => {
    const images = [
      {
        id: "myImageId1",
        name: "myImage1.ext",
        createdAt: date,
        updatedAt: date,
        height: 100,
        width: 200,
        labels: [
          {
            id: "test",
            createdAt: date,
            updatedAt: date,
            height: 2,
            imageId: "myImageId1",
            width: 2,
            x: 0,
            y: 1,
            labelClass: {
              id: "labelClassId1",
              createdAt: date,
              updatedAt: date,
              name: "labelClass1",
              color: "#000000",
              labels: [],
            },
          },
          {
            id: "test-id-2",
            createdAt: date,
            updatedAt: date,
            height: 2,
            imageId: "myImageId1",
            width: 4,
            x: 0,
            y: 1,
            labelClass: {
              id: "labelClassId2",
              createdAt: date,
              updatedAt: date,
              name: "labelClass2",
              color: "#000000",
              labels: [],
            },
          },
        ],
        url: "myUrl1",
      },
      {
        id: "myImageId2",
        name: "myImage2.ext",
        createdAt: date,
        updatedAt: date,
        height: 200,
        width: 300,
        labels: [
          {
            id: "test",
            createdAt: date,
            updatedAt: date,
            height: 2,
            imageId: "myImageId2",
            width: 2,
            x: 0,
            y: 1,
            labelClass: {
              id: "labelClassId3",
              createdAt: date,
              updatedAt: date,
              name: "labelClass3",
              color: "#000000",
              labels: [],
            },
          },
        ],
        url: "myUrl2",
      },
    ];

    const labelClasses = [
      {
        id: "labelClassId1",
        createdAt: date,
        updatedAt: date,
        name: "labelClass1",
        color: "#000000",
        labels: [],
      },
      {
        id: "labelClassId2",
        createdAt: date,
        updatedAt: date,
        name: "labelClass2",
        color: "#000000",
        labels: [],
      },
      {
        id: "labelClassId3",
        createdAt: date,
        updatedAt: date,
        name: "labelClass3",
        color: "#000000",
        labels: [],
      },
    ];

    const expectCocoDataset: CocoDataset = {
      info: {
        contributor: "",
        date_created: "",
        description: "",
        url: "",
        version: "",
        year: "",
      },
      licenses: [
        {
          name: "",
          id: 0,
          url: "",
        },
      ],
      categories: [
        {
          id: 1,
          name: "labelClass1",
          supercategory: "",
        },
        {
          id: 2,
          name: "labelClass2",
          supercategory: "",
        },
        {
          id: 3,
          name: "labelClass3",
          supercategory: "",
        },
      ],
      images: [
        {
          id: 1,
          date_captured: date,
          height: 100,
          width: 200,
          coco_url: "myUrl1",
          file_name: "myImage1.ext",
          flickr_url: "",
          license: 0,
        },
        {
          id: 2,
          date_captured: date,
          height: 200,
          width: 300,
          coco_url: "myUrl2",
          file_name: "myImage2.ext",
          flickr_url: "",
          license: 0,
        },
      ],
      annotations: [
        {
          id: 1,
          image_id: 1,
          category_id: 1,
          segmentation: [],
          area: 4,
          bbox: [0, 1, 2, 2],
          iscrowd: 0,
        },
        {
          id: 2,
          image_id: 1,
          category_id: 2,
          segmentation: [],
          area: 8,
          bbox: [0, 1, 4, 2],
          iscrowd: 0,
        },
        {
          id: 3,
          image_id: 2,
          category_id: 3,
          segmentation: [],
          area: 4,
          bbox: [0, 1, 2, 2],
          iscrowd: 0,
        },
      ],
    };
    expect(
      convertImagesAndLabelClassesToCocoDataset(images, labelClasses)
    ).toEqual(expectCocoDataset);
  });
});

describe("Exporting a dataset to coco format", () => {
  test("The exportToCoco graphql endpoint returns something", async () => {
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
    ).toEqual("{}");
  });
});

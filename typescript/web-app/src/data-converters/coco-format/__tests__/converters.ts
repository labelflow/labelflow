import { Label, LabelClass, Image } from "../../../graphql-types.generated";
import {
  convertLabelClassToCocoCategory,
  convertLabelClassesToCocoCategories,
  convertLabelToCocoAnnotation,
  convertLabelsOfImageToCocoAnnotations,
  convertImageToCocoImage,
  addImageToCocoDataset,
  initialCocoDataset,
  convertImagesAndLabelClassesToCocoDataset,
} from "../converters";
import {
  CocoCategory,
  CocoAnnotation,
  CacheLabelClassIdToCocoCategoryId,
  CocoImage,
  CocoDataset,
} from "../types";

describe("Coco converters", () => {
  const date = new Date("1995-12-17T03:24:00").toISOString();

  const createLabelClass = (name: string): LabelClass => ({
    id: `id-${name}`,
    createdAt: date,
    updatedAt: date,
    name,
    color: "#000000",
    labels: [],
  });

  const createLabel = (
    id: string,
    imageId: string,
    labelClass?: LabelClass
  ): Label => ({
    id,
    createdAt: date,
    updatedAt: date,
    imageId,
    x: 1,
    y: 2,
    width: 3,
    height: 4,
    labelClass,
  });

  const createImage = (
    name: string,
    height: number,
    width: number,
    labels: Label[] = []
  ): Image => ({
    id: `id-${name}`,
    name: `${name}.ext`,
    createdAt: date,
    updatedAt: date,
    height,
    width,
    labels,
    url: `http://${name}`,
    path: "/path",
    mimetype: "file/ext",
  });

  test("Should convert a label class to a coco category", () => {
    const myLabelClass = createLabelClass("My Label Class");

    const cocoCategory = convertLabelClassToCocoCategory(myLabelClass, 1);

    const expectedCocoCategory: CocoCategory = {
      id: 1,
      name: "My Label Class",
      supercategory: "",
    };

    expect(cocoCategory).toEqual(expectedCocoCategory);
  });

  test("Should convert some label classes to coco categories", () => {
    const labelClassList = [
      createLabelClass("Label Class 1"),
      createLabelClass("Label Class 2"),
    ];

    const cocoCategories = convertLabelClassesToCocoCategories(labelClassList);

    const expectedCocoCategories: CocoCategory[] = [
      {
        id: 1,
        name: "Label Class 1",
        supercategory: "",
      },
      {
        id: 2,
        name: "Label Class 2",
        supercategory: "",
      },
    ];

    expect(cocoCategories).toEqual(expectedCocoCategories);
  });

  test("Should convert a label class to a coco annotation without category", () => {
    const label = createLabel("a-label-id", "an-image-id");

    const cocoAnnotation = convertLabelToCocoAnnotation(label, 1, 42, null);

    const expectedAnnotation: CocoAnnotation = {
      id: 1,
      image_id: 42,
      category_id: null,
      segmentation: [],
      area: 12,
      bbox: [1, 2, 3, 4],
      iscrowd: 0,
    };

    expect(cocoAnnotation).toEqual(expectedAnnotation);
  });

  test("Should convert a label class to coco annotation and assign it to a category", () => {
    const label = createLabel("a-label-id", "an-image-id");

    const cocoAnnotation = convertLabelToCocoAnnotation(label, 1, 42, 0);

    const expectedAnnotation: Partial<CocoAnnotation> = {
      id: 1,
      image_id: 42,
      category_id: 0,
      // ...
    };

    expect(cocoAnnotation).toEqual(expect.objectContaining(expectedAnnotation));
  });

  test("Should convert some labels to coco annotations and assign them to an image without id offset", () => {
    const labels: Label[] = [
      createLabel(
        "a-label-id",
        "fake-image-id",
        createLabelClass("a-label-class")
      ),
      createLabel(
        "another-label-id",
        "fake-image-id",
        createLabelClass("another-label-class")
      ),
    ];

    const mapping: CacheLabelClassIdToCocoCategoryId = new Map();
    mapping.set("id-a-label-class", 0);
    mapping.set("id-another-label-class", 1);

    const cocoAnnotations = convertLabelsOfImageToCocoAnnotations(
      labels,
      1,
      mapping
    );

    const expectedAnnotations: Partial<CocoAnnotation>[] = [
      {
        id: 1,
        image_id: 1,
        category_id: 0,
        // ...
      },
      {
        id: 2,
        image_id: 1,
        category_id: 1,
        // ...
      },
    ];

    expect(cocoAnnotations).toEqual(
      expect.arrayContaining([
        expect.objectContaining(expectedAnnotations[0]),
        expect.objectContaining(expectedAnnotations[1]),
      ])
    );
  });

  test("Should convert some labels to coco annotations and assign them to an image with id offset", () => {
    const labels: Label[] = [
      createLabel(
        "a-label-id",
        "fake-image-id",
        createLabelClass("a-label-class")
      ),
      createLabel(
        "another-label-id",
        "fake-image-id",
        createLabelClass("another-label-class")
      ),
    ];

    const mapping: CacheLabelClassIdToCocoCategoryId = new Map();
    mapping.set("id-a-label-class", 0);
    mapping.set("id-another-label-class", 1);

    const offset = 10;

    const cocoAnnotations = convertLabelsOfImageToCocoAnnotations(
      labels,
      1,
      mapping,
      offset
    );

    const expectedAnnotations: Partial<CocoAnnotation>[] = [
      {
        id: offset,
        // ...
      },
      {
        id: offset + 1,
        // ...
      },
    ];

    expect(cocoAnnotations).toEqual(
      expect.arrayContaining([
        expect.objectContaining(expectedAnnotations[0]),
        expect.objectContaining(expectedAnnotations[1]),
      ])
    );
  });

  test("Should create coco json image from an image", () => {
    const image = createImage("an-image", 1, 2);

    const cocoImage = convertImageToCocoImage(image, 1);

    const expectedCocoImage: CocoImage = {
      id: 1,
      date_captured: date,
      height: 1,
      width: 2,
      coco_url: "http://an-image",
      file_name: "an-image.ext",
      flickr_url: "",
      license: 0,
    };

    expect(cocoImage).toEqual(expectedCocoImage);
  });

  test("Should add coco json image and annotations from an image to a coco dataset without image", () => {
    const labelClass1 = createLabelClass("label-class-1");
    const labelClass2 = createLabelClass("label-class-2");

    const label1 = createLabel("id-label-1", "id-image-1", labelClass1);
    const label2 = createLabel("id-label-2", "id-image-1", labelClass2);
    const label3 = createLabel("id-label-3", "id-image-2", labelClass2);

    const image1 = createImage("image-1", 1, 2, [label1, label2]);
    const image2 = createImage("image-2", 1, 2, [label3]);

    const mapping: CacheLabelClassIdToCocoCategoryId = new Map();
    mapping.set("id-label-class-1", 1);
    mapping.set("id-label-class-2", 2);

    const aCocoDatasetWithoutImages = {
      ...initialCocoDataset, // default coco dataset
      categories: convertLabelClassesToCocoCategories([
        labelClass1,
        labelClass2,
      ]),
    };

    const cocoDatasetWithImage1 = addImageToCocoDataset(mapping)(
      aCocoDatasetWithoutImages,
      image1
    );

    const expectedCocoDatasetWithImage1: CocoDataset = {
      info: aCocoDatasetWithoutImages.info,
      licenses: aCocoDatasetWithoutImages.licenses,
      categories: aCocoDatasetWithoutImages.categories,
      annotations: [
        {
          id: 1,
          image_id: 1,
          category_id: 1,
          segmentation: [],
          area: 12,
          bbox: [1, 2, 3, 4],
          iscrowd: 0,
        },
        {
          id: 2,
          image_id: 1,
          category_id: 2,
          segmentation: [],
          area: 12,
          bbox: [1, 2, 3, 4],
          iscrowd: 0,
        },
      ],
      images: [
        {
          id: 1,
          date_captured: date,
          height: 1,
          width: 2,
          coco_url: "http://image-1",
          file_name: "image-1.ext",
          flickr_url: "",
          license: 0,
        },
      ],
    };

    expect(cocoDatasetWithImage1).toEqual(expectedCocoDatasetWithImage1);

    const cocoDatasetWithImage2 = addImageToCocoDataset(mapping)(
      cocoDatasetWithImage1,
      image2
    );

    const expectedCocoDatasetWithImage2: CocoDataset = {
      ...expectedCocoDatasetWithImage1,
      annotations: [
        ...expectedCocoDatasetWithImage1.annotations,
        {
          id: 3,
          image_id: 2,
          category_id: 2,
          segmentation: [],
          area: 12,
          bbox: [1, 2, 3, 4],
          iscrowd: 0,
        },
      ],
      images: [
        ...expectedCocoDatasetWithImage1.images,
        {
          id: 2,
          date_captured: date,
          height: 1,
          width: 2,
          coco_url: "http://image-2",
          file_name: "image-2.ext",
          flickr_url: "",
          license: 0,
        },
      ],
    };

    expect(cocoDatasetWithImage2).toEqual(expectedCocoDatasetWithImage2);
  });

  test("Should convert a set of images and label classes to a coco dataset", () => {
    const labelClass1 = createLabelClass("label-class-1");
    const labelClass2 = createLabelClass("label-class-2");

    const label1 = createLabel("id-label-1", "id-image-1", labelClass1);
    const label2 = createLabel("id-label-2", "id-image-1", labelClass2);
    const label3 = createLabel("id-label-3", "id-image-2", labelClass2);

    const image1 = createImage("image-1", 1, 2, [label1, label2]);
    const image2 = createImage("image-2", 1, 2, [label3]);

    const expectedCocoDataset: CocoDataset = {
      ...initialCocoDataset, // default coco dataset
      categories: convertLabelClassesToCocoCategories([
        labelClass1,
        labelClass2,
      ]),
      images: [
        {
          id: 1,
          date_captured: date,
          height: 1,
          width: 2,
          coco_url: "http://image-1",
          file_name: "image-1.ext",
          flickr_url: "",
          license: 0,
        },
        {
          id: 2,
          date_captured: date,
          height: 1,
          width: 2,
          coco_url: "http://image-2",
          file_name: "image-2.ext",
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
          area: 12,
          bbox: [1, 2, 3, 4],
          iscrowd: 0,
        },
        {
          id: 2,
          image_id: 1,
          category_id: 2,
          segmentation: [],
          area: 12,
          bbox: [1, 2, 3, 4],
          iscrowd: 0,
        },
        {
          id: 3,
          image_id: 2,
          category_id: 2,
          segmentation: [],
          area: 12,
          bbox: [1, 2, 3, 4],
          iscrowd: 0,
        },
      ],
    };

    expect(
      convertImagesAndLabelClassesToCocoDataset(
        [image1, image2],
        [labelClass1, labelClass2]
      )
    ).toEqual(expectedCocoDataset);
  });
});

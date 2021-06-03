import "fake-indexeddb/auto";
import gql from "graphql-tag";
import { v4 as uuidv4 } from "uuid";
import { client } from "../../index";
import {
  exportLabelClassToCoco,
  CocoCategory,
  exportLabelClassesToCoco,
  CocoAnnotation,
  exportLabelToCoco,
} from "../export-to-coco";
import type { Label, LabelClass } from "../../../../types.generated";

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

describe("to found", () => {
  const date = new Date("1995-12-17T03:24:00");

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

    const cocoCategory = exportLabelClassToCoco(myLabelClass, 1);

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

    const cocoCategories = exportLabelClassesToCoco(labelClassList);

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

    const cocoAnnotation = exportLabelToCoco(label, 1, 42, 0);

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

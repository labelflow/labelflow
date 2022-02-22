import { LabelType } from "@labelflow/graphql-types";
import { PartialDeep } from "type-fest";
import { Repository } from "..";
import { DbDataset, DbImage, DbLabel, DbLabelClass } from "../types";

const DATE = new Date("1995-12-17T03:24:00").toISOString();

export const DATASET_DATA: DbDataset = {
  id: "8f47e891-3b24-427a-8db0-dab362fbe269",
  name: "Test Dataset",
  slug: "test-dataset",
  createdAt: DATE,
  updatedAt: DATE,
  workspaceSlug: "full-user-workspace",
};

const IMAGES_DATA: DbImage[] = [
  {
    id: "9b8fb142-8388-11ec-a8ee-f7dcb0508f86",
    createdAt: DATE,
    updatedAt: DATE,
    name: "Test Image with labels 1",
    url: "https://localhost:3000/api/downloads/8f47e891-3b24-427a-8db0-dab362fbe269/9b8fb142-8388-11ec-a8ee-f7dcb0508f86.jpg/original.jpeg",
    path: "https://localhost:3000/api/downloads/8f47e891-3b24-427a-8db0-dab362fbe269/9b8fb142-8388-11ec-a8ee-f7dcb0508f86.jpg/original.jpeg",
    thumbnail200Url:
      "https://localhost:3000/api/downloads/8f47e891-3b24-427a-8db0-dab362fbe269/9b8fb142-8388-11ec-a8ee-f7dcb0508f86.jpg/t200.jpeg",
    mimetype: "image/jpeg",
    width: 1920,
    height: 1080,
  },
  {
    id: "a552037e-8388-11ec-965b-07327355c580",
    createdAt: DATE,
    updatedAt: DATE,
    name: "Test Image with labels 2",
    url: "https://localhost:3000/api/downloads/8f47e891-3b24-427a-8db0-dab362fbe269/a552037e-8388-11ec-965b-07327355c580.jpg/original.jpeg",
    path: "https://localhost:3000/api/downloads/8f47e891-3b24-427a-8db0-dab362fbe269/a552037e-8388-11ec-965b-07327355c580.jpg/original.jpeg",
    thumbnail200Url:
      "https://localhost:3000/api/downloads/8f47e891-3b24-427a-8db0-dab362fbe269/a552037e-8388-11ec-965b-07327355c580.jpg/t200.jpeg",
    mimetype: "image/jpeg",
    width: 320,
    height: 240,
  },
];

const LABEL_CLASSES_DATA: DbLabelClass[] = [
  {
    id: "05772060-8431-11ec-947b-dbafef54537e",
    createdAt: DATE,
    updatedAt: DATE,
    index: 0,
    name: "Test Class With Labels 1",
    color: "#F87171",
    datasetId: DATASET_DATA.id,
  },
  {
    id: "f4d74c6a-93eb-11ec-a379-d798908ff78b",
    createdAt: DATE,
    updatedAt: DATE,
    index: 1,
    name: "Test Class With Labels, 2",
    color: "#F87171",
    datasetId: DATASET_DATA.id,
  },
];

const LABELS_DATA: DbLabel[] = [
  {
    id: "05772060-8431-11ec-947b-dbafef54537e",
    createdAt: DATE,
    updatedAt: DATE,
    labelClassId: LABEL_CLASSES_DATA[0].id,
    imageId: IMAGES_DATA[0].id,
    type: LabelType.Box,
    x: 100,
    y: 200,
    width: 100,
    height: 100,
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [100, 200],
          [100, 300],
          [200, 300],
          [200, 200],
          [100, 200],
        ],
      ],
    },
  },
  {
    id: "a32ffc08-93ec-11ec-816d-2fbe527c5445",
    createdAt: DATE,
    updatedAt: DATE,
    labelClassId: LABEL_CLASSES_DATA[1].id,
    imageId: IMAGES_DATA[1].id,
    type: LabelType.Box,
    x: 100.1234,
    y: 200.1234,
    width: 100,
    height: 100,
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [100.1234, 200.1234],
          [100.1234, 300.1234],
          [200.1234, 300.1234],
          [200.1234, 200.1234],
          [100.1234, 200.1234],
        ],
      ],
    },
  },
];

export const MOCK_REPOSITORY: PartialDeep<Repository> = {
  dataset: {
    get: async (where) => {
      if (where?.id !== DATASET_DATA.id)
        throw new Error("Unexpected parameters");
      return DATASET_DATA;
    },
  },
  image: {
    list: async (where) => {
      if (where?.datasetId !== DATASET_DATA.id)
        throw new Error("Unexpected parameters");
      return IMAGES_DATA;
    },
  },
  labelClass: {
    list: async (where) => {
      if (where?.datasetId !== DATASET_DATA.id)
        throw new Error("Unexpected parameters");
      return LABEL_CLASSES_DATA;
    },
  },
  label: {
    list: async (where) => {
      if (where?.datasetId !== DATASET_DATA.id)
        throw new Error("Unexpected parameters");
      return LABELS_DATA;
    },
  },
};

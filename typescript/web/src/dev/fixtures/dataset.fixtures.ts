import { DatasetData, LabelClassData } from "./data-types";
import { LABEL_GEOMETRY_DATA } from "./label-geometry.fixtures";
import { WORKSPACE_DATA } from "./workspace.fixtures";

export const BASIC_DATASET_DATA: DatasetData = {
  id: "8f47e891-3b24-427a-8db0-dab362fbe269",
  name: "Test Dataset",
  slug: "test-dataset",
  workspace: WORKSPACE_DATA,
  labelClasses: [],
  images: [
    {
      id: "cae07de6-8054-11ec-9c81-fb4047302868",
      name: "Test Image",
      url: "https://localhost:3000/api/downloads/8f47e891-3b24-427a-8db0-dab362fbe269/cae07de6-8054-11ec-9c81-fb4047302868.jpg/original.jpeg",
      thumbnail200Url:
        "https://localhost:3000/api/downloads/8f47e891-3b24-427a-8db0-dab362fbe269/cae07de6-8054-11ec-9c81-fb4047302868.jpg/t200.jpeg",
      width: 800,
      height: 600,
      labels: [],
    },
  ],
};

export const DEEP_DATASET_WITH_IMAGES_DATA: DatasetData = {
  id: "4a672daa-8382-11ec-bf5d-d3ead45bcfd4",
  name: "Test Dataset With Images",
  slug: "test-dataset-with-images",
  workspace: WORKSPACE_DATA,
  labelClasses: [],
  images: [
    {
      id: "9b8fb142-8388-11ec-a8ee-f7dcb0508f86",
      name: "Test Image 1",
      url: "https://localhost:3000/api/downloads/8f47e891-3b24-427a-8db0-dab362fbe269/9b8fb142-8388-11ec-a8ee-f7dcb0508f86.jpg/original.jpeg",
      thumbnail200Url:
        "https://localhost:3000/api/downloads/8f47e891-3b24-427a-8db0-dab362fbe269/9b8fb142-8388-11ec-a8ee-f7dcb0508f86.jpg/t200.jpeg",
      width: 1920,
      height: 1080,
      labels: [],
    },
    {
      id: "a552037e-8388-11ec-965b-07327355c580",
      name: "Test Image 2",
      url: "https://localhost:3000/api/downloads/8f47e891-3b24-427a-8db0-dab362fbe269/a552037e-8388-11ec-965b-07327355c580.jpg/original.jpeg",
      thumbnail200Url:
        "https://localhost:3000/api/downloads/8f47e891-3b24-427a-8db0-dab362fbe269/a552037e-8388-11ec-965b-07327355c580.jpg/t200.jpeg",
      width: 320,
      height: 240,
      labels: [],
    },
    {
      id: "b54692ea-8388-11ec-9d20-f35e7c62c93f",
      name: "Test Image 3",
      url: "https://localhost:3000/api/downloads/8f47e891-3b24-427a-8db0-dab362fbe269/b54692ea-8388-11ec-9d20-f35e7c62c93f.jpg/original.jpeg",
      thumbnail200Url:
        "https://localhost:3000/api/downloads/8f47e891-3b24-427a-8db0-dab362fbe269/b54692ea-8388-11ec-9d20-f35e7c62c93f.jpg/t200.jpeg",
      width: 4000,
      height: 3000,
      labels: [],
    },
  ],
};

export const DEEP_DATASET_WITH_CLASSES_DATA: DatasetData = {
  id: "2f062478-aa66-4c77-be1a-bfbca1668695",
  name: "Test Dataset With Classes",
  slug: "test-dataset-with-classes",
  workspace: WORKSPACE_DATA,
  labelClasses: [
    {
      id: "cc4051a6-6ef3-49c2-92fa-f5b0eadb8934",
      index: 0,
      shortcut: "0",
      name: "Test Class 1",
      color: "#F87171",
      labelsAggregates: {
        totalCount: 10,
      },
    },
    {
      id: "534ead9b-174c-4fa9-afd9-5f5d0b203355",
      index: 1,
      shortcut: "1",
      name: "Test Class 2",
      color: "#FACC15",
      labelsAggregates: {
        totalCount: 12,
      },
    },
    {
      id: "73a020aa-dd5e-4d6f-985a-f43d9f2744d5",
      index: 2,
      shortcut: "2",
      name: "Test Class 3 has a very long name that is way larger than anyone would ever expect for a such a field with words that do not exist with many letters such as the following one which is very loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong",
      color: "#34D399",
      labelsAggregates: {
        totalCount: 5,
      },
    },
  ],
  images: [],
};

export const NESTED_LABEL_CLASS_IN_DATASET_WITH_LABELS_DATA: Omit<
  LabelClassData,
  "dataset"
> = {
  id: "05772060-8431-11ec-947b-dbafef54537e",
  index: 0,
  shortcut: "0",
  name: "Test Class With Labels 1",
  color: "#F87171",
  labelsAggregates: {
    totalCount: 3,
  },
};

export const DEEP_DATASET_WITH_LABELS_DATA: DatasetData = {
  id: "f1ff52b4-8430-11ec-8f62-d7976fd817ce",
  name: "Test Dataset With Labels",
  slug: "test-dataset-with-labels",
  workspace: WORKSPACE_DATA,
  labelClasses: [NESTED_LABEL_CLASS_IN_DATASET_WITH_LABELS_DATA],
  images: [
    {
      id: "9b8fb142-8388-11ec-a8ee-f7dcb0508f86",
      name: "Test Image with labels 1",
      url: "https://localhost:3000/api/downloads/8f47e891-3b24-427a-8db0-dab362fbe269/9b8fb142-8388-11ec-a8ee-f7dcb0508f86.jpg/original.jpeg",
      thumbnail200Url:
        "https://localhost:3000/api/downloads/8f47e891-3b24-427a-8db0-dab362fbe269/9b8fb142-8388-11ec-a8ee-f7dcb0508f86.jpg/t200.jpeg",
      width: 1920,
      height: 1080,
      labels: [
        {
          id: "59851562-8432-11ec-93d6-db8d4df02e96",
          labelClass: NESTED_LABEL_CLASS_IN_DATASET_WITH_LABELS_DATA,
          ...LABEL_GEOMETRY_DATA,
        },
      ],
    },
    {
      id: "a552037e-8388-11ec-965b-07327355c580",
      name: "Test Image with labels 2",
      url: "https://localhost:3000/api/downloads/8f47e891-3b24-427a-8db0-dab362fbe269/a552037e-8388-11ec-965b-07327355c580.jpg/original.jpeg",
      thumbnail200Url:
        "https://localhost:3000/api/downloads/8f47e891-3b24-427a-8db0-dab362fbe269/a552037e-8388-11ec-965b-07327355c580.jpg/t200.jpeg",
      width: 320,
      height: 240,
      labels: [
        {
          id: "c734ce86-8432-11ec-94cf-e3f8ed0b08cf",
          labelClass: NESTED_LABEL_CLASS_IN_DATASET_WITH_LABELS_DATA,
          ...LABEL_GEOMETRY_DATA,
        },
        {
          id: "c77f9394-8432-11ec-8acb-df36d1c4dabd",
          labelClass: NESTED_LABEL_CLASS_IN_DATASET_WITH_LABELS_DATA,
          ...LABEL_GEOMETRY_DATA,
        },
      ],
    },
  ],
};

import { LabelType } from "@labelflow/graphql-types";
import { isNil, range } from "lodash/fp";
import { AsyncReturnType, PartialDeep } from "type-fest";
import { v4 as uuid } from "uuid";
import { Repository } from "../index";
import { DbDataset, DbImage, DbLabel, DbLabelClass } from "../types";

const WORKSPACE_ID = "85456e6a-aa57-45e0-949f-5cc853f8d125";

const DATE = new Date("1995-12-17T03:24:00").toISOString();

const HISTORY_DATA = { createdAt: DATE, updatedAt: DATE };

export const DATASET_DATA: DbDataset = {
  ...HISTORY_DATA,
  id: "8f47e891-3b24-427a-8db0-dab362fbe269",
  name: "Test Dataset",
  slug: "test-dataset",
  workspaceSlug: "full-user-workspace",
};

const createImage = (
  index: number,
  id: string,
  width: number,
  height: number
): DbImage => {
  const key = `${WORKSPACE_ID}/${DATASET_DATA.id}/${id}.jpg`;
  const url = `https://localhost:3000/api/downloads/${key}`;
  return {
    ...HISTORY_DATA,
    id,
    mimetype: "image/jpeg",
    name: `Image ${index}`,
    url,
    path: url,
    thumbnail200Url: `${url}/thumbnails/200.jpeg`,
    width,
    height,
  };
};

const IMAGES_DATA: DbImage[] = [
  createImage(0, "9b8fb142-8388-11ec-a8ee-f7dcb0508f86", 1920, 1080),
  createImage(1, "a552037e-8388-11ec-965b-07327355c580", 320, 240),
];

const createLabelClass = (index: number): DbLabelClass => ({
  ...HISTORY_DATA,
  id: uuid(),
  index: 0,
  name: `Test Class ${index}`,
  color: "#F87171",
  datasetId: DATASET_DATA.id,
});

const LABEL_CLASSES_DATA: DbLabelClass[] = range(0, 2).map((index) =>
  createLabelClass(index)
);

const LABELS_DATA: DbLabel[] = [
  {
    ...HISTORY_DATA,
    id: "05772060-8431-11ec-947b-dbafef54537e",
    labelClassId: LABEL_CLASSES_DATA[0].id,
    imageId: IMAGES_DATA[0].id,
    type: LabelType.Box,
    x: 100,
    y: 200,
    width: 100,
    height: 200,
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [100, 100],
          [100, 300],
          [200, 300],
          [200, 100],
          [100, 100],
        ],
      ],
    },
  },
  {
    ...HISTORY_DATA,
    id: "a32ffc08-93ec-11ec-816d-2fbe527c5445",
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

type EntityKey = Extract<
  keyof Repository,
  "dataset" | "image" | "labelClass" | "label"
>;

type RepositoryFnKey<TRepositoryKey extends EntityKey> =
  TRepositoryKey extends "dataset"
    ? Extract<keyof Repository[TRepositoryKey], "get">
    : Extract<keyof Repository[TRepositoryKey], "list">;

type RepositoryFnWhere<
  TEntityKey extends EntityKey,
  TFnKey extends RepositoryFnKey<TEntityKey>
> = Parameters<Repository[TEntityKey][TFnKey]>[0];

type RepositoryFnReturnType<
  TEntityKey extends EntityKey,
  TFnKey extends RepositoryFnKey<TEntityKey>
> = NonNullable<AsyncReturnType<Repository[TEntityKey][TFnKey]>>;

// We don't use Extract since TS compiler does not correctly infer keyof RepositoryFnWhere<TEntityKey, TFnKey>
type IdProp<TEntityKey extends EntityKey> = TEntityKey extends "dataset"
  ? "id"
  : "datasetId";

const executeRepositoryMock = async <
  TEntityKey extends EntityKey,
  TFnKey extends RepositoryFnKey<TEntityKey>
>(
  data: RepositoryFnReturnType<TEntityKey, TFnKey>,
  datasetIdProp: IdProp<TEntityKey>,
  where: RepositoryFnWhere<TEntityKey, TFnKey>
): Promise<RepositoryFnReturnType<TEntityKey, TFnKey>> => {
  // Again, TS compiler does dot correctly infers keyof RepositoryFnWhere<TEntityKey, TFnKey>
  const whereHack = where as
    | Record<IdProp<TEntityKey>, "string">
    | undefined
    | null;
  if (isNil(whereHack) || whereHack[datasetIdProp] !== DATASET_DATA.id) {
    throw new Error("Unexpected parameters");
  }
  return data;
};

const createRepositoryMock = <
  TEntityKey extends EntityKey,
  TFnKey extends RepositoryFnKey<TEntityKey>
>(
  data: RepositoryFnReturnType<TEntityKey, TFnKey>,
  datasetIdProp: IdProp<TEntityKey>
) => {
  return (where: RepositoryFnWhere<TEntityKey, TFnKey>) =>
    executeRepositoryMock<TEntityKey, TFnKey>(data, datasetIdProp, where);
};

export const MOCK_REPOSITORY: PartialDeep<Repository> = {
  dataset: { get: createRepositoryMock<"dataset", "get">(DATASET_DATA, "id") },
  image: {
    list: createRepositoryMock<"image", "list">(IMAGES_DATA, "datasetId"),
  },
  labelClass: {
    list: createRepositoryMock<"labelClass", "list">(
      LABEL_CLASSES_DATA,
      "datasetId"
    ),
  },
  label: {
    list: createRepositoryMock<"label", "list">(LABELS_DATA, "datasetId"),
  },
};

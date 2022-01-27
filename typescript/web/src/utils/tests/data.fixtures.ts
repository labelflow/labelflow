import {
  Workspace,
  Dataset,
  LabelClass,
  LabelsAggregates,
} from "@labelflow/graphql-types";

declare type HasTypename = { __typename: string };

export type WorkspaceMock = HasTypename &
  Pick<Workspace, "__typename" | "slug">;

export type DatasetMock = HasTypename &
  Pick<Dataset, "__typename" | "id" | "name" | "slug"> & {
    labelClasses: Omit<LabelClassMock, "dataset">[];
    workspace: WorkspaceMock;
  };

export type LabelClassMock = HasTypename &
  Pick<LabelClass, "__typename" | "id" | "index" | "name" | "color"> & {
    shortcut: string;
    dataset: DatasetMock;
    labelsAggregates: HasTypename & LabelsAggregates;
  };

export const BASIC_WORKSPACE_MOCK: WorkspaceMock = {
  __typename: "Workspace",
  slug: "my-test-workspace",
};

export const BASIC_DATASET_MOCK: DatasetMock = {
  __typename: "Dataset",
  id: "8f47e891-3b24-427a-8db0-dab362fbe269",
  name: "My Test Dataset",
  slug: "my-test-dataset",
  workspace: BASIC_WORKSPACE_MOCK,
  labelClasses: [],
};

export const DEEP_DATASET_MOCK_WITH_CLASSES: DatasetMock = {
  __typename: "Dataset",
  id: "2f062478-aa66-4c77-be1a-bfbca1668695",
  name: "My Test Dataset With Classes",
  slug: "my-test-dataset-with-classes",
  workspace: BASIC_WORKSPACE_MOCK,
  labelClasses: [
    {
      __typename: "LabelClass",
      id: "cc4051a6-6ef3-49c2-92fa-f5b0eadb8934",
      index: 0,
      shortcut: "0",
      name: "My Test Class 1",
      color: "#F87171",
      labelsAggregates: {
        __typename: "LabelsAggregates",
        totalCount: 10,
      },
    },
    {
      __typename: "LabelClass",
      id: "534ead9b-174c-4fa9-afd9-5f5d0b203355",
      index: 1,
      shortcut: "1",
      name: "My Test Class 2",
      color: "#FACC15",
      labelsAggregates: {
        __typename: "LabelsAggregates",
        totalCount: 12,
      },
    },
    {
      __typename: "LabelClass",
      id: "73a020aa-dd5e-4d6f-985a-f43d9f2744d5",
      index: 2,
      shortcut: "2",
      name: "My Test Class 3 has a very long name that is way larger than anyone would ever expect for a such a field with words that do not exist with many letters such as the following one which is very loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong",
      color: "#34D399",
      labelsAggregates: {
        __typename: "LabelsAggregates",
        totalCount: 5,
      },
    },
  ],
};

export const BASIC_LABEL_CLASS_MOCK: LabelClassMock = {
  ...DEEP_DATASET_MOCK_WITH_CLASSES.labelClasses[0],
  dataset: DEEP_DATASET_MOCK_WITH_CLASSES,
};

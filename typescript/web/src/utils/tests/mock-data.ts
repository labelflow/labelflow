export const mockWorkspaceSimple = {
  slug: "my-test-workspace",
};

export const mockDatasetSimple = {
  id: "8f47e891-3b24-427a-8db0-dab362fbe269",
  name: "My Test Dataset",
  slug: "my-test-dataset",
  workspace: mockWorkspaceSimple,
};

export const mockLabelClassSimple = {
  id: "cc4051a6-6ef3-49c2-92fa-f5b0eadb8934",
  name: "My Test Class",
  color: "#F87171",
  dataset: mockDatasetSimple,
  labelClasses: [],
};

export const mockDatasetWithClasses = {
  id: "2f062478-aa66-4c77-be1a-bfbca1668695",
  name: "My Test Dataset With Classes",
  slug: "my-test-dataset-with-classes",
  workspace: mockWorkspaceSimple,
  labelClasses: [
    {
      id: "cc4051a6-6ef3-49c2-92fa-f5b0eadb8934",
      index: 0,
      name: "My Test Class 1",
      color: "#F87171",
      labelsAggregates: {
        totalCount: 10,
      },
    },
    {
      id: "534ead9b-174c-4fa9-afd9-5f5d0b203355",
      index: 1,
      name: "My Test Class 2",
      color: "#FACC15",
      labelsAggregates: {
        totalCount: 12,
      },
    },
    {
      id: "73a020aa-dd5e-4d6f-985a-f43d9f2744d5",
      index: 2,
      name: "My Test Class 3 has a very long name that is way larger than anyone would ever expect for a such a field with words that do not exist with many letters such as the following one which is very loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong",
      color: "#34D399",
      labelsAggregates: {
        totalCount: 5,
      },
    },
  ],
};

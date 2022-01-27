import { BASIC_DATASET_MOCK } from "../../utils/tests/data.fixtures";
import { ApolloMockResponse } from "../../utils/tests/apollo-mock";
import {
  createDatasetMutation,
  updateDatasetMutation,
  getDatasetByIdQuery,
  getDatasetBySlugQuery,
} from "./upsert-dataset-modal";

export const UPDATED_DATASET_MOCK_NAME = "My new test dataset";
export const UPDATED_DATASET_MOCK_SLUG = "my-new-test-dataset";

export const GET_DATASET_BY_ID_MOCK: ApolloMockResponse = {
  request: {
    query: getDatasetByIdQuery,
    variables: { id: BASIC_DATASET_MOCK.id },
  },
  result: {
    data: {
      dataset: { id: BASIC_DATASET_MOCK.id, name: BASIC_DATASET_MOCK.name },
    },
  },
};

export const GET_DATASET_BY_SLUG_MOCK: ApolloMockResponse = {
  request: {
    query: getDatasetBySlugQuery,
    variables: {
      slug: BASIC_DATASET_MOCK.slug,
      workspaceSlug: BASIC_DATASET_MOCK.workspace.slug,
    },
  },
  result: {
    data: {
      searchDataset: {
        id: BASIC_DATASET_MOCK.id,
        slug: BASIC_DATASET_MOCK.slug,
      },
    },
  },
};

export const GET_UPDATED_DATASET_BY_SLUG_MOCK: ApolloMockResponse = {
  request: {
    query: getDatasetBySlugQuery,
    variables: {
      slug: UPDATED_DATASET_MOCK_SLUG,
      workspaceSlug: BASIC_DATASET_MOCK.workspace.slug,
    },
  },
  result: {
    data: {
      searchDataset: {
        id: BASIC_DATASET_MOCK.id,
        slug: UPDATED_DATASET_MOCK_SLUG,
      },
    },
  },
};

export const CREATE_DATASET_MOCK: ApolloMockResponse = {
  request: {
    query: createDatasetMutation,
    variables: {
      name: BASIC_DATASET_MOCK.name,
      workspaceSlug: BASIC_DATASET_MOCK.workspace.slug,
    },
  },
  result: jest.fn(() => ({
    data: {
      createDataset: { id: BASIC_DATASET_MOCK.id },
    },
  })),
};

export const UPDATE_DATASET_MOCK: ApolloMockResponse = {
  request: {
    query: updateDatasetMutation,
    variables: {
      id: BASIC_DATASET_MOCK.id,
      name: UPDATED_DATASET_MOCK_NAME,
    },
  },
  result: jest.fn(() => ({
    data: {
      updateDataset: { id: BASIC_DATASET_MOCK.id },
    },
  })),
};

export const APOLLO_MOCKS: ApolloMockResponse[] = [
  GET_DATASET_BY_ID_MOCK,
  GET_DATASET_BY_SLUG_MOCK,
  GET_UPDATED_DATASET_BY_SLUG_MOCK,
  CREATE_DATASET_MOCK,
  UPDATE_DATASET_MOCK,
];

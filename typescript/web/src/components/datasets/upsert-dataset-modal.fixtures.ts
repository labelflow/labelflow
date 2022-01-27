import { BASIC_DATASET_MOCK } from "../../utils/tests/data.fixtures";
import {
  ApolloMockResponse,
  ApolloMockResponses,
} from "../../utils/tests/apollo-mock";
import {
  createDatasetMutation,
  updateDatasetMutation,
} from "./upsert-dataset-modal";
import {
  getDatasetByIdQuery,
  searchDatasetBySlugQuery,
} from "./datasets.query";
import {
  getDatasetById,
  getDatasetByIdVariables,
} from "./__generated__/getDatasetById";
import {
  searchDatasetBySlug,
  searchDatasetBySlugVariables,
} from "./__generated__/searchDatasetBySlug";
import {
  createDataset,
  createDatasetVariables,
} from "./__generated__/createDataset";
import {
  updateDataset,
  updateDatasetVariables,
} from "./__generated__/updateDataset";

export const UPDATED_DATASET_MOCK_NAME = "My new test dataset";
export const UPDATED_DATASET_MOCK_SLUG = "my-new-test-dataset";

export const GET_DATASET_BY_ID_MOCK: ApolloMockResponse<
  getDatasetByIdVariables,
  getDatasetById
> = {
  request: {
    query: getDatasetByIdQuery,
    variables: { id: BASIC_DATASET_MOCK.id },
  },
  result: {
    data: {
      dataset: {
        __typename: "Dataset",
        id: BASIC_DATASET_MOCK.id,
        name: BASIC_DATASET_MOCK.name,
      },
    },
  },
};

export const GET_DATASET_BY_SLUG_MOCK: ApolloMockResponse<
  searchDatasetBySlugVariables,
  searchDatasetBySlug
> = {
  request: {
    query: searchDatasetBySlugQuery,
    variables: {
      slug: BASIC_DATASET_MOCK.slug,
      workspaceSlug: BASIC_DATASET_MOCK.workspace.slug,
    },
  },
  result: {
    data: {
      searchDataset: {
        __typename: "Dataset",
        id: BASIC_DATASET_MOCK.id,
        slug: BASIC_DATASET_MOCK.slug,
      },
    },
  },
};

export const GET_UPDATED_DATASET_BY_SLUG_MOCK: ApolloMockResponse<
  searchDatasetBySlugVariables,
  searchDatasetBySlug
> = {
  request: {
    query: searchDatasetBySlugQuery,
    variables: {
      slug: UPDATED_DATASET_MOCK_SLUG,
      workspaceSlug: BASIC_DATASET_MOCK.workspace.slug,
    },
  },
  result: {
    data: {
      searchDataset: {
        __typename: "Dataset",
        id: BASIC_DATASET_MOCK.id,
        slug: UPDATED_DATASET_MOCK_SLUG,
      },
    },
  },
};

export const CREATE_DATASET_MOCK: ApolloMockResponse<
  createDatasetVariables,
  createDataset
> = {
  request: {
    query: createDatasetMutation,
    variables: {
      name: BASIC_DATASET_MOCK.name,
      workspaceSlug: BASIC_DATASET_MOCK.workspace.slug,
    },
  },
  result: jest.fn(() => ({
    data: {
      createDataset: { __typename: "Dataset", id: BASIC_DATASET_MOCK.id },
    },
  })),
};

export const UPDATE_DATASET_MOCK: ApolloMockResponse<
  updateDatasetVariables,
  updateDataset
> = {
  request: {
    query: updateDatasetMutation,
    variables: {
      id: BASIC_DATASET_MOCK.id,
      name: UPDATED_DATASET_MOCK_NAME,
    },
  },
  result: jest.fn(() => ({
    data: {
      updateDataset: { __typename: "Dataset", id: BASIC_DATASET_MOCK.id },
    },
  })),
};

export const APOLLO_MOCKS: ApolloMockResponses = [
  GET_DATASET_BY_ID_MOCK,
  GET_DATASET_BY_SLUG_MOCK,
  GET_UPDATED_DATASET_BY_SLUG_MOCK,
  CREATE_DATASET_MOCK,
  UPDATE_DATASET_MOCK,
];

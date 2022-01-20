import { BASIC_DATASET_MOCK } from "../../utils/tests/data.fixtures";
import {
  ApolloMockResponse,
  ApolloMockResponses,
} from "../../utils/tests/apollo-mock";
import {
  CREATE_DATASET_MUTATION,
  UPDATE_DATASET_MUTATION,
} from "./upsert-dataset-modal";
import {
  GET_DATASET_BY_ID_QUERY,
  SEARCH_DATASET_BY_SLUG_QUERY,
} from "./datasets.query";
import {
  GetDatasetByIdQuery,
  GetDatasetByIdQueryVariables,
} from "./__generated__/GetDatasetByIdQuery";
import {
  SearchDatasetBySlugQuery,
  SearchDatasetBySlugQueryVariables,
} from "./__generated__/SearchDatasetBySlugQuery";
import {
  CreateDatasetMutation,
  CreateDatasetMutationVariables,
} from "./__generated__/CreateDatasetMutation";
import {
  UpdateDatasetMutation,
  UpdateDatasetMutationVariables,
} from "./__generated__/UpdateDatasetMutation";

export const UPDATED_DATASET_MOCK_NAME = "My new test dataset";
export const UPDATED_DATASET_MOCK_SLUG = "my-new-test-dataset";

export const GET_DATASET_BY_ID_MOCK: ApolloMockResponse<
  GetDatasetByIdQueryVariables,
  GetDatasetByIdQuery
> = {
  request: {
    query: GET_DATASET_BY_ID_QUERY,
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
  SearchDatasetBySlugQueryVariables,
  SearchDatasetBySlugQuery
> = {
  request: {
    query: SEARCH_DATASET_BY_SLUG_QUERY,
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
  SearchDatasetBySlugQueryVariables,
  SearchDatasetBySlugQuery
> = {
  request: {
    query: SEARCH_DATASET_BY_SLUG_QUERY,
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
  CreateDatasetMutationVariables,
  CreateDatasetMutation
> = {
  request: {
    query: CREATE_DATASET_MUTATION,
    variables: {
      name: BASIC_DATASET_MOCK.name,
      workspaceSlug: BASIC_DATASET_MOCK.workspace.slug,
    },
  },
  result: jest.fn(() => ({
    data: {
      CreateDatasetMutation: {
        __typename: "Dataset",
        id: BASIC_DATASET_MOCK.id,
      },
    },
  })),
};

export const UPDATE_DATASET_MOCK: ApolloMockResponse<
  UpdateDatasetMutationVariables,
  UpdateDatasetMutation
> = {
  request: {
    query: UPDATE_DATASET_MUTATION,
    variables: {
      id: BASIC_DATASET_MOCK.id,
      name: UPDATED_DATASET_MOCK_NAME,
    },
  },
  result: jest.fn(() => ({
    data: {
      UpdateDatasetMutation: {
        __typename: "Dataset",
        id: BASIC_DATASET_MOCK.id,
      },
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

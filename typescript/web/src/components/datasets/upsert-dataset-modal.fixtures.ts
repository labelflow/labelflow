import {
  CreateDatasetMutation,
  CreateDatasetMutationVariables,
} from "../../graphql-types/CreateDatasetMutation";
import {
  GetDatasetByIdQuery,
  GetDatasetByIdQueryVariables,
} from "../../graphql-types/GetDatasetByIdQuery";
import {
  SearchDatasetBySlugQuery,
  SearchDatasetBySlugQueryVariables,
} from "../../graphql-types/SearchDatasetBySlugQuery";
import {
  UpdateDatasetMutation,
  UpdateDatasetMutationVariables,
} from "../../graphql-types/UpdateDatasetMutation";
import { BASIC_DATASET_DATA } from "../../utils/fixtures";
import { ApolloMockResponse, ApolloMockResponses } from "../../utils/tests";
import { CREATE_DATASET_MUTATION } from "./create-dataset.mutation";
import {
  GET_DATASET_BY_ID_QUERY,
  SEARCH_DATASET_BY_SLUG_QUERY,
} from "./datasets.query";
import { UPDATE_DATASET_MUTATION } from "./update-dataset.mutation";

export const UPDATED_DATASET_MOCK_NAME = "My new test dataset";
export const UPDATED_DATASET_MOCK_SLUG = "my-new-test-dataset";

export const GET_DATASET_BY_ID_MOCK: ApolloMockResponse<
  GetDatasetByIdQuery,
  GetDatasetByIdQueryVariables
> = {
  request: {
    query: GET_DATASET_BY_ID_QUERY,
    variables: { id: BASIC_DATASET_DATA.id },
  },
  result: {
    data: {
      dataset: {
        id: BASIC_DATASET_DATA.id,
        name: BASIC_DATASET_DATA.name,
      },
    },
  },
};

export const GET_DATASET_BY_SLUG_MOCK: ApolloMockResponse<
  SearchDatasetBySlugQuery,
  SearchDatasetBySlugQueryVariables
> = {
  request: {
    query: SEARCH_DATASET_BY_SLUG_QUERY,
    variables: {
      slug: BASIC_DATASET_DATA.slug,
      workspaceSlug: BASIC_DATASET_DATA.workspace.slug,
    },
  },
  result: {
    data: {
      searchDataset: {
        id: BASIC_DATASET_DATA.id,
        slug: BASIC_DATASET_DATA.slug,
      },
    },
  },
};

export const GET_UPDATED_DATASET_BY_SLUG_MOCK: ApolloMockResponse<
  SearchDatasetBySlugQuery,
  SearchDatasetBySlugQueryVariables
> = {
  request: {
    query: SEARCH_DATASET_BY_SLUG_QUERY,
    variables: {
      slug: UPDATED_DATASET_MOCK_SLUG,
      workspaceSlug: BASIC_DATASET_DATA.workspace.slug,
    },
  },
  result: {
    data: {
      searchDataset: {
        id: BASIC_DATASET_DATA.id,
        slug: UPDATED_DATASET_MOCK_SLUG,
      },
    },
  },
};

export const CREATE_DATASET_MOCK: ApolloMockResponse<
  CreateDatasetMutation,
  CreateDatasetMutationVariables
> = {
  request: {
    query: CREATE_DATASET_MUTATION,
    variables: {
      name: BASIC_DATASET_DATA.name,
      workspaceSlug: BASIC_DATASET_DATA.workspace.slug,
    },
  },
  result: () => ({
    data: {
      createDataset: {
        __typename: "Dataset",
        id: BASIC_DATASET_DATA.id,
      },
    },
  }),
};

export const UPDATE_DATASET_MOCK: ApolloMockResponse<
  UpdateDatasetMutation,
  UpdateDatasetMutationVariables
> = {
  request: {
    query: UPDATE_DATASET_MUTATION,
    variables: {
      id: BASIC_DATASET_DATA.id,
      name: UPDATED_DATASET_MOCK_NAME,
    },
  },
  result: () => ({
    data: {
      updateDataset: {
        __typename: "Dataset",
        id: BASIC_DATASET_DATA.id,
      },
    },
  }),
};

export const APOLLO_MOCKS: ApolloMockResponses = [
  GET_DATASET_BY_ID_MOCK,
  GET_DATASET_BY_SLUG_MOCK,
  GET_UPDATED_DATASET_BY_SLUG_MOCK,
  CREATE_DATASET_MOCK,
  UPDATE_DATASET_MOCK,
];

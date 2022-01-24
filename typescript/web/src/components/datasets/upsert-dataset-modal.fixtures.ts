import { MOCK_DATASET_SIMPLE } from "../../utils/tests/data.fixtures";
import { ApolloMocks } from "../../utils/tests/mock-apollo";
import {
  createDatasetMutation,
  updateDatasetMutation,
  getDatasetByIdQuery,
  getDatasetBySlugQuery,
} from "./upsert-dataset-modal";

export const MOCK_UPDATED_DATASET_NAME = "My new test dataset";
export const MOCK_UPDATED_DATASET_SLUG = "my-new-test-dataset";

export const APOLLO_MOCKS: ApolloMocks = {
  getDatasetById: {
    request: {
      query: getDatasetByIdQuery,
      variables: { id: MOCK_DATASET_SIMPLE.id },
    },
    result: {
      data: {
        dataset: { id: MOCK_DATASET_SIMPLE.id, name: MOCK_DATASET_SIMPLE.name },
      },
    },
  },
  getDatasetBySlug: {
    request: {
      query: getDatasetBySlugQuery,
      variables: {
        slug: MOCK_DATASET_SIMPLE.slug,
        workspaceSlug: MOCK_DATASET_SIMPLE.workspace.slug,
      },
    },
    result: {
      data: {
        searchDataset: {
          id: MOCK_DATASET_SIMPLE.id,
          slug: MOCK_DATASET_SIMPLE.slug,
        },
      },
    },
  },
  getUpdatedDatasetBySlug: {
    request: {
      query: getDatasetBySlugQuery,
      variables: {
        slug: MOCK_UPDATED_DATASET_SLUG,
        workspaceSlug: MOCK_DATASET_SIMPLE.workspace.slug,
      },
    },
    result: {
      data: {
        searchDataset: {
          id: MOCK_DATASET_SIMPLE.id,
          slug: MOCK_UPDATED_DATASET_SLUG,
        },
      },
    },
  },
  createDataset: {
    request: {
      query: createDatasetMutation,
      variables: {
        name: MOCK_DATASET_SIMPLE.name,
        workspaceSlug: MOCK_DATASET_SIMPLE.workspace.slug,
      },
    },
    result: jest.fn(() => ({
      data: {
        createDataset: { id: MOCK_DATASET_SIMPLE.id },
      },
    })),
  },
  updateDataset: {
    request: {
      query: updateDatasetMutation,
      variables: {
        id: MOCK_DATASET_SIMPLE.id,
        name: MOCK_UPDATED_DATASET_NAME,
      },
    },
    result: jest.fn(() => ({
      data: {
        updateDataset: { id: MOCK_DATASET_SIMPLE.id },
      },
    })),
  },
};

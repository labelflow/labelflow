import { MOCK_DATASET_SIMPLE } from "../../utils/tests/data.fixtures";
import { ApolloMocks } from "../../utils/tests/mock-apollo";
import {
  getDatasetByIdQuery,
  deleteDatasetByIdMutation,
} from "./delete-dataset-modal";

export const APOLLO_MOCKS: ApolloMocks = {
  getDatasetById: {
    request: {
      query: getDatasetByIdQuery,
      variables: { id: MOCK_DATASET_SIMPLE.id },
    },
    result: {
      data: { dataset: { name: MOCK_DATASET_SIMPLE.name } },
    },
  },
  deleteDatasetById: {
    request: {
      query: deleteDatasetByIdMutation,
      variables: { id: MOCK_DATASET_SIMPLE.id },
    },
    result: jest.fn(() => ({
      data: { deleteDataset: { id: MOCK_DATASET_SIMPLE.id } },
    })),
  },
};

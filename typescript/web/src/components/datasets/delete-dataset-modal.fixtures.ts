import { BASIC_DATASET_MOCK } from "../../utils/tests/data.fixtures";
import { ApolloMockResponse } from "../../utils/tests/apollo-mock";
import { deleteDatasetByIdMutation } from "./delete-dataset-modal";
import { getDatasetByIdQuery } from "./datasets.query";

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

export const DELETE_DATASET_BY_ID_MOCK: ApolloMockResponse = {
  request: {
    query: deleteDatasetByIdMutation,
    variables: { id: BASIC_DATASET_MOCK.id },
  },
  result: jest.fn(() => ({
    data: { deleteDataset: { id: BASIC_DATASET_MOCK.id } },
  })),
};

export const APOLLO_MOCKS: ApolloMockResponse[] = [
  GET_DATASET_BY_ID_MOCK,
  DELETE_DATASET_BY_ID_MOCK,
];

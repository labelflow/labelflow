import { BASIC_DATASET_MOCK } from "../../utils/tests/data.fixtures";
import {
  ApolloMockResponse,
  ApolloMockResponses,
} from "../../utils/tests/apollo-mock";
import { DELETE_DATASET_BY_ID_MUTATION } from "./delete-dataset-modal";
import {
  DeleteDatasetByIdMutation,
  DeleteDatasetByIdMutationVariables,
} from "./__generated__/DeleteDatasetByIdMutation";
import { GET_DATASET_BY_ID_MOCK } from "./upsert-dataset-modal.fixtures";

export const DELETE_DATASET_BY_ID_MOCK: ApolloMockResponse<
  DeleteDatasetByIdMutationVariables,
  DeleteDatasetByIdMutation
> = {
  request: {
    query: DELETE_DATASET_BY_ID_MUTATION,
    variables: { id: BASIC_DATASET_MOCK.id },
  },
  result: jest.fn(() => ({
    data: {
      deleteDataset: { __typename: "Dataset", id: BASIC_DATASET_MOCK.id },
    },
  })),
};

export const APOLLO_MOCKS: ApolloMockResponses = [
  GET_DATASET_BY_ID_MOCK,
  DELETE_DATASET_BY_ID_MOCK,
];

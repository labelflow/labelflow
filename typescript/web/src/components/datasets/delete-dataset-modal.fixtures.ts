import { BASIC_DATASET_DATA } from "../../utils/tests/data.fixtures";
import {
  ApolloMockResponse,
  ApolloMockResponses,
} from "../../utils/tests/apollo-mock";
import { DELETE_DATASET_BY_ID_MUTATION } from "./delete-dataset-modal";
import { GET_DATASET_BY_ID_MOCK } from "./upsert-dataset-modal.fixtures";
import {
  DeleteDatasetByIdMutation,
  DeleteDatasetByIdMutationVariables,
} from "../../graphql-types/DeleteDatasetByIdMutation";

export const DELETE_DATASET_BY_ID_MOCK: ApolloMockResponse<
  DeleteDatasetByIdMutation,
  DeleteDatasetByIdMutationVariables
> = {
  request: {
    query: DELETE_DATASET_BY_ID_MUTATION,
    variables: { id: BASIC_DATASET_DATA.id },
  },
  result: jest.fn(() => ({
    data: {
      deleteDataset: { __typename: "Dataset", id: BASIC_DATASET_DATA.id },
    },
  })),
};

export const APOLLO_MOCKS: ApolloMockResponses = [
  GET_DATASET_BY_ID_MOCK,
  DELETE_DATASET_BY_ID_MOCK,
];

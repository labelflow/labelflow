import { MATCH_ANY_PARAMETERS } from "wildcard-mock-link";
import { v4 as uuid } from "uuid";
import {
  CREATE_LABEL_MUTATION,
  DELETE_LABEL_MUTATION,
} from "../../../connectors/undo-store/effects/shared-queries";
import {
  CreateLabelActionMutation,
  CreateLabelActionMutationVariables,
} from "../../../graphql-types/CreateLabelActionMutation";
import {
  ApolloMockResponse,
  ApolloMockResponses,
} from "../../../utils/tests/apollo-mock";
import {
  DeleteLabelActionMutation,
  DeleteLabelActionMutationVariables,
} from "../../../graphql-types/DeleteLabelActionMutation";

export const CREATE_LABEL_ACTION_MOCK: ApolloMockResponse<
  CreateLabelActionMutation,
  CreateLabelActionMutationVariables
> = {
  request: {
    query: CREATE_LABEL_MUTATION,
    variables: MATCH_ANY_PARAMETERS,
  },
  nMatches: 2,
  result: jest.fn((variables) => ({
    data: { createLabel: { id: variables.data.id ?? uuid() } },
  })),
};

export const ERROR_CREATE_LABEL_ACTION_MOCK: ApolloMockResponse<
  CreateLabelActionMutation,
  CreateLabelActionMutationVariables
> = {
  request: {
    query: CREATE_LABEL_MUTATION,
    variables: MATCH_ANY_PARAMETERS,
  },
  error: new Error("Can't create label"),
};

export const DELETE_LABEL_ACTION_MOCK: ApolloMockResponse<
  DeleteLabelActionMutation,
  DeleteLabelActionMutationVariables
> = {
  request: {
    query: DELETE_LABEL_MUTATION,
    variables: MATCH_ANY_PARAMETERS,
  },
  result: jest.fn((variables) => ({
    data: { deleteLabel: { id: variables.id } },
  })),
};

export const APOLLO_MOCKS: ApolloMockResponses = [
  CREATE_LABEL_ACTION_MOCK,
  DELETE_LABEL_ACTION_MOCK,
];

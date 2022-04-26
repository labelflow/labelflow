import { FetchResult } from "@apollo/client";
import { v4 as uuid } from "uuid";
import { MATCH_ANY_PARAMETERS } from "wildcard-mock-link";
import {
  CreateLabelClassActionMutation,
  CreateLabelClassActionMutationVariables,
} from "../../../graphql-types/CreateLabelClassActionMutation";
import {
  DeleteLabelClassActionMutation,
  DeleteLabelClassActionMutationVariables,
} from "../../../graphql-types/DeleteLabelClassActionMutation";
import {
  GetLabelIdAndClassIdQuery,
  GetLabelIdAndClassIdQueryVariables,
} from "../../../graphql-types/GetLabelIdAndClassIdQuery";
import {
  UpdateLabelClassActionMutation,
  UpdateLabelClassActionMutationVariables,
} from "../../../graphql-types/UpdateLabelClassActionMutation";
import {
  ApolloMockResponse,
  ApolloMockResponses,
} from "../../../utils/tests/apollo-mock";
import {
  BASIC_LABEL_DATA,
  DEEP_DATASET_WITH_CLASSES_DATA,
} from "../../../utils/fixtures";
import {
  CREATE_LABEL_CLASS_QUERY,
  DELETE_LABEL_CLASS_MUTATION,
  GET_LABEL_QUERY,
  UPDATE_LABEL_MUTATION as UPDATE_LABEL_MUTATION_SHARED,
} from "./shared-queries";
import { UPDATE_LABEL_MUTATION as UPDATE_LABEL_CLASS_OF_LABEL_MUTATION } from "./update-label-class-of-label";

const [PREVIOUS_LABEL_CLASS_DATA] = DEEP_DATASET_WITH_CLASSES_DATA.labelClasses;

export const GET_LABEL_ID_AND_CLASS_ID_MOCK: ApolloMockResponse<
  GetLabelIdAndClassIdQuery,
  GetLabelIdAndClassIdQueryVariables
> = {
  request: {
    query: GET_LABEL_QUERY,
    variables: { id: BASIC_LABEL_DATA.id },
  },
  result: {
    data: {
      label: {
        id: BASIC_LABEL_DATA.id,
        labelClass: { id: PREVIOUS_LABEL_CLASS_DATA.id },
      },
    },
  },
};

export const createLabelClassActionMockResult = jest.fn(
  (
    variables: CreateLabelClassActionMutationVariables
  ): FetchResult<CreateLabelClassActionMutation> => ({
    data: {
      createLabelClass: {
        id: variables.data.id ?? uuid(),
        name: variables.data.name,
        color: variables.data.color ?? "#123456",
      },
    },
  })
);

export const CREATE_LABEL_CLASS_ACTION_MOCK: ApolloMockResponse<
  CreateLabelClassActionMutation,
  CreateLabelClassActionMutationVariables
> = {
  request: {
    query: CREATE_LABEL_CLASS_QUERY,
    variables: MATCH_ANY_PARAMETERS,
  },
  nMatches: 2,
  result: createLabelClassActionMockResult,
};

const updateLabelClassOfLabelMockResult = jest.fn(
  (
    variables: UpdateLabelClassActionMutationVariables
  ): FetchResult<UpdateLabelClassActionMutation> => ({
    data: {
      updateLabel: {
        id: variables.where.id,
        labelClass: {
          id: variables.data.labelClassId ?? uuid(),
        },
      },
    },
  })
);

export const UPDATE_LABEL_CLASS_ACTION_MOCK: ApolloMockResponse<
  UpdateLabelClassActionMutation,
  UpdateLabelClassActionMutationVariables
> = {
  request: {
    query: UPDATE_LABEL_MUTATION_SHARED,
    variables: MATCH_ANY_PARAMETERS,
  },
  nMatches: 3,
  result: updateLabelClassOfLabelMockResult,
};

export const UPDATE_LABEL_CLASS_OF_LABEL_MOCK: ApolloMockResponse<
  UpdateLabelClassActionMutation,
  UpdateLabelClassActionMutationVariables
> = {
  request: {
    query: UPDATE_LABEL_CLASS_OF_LABEL_MUTATION,
    variables: MATCH_ANY_PARAMETERS,
  },
  nMatches: 3,
  result: updateLabelClassOfLabelMockResult,
};

export const DELETE_LABEL_CLASS_ACTION_MOCK: ApolloMockResponse<
  DeleteLabelClassActionMutation,
  DeleteLabelClassActionMutationVariables
> = {
  request: {
    query: DELETE_LABEL_CLASS_MUTATION,
    variables: MATCH_ANY_PARAMETERS,
  },
  result: jest.fn((variables) => ({
    data: { deleteLabelClass: { id: variables.where.id } },
  })),
};

export const APOLLO_MOCKS: ApolloMockResponses = [
  GET_LABEL_ID_AND_CLASS_ID_MOCK,
  CREATE_LABEL_CLASS_ACTION_MOCK,
  UPDATE_LABEL_CLASS_ACTION_MOCK,
  UPDATE_LABEL_CLASS_OF_LABEL_MOCK,
  DELETE_LABEL_CLASS_ACTION_MOCK,
];

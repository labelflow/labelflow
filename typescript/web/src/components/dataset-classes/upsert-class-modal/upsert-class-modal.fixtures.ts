import { v4 as uuid } from "uuid";
import { pick } from "lodash/fp";
import { MATCH_ANY_PARAMETERS } from "wildcard-mock-link";
import {
  ApolloMockResponse,
  ApolloMockResponses,
} from "../../../utils/tests/apollo-mock";
import { DATASET_LABEL_CLASSES_QUERY } from "./dataset-label-classes.query";
import { CREATE_LABEL_CLASS_MUTATION } from "./create-label-class.mutation";
import { LABEL_CLASS_EXISTS_QUERY } from "./label-class-exists.query";
import { UPDATE_LABEL_CLASS_NAME_MUTATION } from "./update-label-class-name.mutation";
import {
  DEEP_DATASET_WITH_CLASSES_DATA,
  BASIC_LABEL_CLASS_DATA,
} from "../../../utils/tests/data.fixtures";
import {
  CreateLabelClassMutation,
  CreateLabelClassMutationVariables,
} from "../../../graphql-types/CreateLabelClassMutation";
import {
  GetDatasetLabelClassesQuery,
  GetDatasetLabelClassesQueryVariables,
} from "../../../graphql-types/GetDatasetLabelClassesQuery";
import {
  LabelClassExistsQuery,
  LabelClassExistsQueryVariables,
} from "../../../graphql-types/LabelClassExistsQuery";
import {
  UpdateLabelClassNameMutation,
  UpdateLabelClassNameMutationVariables,
} from "../../../graphql-types/UpdateLabelClassNameMutation";

export const UPDATED_LABEL_CLASS_MOCK_NAME = "My New Class Name";

export const GET_DATASET_WITH_LABEL_CLASSES_MOCK: ApolloMockResponse<
  GetDatasetLabelClassesQuery,
  GetDatasetLabelClassesQueryVariables
> = {
  request: {
    query: DATASET_LABEL_CLASSES_QUERY,
    variables: {
      workspaceSlug: DEEP_DATASET_WITH_CLASSES_DATA.workspace.slug,
      slug: DEEP_DATASET_WITH_CLASSES_DATA.slug,
    },
  },
  result: {
    data: {
      dataset: {
        ...pick(["id", "name", "slug"], DEEP_DATASET_WITH_CLASSES_DATA),
        labelClasses: DEEP_DATASET_WITH_CLASSES_DATA.labelClasses.map(
          (labelClass) => pick(["id", "name", "color"], labelClass)
        ),
      },
    },
  },
};

export const CREATE_LABEL_CLASS_DEFAULT_MOCK: ApolloMockResponse<
  CreateLabelClassMutation,
  CreateLabelClassMutationVariables
> = {
  request: {
    query: CREATE_LABEL_CLASS_MUTATION,
    variables: MATCH_ANY_PARAMETERS,
  },
  result: jest.fn((variables) => ({
    data: {
      createLabelClass: {
        __typename: "LabelClass",
        id: variables.id ?? uuid(),
        name: variables.name,
        color: variables.color,
      },
    },
  })),
};

export const GET_LABEL_CLASS_EXISTS_MOCK: ApolloMockResponse<
  LabelClassExistsQuery,
  LabelClassExistsQueryVariables
> = {
  request: {
    query: LABEL_CLASS_EXISTS_QUERY,
    variables: MATCH_ANY_PARAMETERS,
  },
  result: ({ datasetId, name }) => ({
    data: {
      labelClassExists:
        datasetId === BASIC_LABEL_CLASS_DATA.dataset.id &&
        name === BASIC_LABEL_CLASS_DATA.name,
    },
  }),
};

export const UPDATE_LABEL_CLASS_NAME_MOCK: ApolloMockResponse<
  UpdateLabelClassNameMutation,
  UpdateLabelClassNameMutationVariables
> = {
  request: {
    query: UPDATE_LABEL_CLASS_NAME_MUTATION,
    variables: {
      id: BASIC_LABEL_CLASS_DATA.id,
      name: UPDATED_LABEL_CLASS_MOCK_NAME,
    },
  },
  result: jest.fn(() => ({
    data: {
      updateLabelClass: {
        __typename: "LabelClass",
        id: BASIC_LABEL_CLASS_DATA.id,
        name: UPDATED_LABEL_CLASS_MOCK_NAME,
        color: BASIC_LABEL_CLASS_DATA.color,
      },
    },
  })),
};

export const APOLLO_MOCKS: ApolloMockResponses = [
  GET_DATASET_WITH_LABEL_CLASSES_MOCK,
  CREATE_LABEL_CLASS_DEFAULT_MOCK,
  GET_LABEL_CLASS_EXISTS_MOCK,
  UPDATE_LABEL_CLASS_NAME_MOCK,
];

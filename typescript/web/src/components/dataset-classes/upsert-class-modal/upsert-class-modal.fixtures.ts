import { FetchResult } from "@apollo/client";
import { pick } from "lodash/fp";
import { v4 as uuid } from "uuid";
import { MATCH_ANY_PARAMETERS } from "wildcard-mock-link";
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
import {
  BASIC_LABEL_CLASS_DATA,
  DEEP_DATASET_WITH_CLASSES_DATA,
} from "../../../utils/fixtures";
import {
  ApolloMockResponse,
  ApolloMockResponses,
} from "../../../utils/tests/apollo-mock";
import { CREATE_LABEL_CLASS_MUTATION } from "./create-label-class.mutation";
import { DATASET_LABEL_CLASSES_QUERY } from "./dataset-label-classes.query";
import { LABEL_CLASS_EXISTS_QUERY } from "./label-class-exists.query";
import { UPDATE_LABEL_CLASS_NAME_MUTATION } from "./update-label-class-name.mutation";

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

export const getCreateLabelClassMockResult = ({
  id,
  name,
  color,
}: CreateLabelClassMutationVariables): FetchResult<CreateLabelClassMutation> => ({
  data: { createLabelClass: { id: id ?? uuid(), name, color } },
});

export const CREATE_LABEL_CLASS_DEFAULT_MOCK: ApolloMockResponse<
  CreateLabelClassMutation,
  CreateLabelClassMutationVariables
> = {
  request: {
    query: CREATE_LABEL_CLASS_MUTATION,
    variables: MATCH_ANY_PARAMETERS,
  },
  result: getCreateLabelClassMockResult,
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

export const getUpdateLabelClassNameMockResult =
  (): FetchResult<UpdateLabelClassNameMutation> => ({
    data: {
      updateLabelClass: {
        id: BASIC_LABEL_CLASS_DATA.id,
        name: UPDATED_LABEL_CLASS_MOCK_NAME,
        color: BASIC_LABEL_CLASS_DATA.color,
      },
    },
  });

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
  result: getUpdateLabelClassNameMockResult,
};

export const APOLLO_MOCKS: ApolloMockResponses = [
  GET_DATASET_WITH_LABEL_CLASSES_MOCK,
  CREATE_LABEL_CLASS_DEFAULT_MOCK,
  GET_LABEL_CLASS_EXISTS_MOCK,
  UPDATE_LABEL_CLASS_NAME_MOCK,
];

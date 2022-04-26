import { pick } from "lodash/fp";
import { v4 as uuid } from "uuid";
import { MATCH_ANY_PARAMETERS } from "wildcard-mock-link";
import {
  CREATE_LABEL_CLASS_QUERY,
  GET_LABEL_QUERY,
  UPDATE_LABEL_MUTATION as UPDATE_LABEL_MUTATION_SHARED,
} from "../../connectors/undo-store/effects/shared-queries";
import { UPDATE_LABEL_MUTATION } from "../../connectors/undo-store/effects/update-label-class-of-label";
import {
  CreateLabelClassActionMutation,
  CreateLabelClassActionMutationVariables,
} from "../../graphql-types/CreateLabelClassActionMutation";
import {
  GetLabelClassesOfDatasetQuery,
  GetLabelClassesOfDatasetQueryVariables,
} from "../../graphql-types/GetLabelClassesOfDatasetQuery";
import {
  GetLabelClassQuery,
  GetLabelClassQueryVariables,
} from "../../graphql-types/GetLabelClassQuery";
import {
  GetLabelIdAndClassIdQuery,
  GetLabelIdAndClassIdQueryVariables,
} from "../../graphql-types/GetLabelIdAndClassIdQuery";
import {
  GetLabelWithLabelClassQuery,
  GetLabelWithLabelClassQueryVariables,
} from "../../graphql-types/GetLabelWithLabelClassQuery";
import {
  UpdateLabelClassActionMutation,
  UpdateLabelClassActionMutationVariables,
} from "../../graphql-types/UpdateLabelClassActionMutation";
import {
  UpdateLabelClassOfLabelMutation,
  UpdateLabelClassOfLabelMutationVariables,
} from "../../graphql-types/UpdateLabelClassOfLabelMutation";
import {
  BASIC_LABEL_DATA,
  DEEP_DATASET_WITH_CLASSES_DATA,
} from "../../utils/fixtures";
import { ApolloMockResponse, ApolloMockResponses } from "../../utils/tests";
import {
  GET_LABEL_CLASSES_OF_DATASET_QUERY,
  GET_LABEL_QUERY as GET_LABEL_WITH_LABEL_CLASS_QUERY,
  labelClassQuery,
} from "./openlayers-map/queries";

export const GET_LABEL_CLASSES_OF_DATASET_MOCK: ApolloMockResponse<
  GetLabelClassesOfDatasetQuery,
  GetLabelClassesOfDatasetQueryVariables
> = {
  request: {
    query: GET_LABEL_CLASSES_OF_DATASET_QUERY,
    variables: {
      slug: DEEP_DATASET_WITH_CLASSES_DATA.slug,
      workspaceSlug: DEEP_DATASET_WITH_CLASSES_DATA.workspace.slug,
    },
  },
  result: {
    data: {
      dataset: {
        id: DEEP_DATASET_WITH_CLASSES_DATA.id,
        labelClasses: DEEP_DATASET_WITH_CLASSES_DATA.labelClasses.map(
          (labelClass) => pick(["id", "name", "color"], labelClass)
        ),
      },
    },
  },
};

export const GET_LABEL_WITH_LABEL_CLASS_MOCK: ApolloMockResponse<
  GetLabelWithLabelClassQuery,
  GetLabelWithLabelClassQueryVariables
> = {
  request: {
    query: GET_LABEL_WITH_LABEL_CLASS_QUERY,
    variables: { id: BASIC_LABEL_DATA.id },
  },
  nMatches: Number.POSITIVE_INFINITY,
  result: {
    data: {
      label: {
        ...pick(["id", "type"], BASIC_LABEL_DATA),
        labelClass: pick(["id", "name", "color"], BASIC_LABEL_DATA.labelClass),
      },
    },
  },
};

export const getLabelClassMockResult = jest.fn(
  (variables: GetLabelClassQueryVariables) => {
    const expectedLabelClass = DEEP_DATASET_WITH_CLASSES_DATA.labelClasses[1];
    return {
      data: {
        labelClass:
          variables.id === expectedLabelClass.id
            ? pick(["id", "name", "color"], expectedLabelClass)
            : {
                id: variables.id,
                name: "uknown label class name",
                color: "#123456",
              },
      },
    };
  }
);

export const GET_LABEL_CLASS_MOCK: ApolloMockResponse<
  GetLabelClassQuery,
  GetLabelClassQueryVariables
> = {
  request: {
    query: labelClassQuery,
    variables: MATCH_ANY_PARAMETERS,
  },
  nMatches: Number.POSITIVE_INFINITY,
  result: getLabelClassMockResult,
};

export const GET_LABEL_ID_AND_CLASS_ID_MOCK: ApolloMockResponse<
  GetLabelIdAndClassIdQuery,
  GetLabelIdAndClassIdQueryVariables
> = {
  request: {
    query: GET_LABEL_QUERY,
    variables: { id: BASIC_LABEL_DATA.id },
  },
  nMatches: Number.POSITIVE_INFINITY,
  result: {
    data: {
      label: {
        id: BASIC_LABEL_DATA.id,
        labelClass: { id: BASIC_LABEL_DATA.labelClass.id },
      },
    },
  },
};

export const createLabelClassActionMockResult = jest.fn(
  ({ data: { id, name, color } }: CreateLabelClassActionMutationVariables) => ({
    data: {
      createLabelClass: {
        id: id ?? uuid(),
        name,
        color,
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
  result: createLabelClassActionMockResult,
};

export const updateLabelClassOfLabelMockResult = jest.fn(() => ({
  data: {
    updateLabel: {
      id: BASIC_LABEL_DATA.id,
      labelClass: { id: DEEP_DATASET_WITH_CLASSES_DATA.labelClasses[1].id },
    },
  },
}));

export const UPDATE_LABEL_CLASS_OF_LABEL_MOCK: ApolloMockResponse<
  UpdateLabelClassOfLabelMutation,
  UpdateLabelClassOfLabelMutationVariables
> = {
  request: {
    query: UPDATE_LABEL_MUTATION,
    variables: {
      where: { id: BASIC_LABEL_DATA.id },
      data: { labelClassId: DEEP_DATASET_WITH_CLASSES_DATA.labelClasses[1].id },
    },
  },
  result: updateLabelClassOfLabelMockResult,
};

export const updateLabelClassActionMockResult = jest.fn(
  (variables: UpdateLabelClassActionMutationVariables) => ({
    data: {
      updateLabel: {
        id: variables.where.id,
        labelClass: { id: variables.data.labelClassId! },
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
  nMatches: Number.POSITIVE_INFINITY,
  result: updateLabelClassActionMockResult,
};

export const APOLLO_MOCKS: ApolloMockResponses = [
  GET_LABEL_CLASSES_OF_DATASET_MOCK,
  GET_LABEL_WITH_LABEL_CLASS_MOCK,
  GET_LABEL_ID_AND_CLASS_ID_MOCK,
  GET_LABEL_CLASS_MOCK,
  CREATE_LABEL_CLASS_ACTION_MOCK,
  UPDATE_LABEL_CLASS_OF_LABEL_MOCK,
  UPDATE_LABEL_CLASS_ACTION_MOCK,
];

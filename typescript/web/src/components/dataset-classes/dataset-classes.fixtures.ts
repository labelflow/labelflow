import { pick } from "lodash";
import {
  ApolloMockResponse,
  ApolloMockResponses,
} from "../../utils/tests/apollo-mock";
import { DATASET_LABEL_CLASSES_QUERY_WITH_COUNT } from "./dataset-classes.query";
import {
  BASIC_DATASET_DATA,
  DEEP_DATASET_WITH_CLASSES_DATA,
} from "../../utils/tests/data.fixtures";
import { GET_LABEL_CLASS_BY_ID_MOCK } from "./delete-label-class-modal.fixtures";
import { GET_LABEL_CLASS_EXISTS_MOCK } from "./upsert-class-modal/upsert-class-modal.fixtures";
import {
  GetDatasetLabelClassesWithTotalCountQuery,
  GetDatasetLabelClassesWithTotalCountQueryVariables,
} from "../../graphql-types/GetDatasetLabelClassesWithTotalCountQuery";

export const GET_DATASET_WITHOUT_LABEL_CLASSES_MOCK: ApolloMockResponse<
  GetDatasetLabelClassesWithTotalCountQuery,
  GetDatasetLabelClassesWithTotalCountQueryVariables
> = {
  request: {
    query: DATASET_LABEL_CLASSES_QUERY_WITH_COUNT,
    variables: {
      workspaceSlug: BASIC_DATASET_DATA.workspace.slug,
      datasetSlug: BASIC_DATASET_DATA.slug,
    },
  },
  result: {
    data: {
      dataset: {
        ...pick(BASIC_DATASET_DATA, "id", "name"),
        labelClasses: [],
      },
    },
  },
};

export const GET_DATASET_WITH_LABEL_CLASSES_MOCK: ApolloMockResponse<
  GetDatasetLabelClassesWithTotalCountQuery,
  GetDatasetLabelClassesWithTotalCountQueryVariables
> = {
  request: {
    query: DATASET_LABEL_CLASSES_QUERY_WITH_COUNT,
    variables: {
      workspaceSlug: DEEP_DATASET_WITH_CLASSES_DATA.workspace.slug,
      datasetSlug: DEEP_DATASET_WITH_CLASSES_DATA.slug,
    },
  },
  result: {
    data: {
      dataset: {
        ...pick(DEEP_DATASET_WITH_CLASSES_DATA, "id", "name"),
        labelClasses: DEEP_DATASET_WITH_CLASSES_DATA.labelClasses.map(
          (labelClass) =>
            pick(labelClass, "id", "index", "name", "color", "labelsAggregates")
        ),
      },
    },
  },
};

export const APOLLO_MOCKS: ApolloMockResponses = [
  GET_LABEL_CLASS_BY_ID_MOCK,
  GET_LABEL_CLASS_EXISTS_MOCK,
  GET_DATASET_WITHOUT_LABEL_CLASSES_MOCK,
  GET_DATASET_WITH_LABEL_CLASSES_MOCK,
];

import { pick } from "lodash";
import { ApolloMockResponse } from "../../utils/tests/apollo-mock";
import { DATASET_LABEL_CLASSES_QUERY_WITH_COUNT } from "./dataset-classes.query";
import {
  BASIC_DATASET_MOCK,
  DEEP_DATASET_MOCK_WITH_CLASSES,
} from "../../utils/tests/data.fixtures";
import { GET_LABEL_CLASS_BY_ID_MOCK } from "./delete-label-class-modal.fixtures";
import { GET_LABEL_CLASS_EXISTS_MOCK } from "./upsert-class-modal/upsert-class-modal.fixtures";
import {
  getDatasetLabelClassesWithTotalCount,
  getDatasetLabelClassesWithTotalCountVariables,
} from "./__generated__/getDatasetLabelClassesWithTotalCount";

export const GET_DATASET_WITHOUT_LABEL_CLASSES_MOCK: ApolloMockResponse<
  getDatasetLabelClassesWithTotalCountVariables,
  getDatasetLabelClassesWithTotalCount
> = {
  request: {
    query: DATASET_LABEL_CLASSES_QUERY_WITH_COUNT,
    variables: {
      workspaceSlug: BASIC_DATASET_MOCK.workspace.slug,
      datasetSlug: BASIC_DATASET_MOCK.slug,
    },
  },
  result: {
    data: {
      dataset: {
        ...pick(BASIC_DATASET_MOCK, "__typename", "id", "name"),
        labelClasses: [],
      },
    },
  },
};

export const GET_DATASET_WITH_LABEL_CLASSES_MOCK: ApolloMockResponse<
  getDatasetLabelClassesWithTotalCountVariables,
  getDatasetLabelClassesWithTotalCount
> = {
  request: {
    query: DATASET_LABEL_CLASSES_QUERY_WITH_COUNT,
    variables: {
      workspaceSlug: DEEP_DATASET_MOCK_WITH_CLASSES.workspace.slug,
      datasetSlug: DEEP_DATASET_MOCK_WITH_CLASSES.slug,
    },
  },
  result: {
    data: {
      dataset: {
        ...pick(DEEP_DATASET_MOCK_WITH_CLASSES, "__typename", "id", "name"),
        labelClasses: DEEP_DATASET_MOCK_WITH_CLASSES.labelClasses.map(
          (labelClass) =>
            pick(
              labelClass,
              "__typename",
              "id",
              "index",
              "name",
              "color",
              "labelsAggregates"
            )
        ),
      },
    },
  },
};

export const APOLLO_MOCKS: ApolloMockResponse[] = [
  GET_LABEL_CLASS_BY_ID_MOCK,
  GET_LABEL_CLASS_EXISTS_MOCK,
  GET_DATASET_WITHOUT_LABEL_CLASSES_MOCK,
  GET_DATASET_WITH_LABEL_CLASSES_MOCK,
];

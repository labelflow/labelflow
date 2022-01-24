import { pick } from "lodash";
import { ApolloMocks } from "../../utils/tests/mock-apollo";
import { DATASET_LABEL_CLASSES_QUERY } from "./dataset-classes.query";
import {
  MOCK_DATASET_SIMPLE,
  MOCK_DATASET_WITH_CLASSES,
} from "../../utils/tests/data.fixtures";
import { APOLLO_MOCKS as APOLLO_MOCKS_DELETE } from "./delete-label-class-modal.fixtures";
import { APOLLO_MOCKS as APOLLO_MOCKS_UPSERT } from "./upsert-class-modal/upsert-class-modal.fixtures";

export const APOLLO_MOCKS: ApolloMocks = {
  getLabelClassById: APOLLO_MOCKS_DELETE.getLabelClassById,
  getLabelClassExists: APOLLO_MOCKS_UPSERT.getLabelClassExists,
  getDatasetWithoutLabelClasses: {
    request: {
      query: DATASET_LABEL_CLASSES_QUERY,
      variables: {
        workspaceSlug: MOCK_DATASET_SIMPLE.workspace.slug,
        datasetSlug: MOCK_DATASET_SIMPLE.slug,
      },
    },
    result: {
      data: {
        dataset: {
          ...pick(MOCK_DATASET_SIMPLE, "id", "name"),
          labelClasses: [],
        },
      },
    },
  },
  getDatasetWithLabelClasses: {
    request: {
      query: DATASET_LABEL_CLASSES_QUERY,
      variables: {
        workspaceSlug: MOCK_DATASET_WITH_CLASSES.workspace.slug,
        datasetSlug: MOCK_DATASET_WITH_CLASSES.slug,
      },
    },
    result: {
      data: {
        dataset: {
          ...pick(MOCK_DATASET_WITH_CLASSES, "id", "name"),
          labelClasses: MOCK_DATASET_WITH_CLASSES.labelClasses.map(
            (labelClass) =>
              pick(
                labelClass,
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
  },
};

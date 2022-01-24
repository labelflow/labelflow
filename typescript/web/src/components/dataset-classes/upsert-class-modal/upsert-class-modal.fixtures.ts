import { pick } from "lodash";
import { MATCH_ANY_PARAMETERS } from "wildcard-mock-link";
import { ApolloMocks } from "../../../utils/tests/mock-apollo";
import { DATASET_LABEL_CLASSES_QUERY } from "./dataset-label-classes.query";
import { CREATE_LABEL_CLASS_MUTATION } from "./create-label-class.mutation";
import { LABEL_CLASS_EXISTS_QUERY } from "./label-class-exists.query";
import { UPDATE_LABEL_CLASS_NAME_MUTATION } from "./update-label-class-name.mutation";
import {
  MOCK_DATASET_WITH_CLASSES,
  MOCK_LABEL_CLASS_SIMPLE,
} from "../../../utils/tests/data.fixtures";

export const MOCK_LABEL_CLASS_UPDATED_NAME = "My New Class Name";

export const APOLLO_MOCKS: ApolloMocks = {
  getDatasetWithLabelClasses: {
    request: {
      query: DATASET_LABEL_CLASSES_QUERY,
      variables: {
        workspaceSlug: MOCK_DATASET_WITH_CLASSES.workspace.slug,
        slug: MOCK_DATASET_WITH_CLASSES.slug,
      },
    },
    result: {
      data: {
        dataset: {
          ...pick(MOCK_DATASET_WITH_CLASSES, "id", "name", "slug"),
          labelClasses: MOCK_DATASET_WITH_CLASSES.labelClasses.map(
            (labelClass) => pick(labelClass, "id", "name", "color")
          ),
        },
      },
    },
  },
  createLabelClassDefault: {
    request: {
      query: CREATE_LABEL_CLASS_MUTATION,
      variables: MATCH_ANY_PARAMETERS,
    },
    result: jest.fn((variables) => ({
      data: {
        createLabelClass: {
          id: variables?.id ?? "DEFAULT-NEW-ID",
          name: variables?.name ?? "DEFAULT-NEW-NAME",
          color: variables?.color ?? "DEFAULT-NEW-COLOR",
        },
      },
    })),
  },
  getLabelClassExists: {
    request: {
      query: LABEL_CLASS_EXISTS_QUERY,
      variables: MATCH_ANY_PARAMETERS,
    },
    result: (variables) => {
      return {
        data: {
          labelClassExists:
            variables?.datasetId === MOCK_LABEL_CLASS_SIMPLE.dataset.id &&
            variables?.name === MOCK_LABEL_CLASS_SIMPLE.name,
        },
      };
    },
  },
  updateLabelClassName: {
    request: {
      query: UPDATE_LABEL_CLASS_NAME_MUTATION,
      variables: {
        id: MOCK_LABEL_CLASS_SIMPLE.id,
        name: MOCK_LABEL_CLASS_UPDATED_NAME,
      },
    },
    result: jest.fn(() => ({
      data: {
        updateLabelClass: {
          id: MOCK_LABEL_CLASS_SIMPLE.id,
          name: MOCK_LABEL_CLASS_UPDATED_NAME,
          color: MOCK_LABEL_CLASS_SIMPLE.color,
        },
      },
    })),
  },
};

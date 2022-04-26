import { v4 as uuid } from "uuid";
import { MATCH_ANY_PARAMETERS } from "wildcard-mock-link";
import {
  CreateManyLabelClassesMutation,
  CreateManyLabelClassesMutationVariables,
} from "../../../graphql-types";
import { DEEP_DATASET_WITH_CLASSES_DATA } from "../../../utils/fixtures";
import { ApolloMockResponse, ApolloMockResponses } from "../../../utils/tests";
import { LabelClassWithShortcut } from "../types";
import { CREATE_MANY_LABEL_CLASSES_MUTATION } from "./create-many-label-classes.mutation";

export const UPDATED_LABEL_CLASS_MOCK_NAME = "My New Class Name";

export const LABEL_CLASSES_DATA: LabelClassWithShortcut[] =
  DEEP_DATASET_WITH_CLASSES_DATA.labelClasses;

export const CREATE_MANY_LABEL_CLASSES_MOCK: ApolloMockResponse<
  CreateManyLabelClassesMutation,
  CreateManyLabelClassesMutationVariables
> = {
  request: {
    query: CREATE_MANY_LABEL_CLASSES_MUTATION,
    variables: MATCH_ANY_PARAMETERS,
  },
  result: jest.fn((variables) => ({
    data: {
      createManyLabelClasses: variables.labelClasses.map(() => ({
        id: uuid(),
      })),
    },
  })),
};

export const APOLLO_MOCKS: ApolloMockResponses = [
  CREATE_MANY_LABEL_CLASSES_MOCK,
];

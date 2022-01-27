import React from "react";
import { pick } from "lodash";
import {
  DeleteLabelClassModal,
  deleteLabelClassMutation,
} from "./delete-label-class-modal";
import { getLabelClassByIdQuery } from "./dataset-classes.query";
import {
  DatasetClassesContext,
  DatasetClassesState,
} from "./dataset-classes.context";
import { BASIC_LABEL_CLASS_MOCK } from "../../utils/tests/data.fixtures";
import {
  ApolloMockResponse,
  ApolloMockResponses,
} from "../../utils/tests/apollo-mock";
import {
  getLabelClassById,
  getLabelClassByIdVariables,
} from "./__generated__/getLabelClassById";
import {
  deleteLabelClass,
  deleteLabelClassVariables,
} from "./__generated__/deleteLabelClass";

export type TestComponentProps = {
  setDeleteClassId?: () => void;
  labelClassInfo?: { id: string; datasetId: string };
};

export const TestComponent = ({
  setDeleteClassId = () => {},
  labelClassInfo = {
    id: BASIC_LABEL_CLASS_MOCK.id,
    datasetId: BASIC_LABEL_CLASS_MOCK.dataset.id,
  },
}: TestComponentProps) => (
  <DatasetClassesContext.Provider
    value={{
      ...({} as DatasetClassesState),
      datasetId: labelClassInfo.datasetId,
      setDeleteClassId,
      deleteClassId: labelClassInfo.id,
    }}
  >
    <DeleteLabelClassModal />
  </DatasetClassesContext.Provider>
);

export const GET_LABEL_CLASS_BY_ID_MOCK: ApolloMockResponse<
  getLabelClassByIdVariables,
  getLabelClassById
> = {
  request: {
    query: getLabelClassByIdQuery,
    variables: {
      id: BASIC_LABEL_CLASS_MOCK.id,
    },
  },
  nMatches: Number.POSITIVE_INFINITY,
  result: {
    data: {
      labelClass: {
        ...pick(BASIC_LABEL_CLASS_MOCK, "__typename", "id", "name"),
      },
    },
  },
};

export const DELETE_LABEL_CLASS_SIMPLE_MOCK: ApolloMockResponse<
  deleteLabelClassVariables,
  deleteLabelClass
> = {
  request: {
    query: deleteLabelClassMutation,
    variables: { id: BASIC_LABEL_CLASS_MOCK.id },
  },
  result: jest.fn(() => {
    return {
      data: {
        deleteLabelClass: {
          __typename: "LabelClass",
          id: BASIC_LABEL_CLASS_MOCK.id,
        },
      },
    };
  }),
};

export const APOLLO_MOCKS: ApolloMockResponses = [
  GET_LABEL_CLASS_BY_ID_MOCK,
  DELETE_LABEL_CLASS_SIMPLE_MOCK,
];

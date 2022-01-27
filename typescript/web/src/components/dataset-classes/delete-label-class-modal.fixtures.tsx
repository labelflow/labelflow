import React from "react";
import { pick } from "lodash";
import {
  DeleteLabelClassModal,
  deleteLabelClassMutation,
  getLabelClassByIdQuery,
} from "./delete-label-class-modal";
import {
  DatasetClassesContext,
  DatasetClassesState,
} from "./dataset-classes.context";
import { BASIC_LABEL_CLASS_MOCK } from "../../utils/tests/data.fixtures";
import { ApolloMockResponse } from "../../utils/tests/apollo-mock";

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

export const GET_LABEL_CLASS_BY_ID_MOCK: ApolloMockResponse = {
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
        ...pick(BASIC_LABEL_CLASS_MOCK, "id", "name"),
      },
    },
  },
};

export const DELETE_LABEL_CLASS_SIMPLE_MOCK: ApolloMockResponse = {
  request: {
    query: deleteLabelClassMutation,
    variables: { id: BASIC_LABEL_CLASS_MOCK.id },
  },
  result: jest.fn(() => {
    return {
      data: { deleteLabelClass: { id: BASIC_LABEL_CLASS_MOCK.id } },
    };
  }),
};

export const APOLLO_MOCKS: ApolloMockResponse[] = [
  GET_LABEL_CLASS_BY_ID_MOCK,
  DELETE_LABEL_CLASS_SIMPLE_MOCK,
];

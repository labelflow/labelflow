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
import { MOCK_LABEL_CLASS_SIMPLE } from "../../utils/tests/data.fixtures";
import { ApolloMocks } from "../../utils/tests/mock-apollo";

export type TestComponentProps = {
  setDeleteClassId?: () => void;
  labelClassInfo?: { id: string; datasetId: string };
};

export const TestComponent = ({
  setDeleteClassId = () => {},
  labelClassInfo = {
    id: MOCK_LABEL_CLASS_SIMPLE.id,
    datasetId: MOCK_LABEL_CLASS_SIMPLE.dataset.id,
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

export const APOLLO_MOCKS: ApolloMocks = {
  getLabelClassById: {
    request: {
      query: getLabelClassByIdQuery,
      variables: {
        id: MOCK_LABEL_CLASS_SIMPLE.id,
      },
    },
    nMatches: Number.POSITIVE_INFINITY,
    result: {
      data: {
        labelClass: {
          ...pick(MOCK_LABEL_CLASS_SIMPLE, "id", "name"),
        },
      },
    },
  },
  deleteLabelClassSimple: {
    request: {
      query: deleteLabelClassMutation,
      variables: { id: MOCK_LABEL_CLASS_SIMPLE.id },
    },
    result: jest.fn(() => {
      return {
        data: { deleteLabelClass: { id: MOCK_LABEL_CLASS_SIMPLE.id } },
      };
    }),
  },
};

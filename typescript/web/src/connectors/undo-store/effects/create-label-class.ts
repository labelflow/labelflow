import { ApolloClient } from "@apollo/client";

import { v4 as uuid } from "uuid";
import { useLabelingStore } from "../../labeling-state";

import { Effect } from "..";

import { createLabelClassMutationUpdate } from "./cache-updates/create-label-class-mutation-update";
import { deleteLabelClassMutationUpdate } from "./cache-updates/delete-label-class-mutation-update";
import {
  CREATE_LABEL_CLASS_QUERY,
  DELETE_LABEL_CLASS_MUTATION,
} from "./shared-queries";

export const createCreateLabelClassEffect = (
  {
    name,
    color,
    datasetId,
    selectedLabelClassIdPrevious,
  }: {
    name: string;
    color: string;
    datasetId: string;
    selectedLabelClassIdPrevious: string | null;
  },
  {
    client,
  }: {
    client: ApolloClient<object>;
  }
): Effect => ({
  do: async (labelClassId: string = uuid()) => {
    await client.mutate({
      mutation: CREATE_LABEL_CLASS_QUERY,
      variables: { data: { name, color, datasetId, id: labelClassId } },
      update: createLabelClassMutationUpdate(datasetId),
      optimisticResponse: {
        createLabelClass: {
          id: labelClassId,
          name,
          color,
          __typename: "LabelClass",
        },
      },
    });

    useLabelingStore.setState({ selectedLabelClassId: labelClassId });
    return labelClassId;
  },
  undo: async (labelClassId: string) => {
    await client.mutate({
      mutation: DELETE_LABEL_CLASS_MUTATION,
      variables: {
        where: { id: labelClassId },
      },
      update: deleteLabelClassMutationUpdate(datasetId),
      optimisticResponse: {
        deleteLabelClass: { __typename: "LabelClass", id: labelClassId },
      },
    });

    useLabelingStore.setState({
      selectedLabelClassId: selectedLabelClassIdPrevious,
    });

    return labelClassId;
  },
});

import { ApolloClient } from "@apollo/client";

import { v4 as uuid } from "uuid";
import { useLabelingStore } from "../../labeling-state";

import { Effect } from "..";
import { createLabelClassMutationUpdate } from "./cache-updates/create-label-class-mutation-update";
import { deleteLabelClassMutationUpdate } from "./cache-updates/delete-label-class-mutation-update";
import {
  GET_LABEL_QUERY,
  CREATE_LABEL_CLASS_QUERY,
  UPDATE_LABEL_MUTATION,
  DELETE_LABEL_CLASS_MUTATION,
} from "./shared-queries";
import { updateLabelClassOfLabel } from "./cache-updates/update-label-class-of-label";

export const createCreateLabelClassAndUpdateLabelEffect = (
  {
    name,
    color,
    datasetId,
    selectedLabelId,
  }: {
    name: string;
    color: string;
    datasetId: string;
    selectedLabelId: string;
  },
  {
    client,
  }: {
    client: ApolloClient<object>;
  }
): Effect => ({
  do: async () => {
    // We create the labelClassId on the client to be able to return its correct value during the optimistic response
    const labelClassId = uuid();

    const labelPreviousDetailsPromise = client.query({
      query: GET_LABEL_QUERY,
      variables: { id: selectedLabelId },
    });

    /** There is room for enhancement here.
     * We await the mutation that create the label class before triggering the mutation which updates the label with the new label class.
     * This makes the optimistic less useful.
     * We still need to wait for the first mutation to answer before doing the update and optimistic response of the second one.
     *
     * Technically, it is not needed to wait for the first mutation as we already know the id of the label class we will create, however,
     * we have a check in the backend to ensure that the new label class exist before updating a label. This would add a race condition.
     *
     * It would be better if we could create the label class and update the label in the same mutation.
     */
    await client.mutate<{
      createLabelClass: {
        id: string;
        name: string;
        color: string;
        __typename: "LabelClass";
      };
    }>({
      mutation: CREATE_LABEL_CLASS_QUERY,
      variables: { data: { name, color, datasetId, id: labelClassId } },
      optimisticResponse: {
        createLabelClass: {
          id: labelClassId,
          name,
          color,
          __typename: "LabelClass",
        },
      },
      update: createLabelClassMutationUpdate(datasetId),
    });

    useLabelingStore.setState({ selectedLabelClassId: labelClassId });

    const labelClassIdPrevious =
      (await labelPreviousDetailsPromise)?.data?.label?.labelClass?.id ?? null;

    await client.mutate<{
      updateLabel: {
        id: string;
        labelClass: {
          id: string;
          __typename: "LabelClass";
        };
        __typename: "Label";
      };
    }>({
      mutation: UPDATE_LABEL_MUTATION,
      variables: {
        where: { id: selectedLabelId },
        data: { labelClassId: labelClassId ?? null },
      },
      optimisticResponse: {
        updateLabel: {
          id: selectedLabelId,
          labelClass: { id: labelClassId, __typename: "LabelClass" },
          __typename: "Label",
        },
      },
      update: updateLabelClassOfLabel(labelClassIdPrevious),
    });

    return {
      labelClassId,
      labelClassIdPrevious,
    };
  },
  undo: async ({
    labelClassId,
    labelClassIdPrevious,
  }: {
    labelClassId: string;
    labelClassIdPrevious: string;
  }) => {
    await client.mutate({
      mutation: UPDATE_LABEL_MUTATION,
      variables: {
        where: { id: selectedLabelId },
        data: { labelClassId: labelClassIdPrevious ?? null },
      },
      optimisticResponse: {
        updateLabel: {
          id: selectedLabelId,
          labelClass: labelClassIdPrevious
            ? { id: labelClassIdPrevious, __typename: "LabelClass" }
            : null,
          __typename: "Label",
        },
      },
      update: updateLabelClassOfLabel(labelClassId),
    });

    useLabelingStore.setState({ selectedLabelClassId: labelClassIdPrevious });

    await client.mutate({
      mutation: DELETE_LABEL_CLASS_MUTATION,
      variables: {
        where: { id: labelClassId },
      },
      optimisticResponse: {
        deleteLabelClass: { __typename: "LabelClass", id: labelClassId },
      },
      update: deleteLabelClassMutationUpdate(datasetId),
    });

    return {
      labelClassId,
      labelClassIdPrevious,
    };
  },
  redo: async ({
    labelClassId,
    labelClassIdPrevious,
  }: {
    labelClassId: string;
    labelClassIdPrevious: string;
  }) => {
    await client.mutate({
      mutation: CREATE_LABEL_CLASS_QUERY,
      variables: { data: { name, color, id: labelClassId, datasetId } },
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

    await client.mutate({
      mutation: UPDATE_LABEL_MUTATION,
      variables: {
        where: { id: selectedLabelId },
        data: { labelClassId },
      },
      optimisticResponse: {
        updateLabel: {
          id: selectedLabelId,
          labelClass: { id: labelClassId, __typename: "LabelClass" },
          __typename: "Label",
        },
      },
      update: updateLabelClassOfLabel(labelClassIdPrevious),
    });

    return {
      labelClassId,
      labelClassIdPrevious,
    };
  },
});

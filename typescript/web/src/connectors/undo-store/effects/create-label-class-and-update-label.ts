import { gql, ApolloClient } from "@apollo/client";

import { v4 as uuid } from "uuid";
import { useLabelingStore } from "../../labeling-state";

import { Effect } from "..";
import { createLabelClassMutationUpdate } from "./cache-updates/create-label-class-mutation-update";
import { deleteLabelClassMutationUpdate } from "./cache-updates/delete-label-class-mutation-update";

const getLabelQuery = gql`
  query getLabel($id: ID!) {
    label(where: { id: $id }) {
      id
      labelClass {
        id
      }
    }
  }
`;

const createLabelClassQuery = gql`
  mutation createLabelClass($data: LabelClassCreateInput!) {
    createLabelClass(data: $data) {
      id
      name
      color
    }
  }
`;

const deleteLabelClassQuery = gql`
  mutation deleteLabelClass($where: LabelClassWhereUniqueInput!) {
    deleteLabelClass(where: $where) {
      id
    }
  }
`;

const updateLabelQuery = gql`
  mutation updateLabelClass(
    $where: LabelWhereUniqueInput!
    $data: LabelUpdateInput!
  ) {
    updateLabel(where: $where, data: $data) {
      id
      labelClass {
        id
      }
    }
  }
`;

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
      query: getLabelQuery,
      variables: { id: selectedLabelId },
    });

    /** There is room for enhancement here.
     * We await the mutation that create the label class before triggering the mutation which updates the label with the new label class.
     * This makes the optimistic less useful.
     * We still need to wait for the first mutation to answer before doing the update and optimistic response of the second one.
     *
     * Technically, it is not needed to wait for the first mutation as we already now the id of the label class we will create, however,
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
      mutation: createLabelClassQuery,
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
      mutation: updateLabelQuery,
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
      // no need to write an update as apollo automatically does it if we query the labelClass id
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
      mutation: updateLabelQuery,
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
      // no need to write an update as apollo automatically does it if we query the labelClass id
    });

    useLabelingStore.setState({ selectedLabelClassId: labelClassIdPrevious });

    await client.mutate({
      mutation: deleteLabelClassQuery,
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
      mutation: createLabelClassQuery,
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
      mutation: updateLabelQuery,
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
      // no need to write an update as apollo automatically does it if we query the labelClass id
    });

    return {
      labelClassId,
      labelClassIdPrevious,
    };
  },
});

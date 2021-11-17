import { gql, ApolloClient } from "@apollo/client";

import { v4 as uuid } from "uuid";
import { useLabelingStore } from "../../labeling-state";

import { Effect } from "..";

import { createLabelClassMutationUpdate } from "./cache-updates/create-label-class-mutation-update";
import { deleteLabelClassMutationUpdate } from "./cache-updates/delete-label-class-mutation-update";

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
  do: async () => {
    const labelClassId = uuid();

    await client.mutate({
      mutation: createLabelClassQuery,
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
      mutation: deleteLabelClassQuery,
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
  redo: async (labelClassId: string) => {
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

    return labelClassId;
  },
});

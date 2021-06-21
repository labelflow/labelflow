import { ApolloClient } from "@apollo/client";
import gql from "graphql-tag";

import { useLabellingStore } from "../labelling-state";
import { Effect } from "../undo-store";

const labelQuery = gql`
  query getLabel($id: ID!) {
    label(where: { id: $id }) {
      id
      labelClass {
        id
      }
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
    }
  }
`;

export const createUpdateLabelClassOfLabelEffect = (
  {
    selectedLabelId,
    selectedLabelClassId,
  }: { selectedLabelId: string | null; selectedLabelClassId: string | null },
  {
    client,
  }: {
    client: ApolloClient<object>;
  }
): Effect => ({
  do: async () => {
    const {
      data: {
        label: { labelClass },
      },
    } = await client.query({
      query: labelQuery,
      variables: { id: selectedLabelId },
    });

    const labelClassIdPrevious = labelClass?.id ?? null;

    await client.mutate({
      mutation: updateLabelQuery,
      variables: {
        where: { id: selectedLabelId },
        data: { labelClassId: selectedLabelClassId ?? null },
      },
      refetchQueries: ["getImageLabels"],
    });
    useLabellingStore.setState({ selectedLabelClassId });

    return labelClassIdPrevious;
  },
  undo: async (labelClassIdPrevious: string) => {
    await client.mutate({
      mutation: updateLabelQuery,
      variables: {
        where: { id: selectedLabelId },
        data: { labelClassId: labelClassIdPrevious ?? null },
      },
      refetchQueries: ["getImageLabels"],
    });

    useLabellingStore.setState({ selectedLabelClassId: labelClassIdPrevious });
    return labelClassIdPrevious;
  },
});

import { gql, ApolloClient } from "@apollo/client";

import { useLabelingStore } from "../../labeling-state";
import { Effect } from "..";

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
    } = selectedLabelId
      ? await client.query({
          query: getLabelQuery,
          variables: { id: selectedLabelId },
        })
      : { data: { label: { labelClass: null } } };

    const labelClassIdPrevious = labelClass?.id ?? null;

    await client.mutate({
      mutation: updateLabelQuery,
      variables: {
        where: { id: selectedLabelId },
        data: { labelClassId: selectedLabelClassId ?? null },
      },
      refetchQueries: ["getImageLabels"],
    });
    useLabelingStore.setState({ selectedLabelClassId });

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

    useLabelingStore.setState({ selectedLabelClassId: labelClassIdPrevious });
    return labelClassIdPrevious;
  },
});

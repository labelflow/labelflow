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

const updateLabelMutation = gql`
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
    const labelClassIdPrevious = selectedLabelId
      ? ((
          await client.query({
            query: getLabelQuery,
            variables: { id: selectedLabelId },
          })
        ).data?.label?.labelClass?.id as string)
      : null;

    await client.mutate({
      mutation: updateLabelMutation,
      variables: {
        where: { id: selectedLabelId },
        data: { labelClassId: selectedLabelClassId },
      },
      optimisticResponse: {
        updateLabel: {
          id: selectedLabelId,
          labelClass: selectedLabelClassId
            ? { id: selectedLabelClassId, __typename: "LabelClass" }
            : null,
          __typename: "Label",
        },
      },
      // no need to write an update as apollo automatically does it if we query the labelClass id
    });

    useLabelingStore.setState({ selectedLabelClassId });

    return labelClassIdPrevious;
  },
  undo: async (labelClassIdPrevious: string | null) => {
    await client.mutate({
      mutation: updateLabelMutation,
      variables: {
        where: { id: selectedLabelId },
        data: { labelClassId: labelClassIdPrevious },
      },
      optimisticResponse: {
        updateLabel: {
          id: selectedLabelId,
          labelClass: selectedLabelClassId
            ? { id: selectedLabelClassId, __typename: "LabelClass" }
            : null,
          __typename: "Label",
        },
      },
      // no need to write an update as apollo automatically does it if we query the labelClass id
    });

    useLabelingStore.setState({ selectedLabelClassId: labelClassIdPrevious });
    return labelClassIdPrevious;
  },
});

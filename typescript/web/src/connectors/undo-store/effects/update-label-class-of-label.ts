import { gql, ApolloClient } from "@apollo/client";

import { useLabelingStore } from "../../labeling-state";
import { Effect } from "..";

import { updateLabelClassOfLabel } from "./cache-updates/update-label-class-of-label";
import { GET_LABEL_QUERY } from "./shared-queries";

export const UPDATE_LABEL_MUTATION = gql`
  mutation UpdateLabelClassOfLabelMutation(
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
            query: GET_LABEL_QUERY,
            variables: { id: selectedLabelId },
          })
        ).data?.label?.labelClass?.id as string) || null
      : null;
    await client.mutate({
      mutation: UPDATE_LABEL_MUTATION,
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
      update: updateLabelClassOfLabel(labelClassIdPrevious),
    });

    useLabelingStore.setState({ selectedLabelClassId });

    return labelClassIdPrevious;
  },
  undo: async (labelClassIdPrevious: string | null) => {
    await client.mutate({
      mutation: UPDATE_LABEL_MUTATION,
      variables: {
        where: { id: selectedLabelId },
        data: { labelClassId: labelClassIdPrevious },
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
      update: updateLabelClassOfLabel(selectedLabelClassId),
    });

    useLabelingStore.setState({ selectedLabelClassId: labelClassIdPrevious });
    return labelClassIdPrevious;
  },
});

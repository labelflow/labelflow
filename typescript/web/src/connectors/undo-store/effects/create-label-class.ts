import { gql, ApolloClient } from "@apollo/client";

import { useLabelingStore } from "../../labeling-state";

import { Effect } from "..";
import { getDatasetsQuery } from "../../../pages/[workspaceSlug]/datasets";
import { datasetLabelClassesQuery } from "../../../components/dataset-class-list/class-item";

const createLabelClassQuery = gql`
  mutation createLabelClass($data: LabelClassCreateInput!) {
    createLabelClass(data: $data) {
      id
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
    datasetSlug,
    workspaceSlug,
    selectedLabelClassIdPrevious,
  }: {
    name: string;
    color: string;
    datasetId: string;
    datasetSlug: string;
    workspaceSlug: string;
    selectedLabelClassIdPrevious: string | null;
  },
  {
    client,
  }: {
    client: ApolloClient<object>;
  }
): Effect => ({
  do: async () => {
    const {
      data: {
        createLabelClass: { id: labelClassId },
      },
    } = await client.mutate({
      mutation: createLabelClassQuery,
      variables: { data: { name, color, datasetId } },
      refetchQueries: [
        "getLabelClassesOfDataset",
        { query: getDatasetsQuery },
        {
          query: datasetLabelClassesQuery,
          variables: { slug: datasetSlug, workspaceSlug },
        },
      ],
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
      refetchQueries: [
        "getLabelClassesOfDataset",
        { query: getDatasetsQuery },
        {
          query: datasetLabelClassesQuery,
          variables: { slug: datasetSlug, workspaceSlug },
        },
      ],
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
      refetchQueries: [
        "getLabelClassesOfDataset",
        { query: getDatasetsQuery },
        {
          query: datasetLabelClassesQuery,
          variables: { slug: datasetSlug, workspaceSlug },
        },
      ],
    });

    useLabelingStore.setState({ selectedLabelClassId: labelClassId });

    return labelClassId;
  },
});

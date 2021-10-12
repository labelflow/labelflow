import { gql, ApolloClient } from "@apollo/client";

import { useLabelingStore } from "../../labeling-state";

import { Effect } from "..";
import { getDatasetsQuery } from "../../../pages/[workspaceSlug]/datasets";
import { datasetLabelClassesQuery } from "../../../components/dataset-class-list/class-item";

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
    }
  }
`;

export const createCreateLabelClassAndUpdateLabelEffect = (
  {
    name,
    color,
    datasetId,
    datasetSlug,
    workspaceSlug,
    selectedLabelId,
  }: {
    name: string;
    color: string;
    datasetId: string;
    datasetSlug: string;
    workspaceSlug: string;
    selectedLabelId: string | null;
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

    const {
      data: {
        label: { labelClass },
      },
    } = await client.query({
      query: getLabelQuery,
      variables: { id: selectedLabelId },
    });

    const labelClassIdPrevious = labelClass?.id ?? null;

    await client.mutate({
      mutation: updateLabelQuery,
      variables: {
        where: { id: selectedLabelId },
        data: { labelClassId: labelClassId ?? null },
      },
      refetchQueries: ["getImageLabels"],
    });
    useLabelingStore.setState({ selectedLabelClassId: labelClassId });

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
      refetchQueries: ["getImageLabels"],
    });
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

    useLabelingStore.setState({ selectedLabelClassId: labelClassIdPrevious });
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
      refetchQueries: [
        "getLabelClassesOfDataset",
        { query: getDatasetsQuery },
        {
          query: datasetLabelClassesQuery,
          variables: { slug: datasetSlug, workspaceSlug },
        },
      ],
    });

    await client.mutate({
      mutation: updateLabelQuery,
      variables: {
        where: { id: selectedLabelId },
        data: { labelClassId: labelClassId ?? null },
      },
      refetchQueries: ["getImageLabels"],
    });

    useLabelingStore.setState({ selectedLabelClassId: labelClassId });
    return {
      labelClassId,
      labelClassIdPrevious,
    };
  },
});

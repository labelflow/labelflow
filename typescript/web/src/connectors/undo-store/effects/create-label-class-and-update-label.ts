import { gql, ApolloClient } from "@apollo/client";

import { LabelClass } from "@labelflow/graphql-types";
import { useLabellingStore } from "../../labelling-state";
import {
  getNextClassColor,
  hexColorSequence,
} from "../../../utils/class-color-generator";
import { Effect } from "..";
import { getDatasetsQuery } from "../../../pages/local/datasets";
import { datasetLabelClassesQuery } from "../../../components/dataset-class-list/class-item";

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
    selectedLabelId,
  }: {
    name: string;
    color: string;
    datasetId: string;
    datasetSlug: string;
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
        { query: datasetLabelClassesQuery, variables: { slug: datasetSlug } },
      ],
    });

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
        data: { labelClassId: labelClassId ?? null },
      },
      refetchQueries: ["getImageLabels"],
    });
    useLabellingStore.setState({ selectedLabelClassId: labelClassId });

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
        { query: datasetLabelClassesQuery, variables: { slug: datasetSlug } },
      ],
    });

    useLabellingStore.setState({ selectedLabelClassId: labelClassIdPrevious });
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
        { query: datasetLabelClassesQuery, variables: { slug: datasetSlug } },
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

    useLabellingStore.setState({ selectedLabelClassId: labelClassId });
    return {
      labelClassId,
      labelClassIdPrevious,
    };
  },
});

export const createNewLabelClassAndUpdateLabelCurry =
  ({
    labelClasses,
    datasetId,
    datasetSlug,
    perform,
    onClose = () => {},
    client,
  }: {
    labelClasses: LabelClass[];
    datasetId: string;
    datasetSlug: string;
    perform: any;
    onClose?: () => void;
    client: ApolloClient<object>;
  }) =>
  async (name: string, selectedLabelId: string | null) => {
    const newClassColor =
      labelClasses.length < 1
        ? hexColorSequence[0]
        : getNextClassColor(labelClasses[labelClasses.length - 1].color);
    perform(
      createCreateLabelClassAndUpdateLabelEffect(
        { name, color: newClassColor, selectedLabelId, datasetId, datasetSlug },
        { client }
      )
    );
    onClose();
  };

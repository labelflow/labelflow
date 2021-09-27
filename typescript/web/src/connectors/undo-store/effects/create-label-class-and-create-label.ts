import { gql, ApolloClient } from "@apollo/client";

import { GeoJSONPolygon } from "ol/format/GeoJSON";
import { LabelType } from "@labelflow/graphql-types";
import { useLabellingStore } from "../../labelling-state";

import { Effect } from "..";
import { getDatasetsQuery } from "../../../pages/local/datasets";
import { datasetLabelClassesQuery } from "../../../components/dataset-class-list/class-item";
import {
  addLabelToImageInCache,
  removeLabelFromImageCache,
} from "./create-label";

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

const createLabelMutation = gql`
  mutation createLabel(
    $id: ID
    $imageId: ID!
    $labelType: LabelType!
    $labelClassId: ID
    $geometry: GeometryInput!
  ) {
    createLabel(
      data: {
        id: $id
        type: $labelType
        imageId: $imageId
        labelClassId: $labelClassId
        geometry: $geometry
      }
    ) {
      id
    }
  }
`;

const deleteLabelMutation = gql`
  mutation deleteLabel($id: ID!) {
    deleteLabel(where: { id: $id }) {
      id
    }
  }
`;

export const createCreateLabelClassAndCreateLabelEffect = (
  {
    name,
    color,
    datasetId,
    datasetSlug,
    selectedLabelId,
    imageId,
    selectedLabelClassId,
    geometry,
    labelType,
  }: {
    name: string;
    color: string;
    datasetId: string;
    datasetSlug: string;
    selectedLabelId: string | null;
    imageId: string;
    selectedLabelClassId: string | null;
    geometry: GeoJSONPolygon;
    labelType: LabelType;
  },
  {
    setSelectedLabelId,
    client,
  }: {
    setSelectedLabelId: (labelId: string | null) => void;
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

    const createLabelInputs = {
      imageId,
      labelClassId: selectedLabelClassId,
      geometry,
      labelType,
    };
    const { data } = await client.mutate({
      mutation: createLabelMutation,
      variables: createLabelInputs,
      refetchQueries: ["countLabels", "getDatasets", "countLabelsOfDataset"],
      optimisticResponse: {
        createLabel: { id: `temp-${Date.now()}`, __typename: "Label" },
      },
      update(cache, { data: mutationPayloadData }) {
        const id = mutationPayloadData?.createLabel?.id;
        if (typeof id !== "string") {
          return;
        }

        addLabelToImageInCache(cache, { ...createLabelInputs, id });
      },
    });

    if (typeof data?.createLabel?.id !== "string") {
      throw new Error("Couldn't get the id of the newly created label");
    }

    setSelectedLabelId(data.createLabel.id);

    return {
      id: data.createLabel.id,
      labelClassId,
      labelClassIdPrevious,
    };
  },
  undo: async ({
    id,
    labelClassId,
    labelClassIdPrevious,
  }: {
    id: string;
    labelClassId: string;
    labelClassIdPrevious: string;
  }) => {
    await client.mutate({
      mutation: deleteLabelMutation,
      variables: { id },
      refetchQueries: ["countLabels", "getDatasets", "countLabelsOfDataset"],
      optimisticResponse: { deleteLabel: { id, __typename: "Label" } },
      update(cache) {
        removeLabelFromImageCache(cache, { imageId, id });
      },
    });

    setSelectedLabelId(null);

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
      id,
      labelClassId,
      labelClassIdPrevious,
    };
  },
  redo: async ({
    id,
    labelClassId,
    labelClassIdPrevious,
  }: {
    id: string;
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

    const createLabelInputs = {
      id,
      imageId,
      labelClassId: selectedLabelClassId,
      geometry,
      labelType,
    };
    const { data } = await client.mutate({
      mutation: createLabelMutation,
      variables: createLabelInputs,
      refetchQueries: ["countLabels", "getDatasets", "countLabelsOfDataset"],
      optimisticResponse: {
        createLabel: { id: `temp-${Date.now()}`, __typename: "Label" },
      },
      update(cache) {
        addLabelToImageInCache(cache, createLabelInputs);
      },
    });

    if (typeof data?.createLabel?.id !== "string") {
      throw new Error("Couldn't get the id of the newly created label");
    }

    setSelectedLabelId(data.createLabel.id);
    return {
      id,
      labelClassId,
      labelClassIdPrevious,
    };
  },
});
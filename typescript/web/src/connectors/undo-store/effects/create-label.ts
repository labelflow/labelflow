import { ApolloClient, gql } from "@apollo/client";

import { GeometryInput, LabelType } from "@labelflow/graphql-types";
import { GeoJSONPolygon } from "ol/format/GeoJSON";
import { Effect } from "..";
import { addLabelToImageInCache } from "./cache-updates/add-label-to-image-in-cache";
import { removeLabelFromImageCache } from "./cache-updates/remove-label-from-image-cache";

export type CreateLabelInputs = {
  imageId: string;
  id?: string;
  labelClassId: string | null | undefined;
  geometry: GeometryInput;
};

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

export const imageDimensionsQuery = gql`
  query imageDimensions($id: ID!) {
    image(where: { id: $id }) {
      id
      width
      height
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

export const createdLabelFragment = gql`
  fragment NewLabel on Label {
    id
    x
    y
    width
    height
    labelClass {
      id
    }
    geometry {
      type
      coordinates
    }
  }
`;

export const createCreateLabelEffect = (
  {
    imageId,
    selectedLabelClassId,
    geometry,
    labelType,
  }: {
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
    return data.createLabel.id;
  },
  undo: async (id: string): Promise<string> => {
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
    return id;
  },
  redo: async (id: string) => {
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
    return data.createLabel.id;
  },
});

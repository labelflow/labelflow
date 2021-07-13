import { ApolloCache, ApolloClient, Reference } from "@apollo/client";
import GeoJSON from "ol/format/GeoJSON";
import gql from "graphql-tag";

import { Effect } from "../../../../connectors/undo-store";
import { GeometryInput } from "../../../../graphql-types.generated";

type CreateLabelInputs = {
  imageId: string;
  id?: string;
  labelClassId: string | null | undefined;
  geometry: GeometryInput;
};

const createLabelMutation = gql`
  mutation createLabel(
    $id: ID
    $imageId: ID!
    $labelClassId: ID
    $geometry: GeometryInput!
  ) {
    createLabel(
      data: {
        id: $id
        type: "Polygon"
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

const createdLabelFragment = gql`
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

export function addLabelToImageInCache(
  cache: ApolloCache<{
    createLabel: {
      id: string;
      __typename: string;
    };
  }>,
  { imageId, id, labelClassId, geometry }: CreateLabelInputs & { id: string }
) {
  const createdLabel = {
    id,
    labelClass:
      labelClassId != null
        ? {
            id: labelClassId,
            __typename: "LabelClass",
          }
        : null,
    geometry,
    __typename: "Label",
  };

  cache.modify({
    id: cache.identify({ id: imageId, __typename: "Image" }),
    fields: {
      labels: (existingLabelsRefs = []) => {
        const newLabelRef = cache.writeFragment({
          data: createdLabel,
          fragment: createdLabelFragment,
        });

        return [...existingLabelsRefs, newLabelRef];
      },
    },
  });
}

export function removeLabelFromImageCache(
  cache: ApolloCache<{ deleteLabel: { id: string; __typename: string } }>,
  { imageId, id }: { imageId: string; id: string }
) {
  cache.modify({
    id: cache.identify({ id: imageId, __typename: "Image" }),
    fields: {
      labels: (existingLabelsRefs: Reference[] = [], { readField }) => {
        return existingLabelsRefs.filter(
          (labelRef) => readField("id", labelRef) !== id
        );
      },
    },
  });
}

export const createLabelEffect = (
  {
    imageId,
    selectedLabelClassId,
    geometry,
  }: {
    imageId: string;
    selectedLabelClassId: string | null;
    geometry: GeoJSON.Polygon;
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
    };

    const { data } = await client.mutate({
      mutation: createLabelMutation,
      variables: createLabelInputs,
      refetchQueries: ["countLabels"],
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
      refetchQueries: ["countLabels"],
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
    };
    const { data } = await client.mutate({
      mutation: createLabelMutation,
      variables: createLabelInputs,
      refetchQueries: ["countLabels"],
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
